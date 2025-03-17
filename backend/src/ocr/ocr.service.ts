import { Injectable } from "@nestjs/common";
import { createWorker } from "tesseract.js";
import * as fs from "fs";
import * as pdfParse from "pdf-parse";

@Injectable()
export class OcrService {
  async extractText(filePath: string): Promise<string> {
    const fileExtension = filePath.split(".").pop()?.toLocaleLowerCase() || '';
    const imageExtensions = ["png", "jpg", "jpeg", "bmp", "tiff", "webp"];

    if (imageExtensions.includes(fileExtension)) {
      const worker = await createWorker(["eng", "spa", "por"]);
      
      const { data: { text } } = await worker.recognize(filePath);
      await worker.terminate();

      return text;
    } else if (fileExtension === "pdf") {
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const { text } = await pdfParse(dataBuffer);
        return text;
      } catch (error) {
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
      }
    }

    throw new Error("Unsupported file type");
  }
}