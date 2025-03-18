import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { PrismaService } from "src/prisma/prisma.service";
import { OcrService } from "src/ocr/ocr.service";
import { LlmService } from "src/llm/llm.service";
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private ocrService: OcrService,
    private llmService: LlmService,
  ) {}

  async processDocument(file, userId: string) {
    const extractText = await this.ocrService.extractText(file.path);

    const chat = await this.prisma.chat.create({
      data: {
        message: extractText,
        userId,
      },
    });

    const document = await this.prisma.document.create({
      data: {
        title: file.originalname,
        url: file.path,
        chatId: chat.id,
      },
    });

    const llmResponse = await this.llmService.processDocument(chat.id, extractText);

    return {
      documentId: document.id,
      chatId: chat.id,
      llmResponse,
    };
  }

  async getChat(chatId: string, userId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        documents: true,
        interactions: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.userId !== userId) {
      throw new ForbiddenException('You are not allowed to access this chat');
    }

    return chat;
  }

  async interact(body) {
    const { chatId, message } = body;

    return this.llmService.interact(chatId, message);
  }

  async getChats(userId: string) {
    const chats = await this.prisma.chat.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        documents: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return chats;
  }

  async downloadDocument(chatId: string, userId: string, res) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        documents: true,
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.userId !== userId) {
      throw new ForbiddenException('You are not allowed to access this chat');
    }

    const document = chat.documents[0];
    const filePath = document.url;

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Document not found');
    }

    const fileName = path.basename(filePath);

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/octet-stream');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  async downloadDocumentAndInteractions(chatId: string, userId: string, res) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        documents: true,
        interactions: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.userId !== userId) {
      throw new ForbiddenException('You are not allowed to access this chat');
    }

    const document = chat.documents[0];
    const filePath = document.url;

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Document not found');
    }

    // Create a new PDF
    const pdfDoc = await PDFDocument.create();

    // Insert the document into the PDF
    if (document.title.endsWith('.pdf')) { // If the document is already a PDF
      const existingPdfBytes = fs.readFileSync(filePath);
      const existingPdf = await PDFDocument.load(existingPdfBytes);
      const copiedPages = await pdfDoc.copyPages(existingPdf, existingPdf.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    } else { // If the document is an image
      const imageBytes = fs.readFileSync(filePath);
      const image = await pdfDoc.embedPng(imageBytes);
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const margin = 50;
    const lineHeight = 16; // Line height in PDF points

    const addWrappedText = (page, text, x, y, maxWidth) => {
      const paragraphs = text.split('\n'); // Split text into paragraphs
      let yPos = y;
    
      paragraphs.forEach(paragraph => {
        const words = paragraph.split(' ');
        let line = '';
    
        words.forEach(word => {
          const testLine = line + word + ' ';
          const width = font.widthOfTextAtSize(testLine, fontSize);
    
          if (width > maxWidth) {
            page.drawText(line, { x, y: yPos, size: fontSize, font, color: rgb(0, 0, 0) });
            line = word + ' ';
            yPos -= lineHeight;
          } else {
            line = testLine;
          }
        });
    
        if (line) {
          page.drawText(line, { x, y: yPos, size: fontSize, font, color: rgb(0, 0, 0) });
          yPos -= lineHeight;
        }
    
        // Add a line break
        yPos -= lineHeight;
      });
    
      return yPos;
    };

    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    let yPos = height - margin;

    // Add interactions to the PDF
    chat.interactions.forEach(interaction => {
      const text = `Q: ${interaction.query}\nA: ${interaction.response}\n`;
  
      // If the text doesn't fit on the current page, create a new one
      if (yPos - lineHeight * 3 < margin) {
        page = pdfDoc.addPage();
        yPos = height - margin;
      }
  
      yPos = addWrappedText(page, text, margin, yPos, width - 2 * margin);
    });

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Disposition', `attachment; filename=${document.title}`);
    res.setHeader('Content-Type', 'application/pdf');
    res.end(pdfBytes);
  }
}