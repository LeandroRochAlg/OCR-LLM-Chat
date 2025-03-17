import { Injectable } from "@nestjs/common";
import { createWorker } from "tesseract.js";
import * as fs from "fs";

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
      console.log("PDF file detected");
    }

    throw new Error("Unsupported file type");
  }
}