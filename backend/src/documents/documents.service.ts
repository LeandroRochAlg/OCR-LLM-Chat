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
}