import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class LlmService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async processDocument(chatId: string, ocrText: string): Promise<string> {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (!chat) {
      throw new Error("Chat not found");
    }

    // Ask the model to explain or provide context to the document given
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant that helps extract information from documents. Respond only based on the provided text. Give a summary of the document. Provide context to the document. Answer in the language of the document.',
        },
        {
          role: 'user',
          content: `Document: ${ocrText}`,
        },
      ],
    });

    const answer = response.choices[0].message.content;

    if (!answer) {
      throw new Error("No answer provided");
    }

    // Store the response in the chat
    await this.prisma.interaction.create({
      data: {
        query: ocrText,
        response: answer,
        chatId,
      }
    })

    return answer;
  }
}