import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { OcrService } from "src/ocr/ocr.service";
import { LlmService } from "src/llm/llm.service";

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
        title: file.path,
        url: file.originalname,
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
}