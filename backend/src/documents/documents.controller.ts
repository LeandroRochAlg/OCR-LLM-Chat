import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param, UseGuards, Req } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { DocumentsService } from "./documents.service";
import { JwtAuthGuard } from "src/auth/jwt.guard";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("documents")
export class DocumentsController {
  constructor(private readonly documentService: DocumentsService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadDocument(@UploadedFile() file, @Req() req) {
    const userId = req.user.id;
    return this.documentService.processDocument(file, userId);
  }

  @Get(':chatId')
  @UseGuards(JwtAuthGuard)
  async getChat(@Param('chatId') chatId: string, @Req() req) {
    const userId = req.user.id;
    return this.documentService.getChat(chatId, userId);
  }
}