import { Injectable, Logger } from '@nestjs/common'; // Logger 추가
import { ImageAnnotatorClient } from '@google-cloud/vision';

@Injectable()
export class VisionService {
  private client: ImageAnnotatorClient;
  private readonly logger = new Logger(VisionService.name); // 로그를 위한 Logger 인스턴스 생성

  constructor() {
    this.client = new ImageAnnotatorClient();
  }

  async detectLabels(fileName: string): Promise<string[]> {
    try {
      const [result] = await this.client.labelDetection(fileName);
      const labels = result.labelAnnotations.map((label) => label.description);
      return labels;
    } catch (error) {
      // 오류 발생 시 로그에 오류 메시지 출력
      this.logger.error(`detectLabels 오류: ${error.message}`);
      throw new Error(`Label Detection 실패: ${error.message}`); // 오류를 다시 throw하여 호출자에게 전달
    }
  }

  async detectLabelsGCS(
    bucketName: string,
    fileName: string,
  ): Promise<string[]> {
    const [result] = await this.client.labelDetection(
      `gs://${bucketName}/${fileName}`,
    );
    const labels = result.labelAnnotations.map((label) => label.description);
    return labels;
  }
}
