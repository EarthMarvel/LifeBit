import { Injectable, Logger } from '@nestjs/common'; // Logger 추가
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { Storage } from '@google-cloud/storage'; // GCS를 위한 라이브러리 import
import { format } from 'date-fns'; // 날짜 포맷을 위해 사용
import { ko } from 'date-fns/locale'; // 한국어 locale
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CertificatedImage } from './entity/certificatedImage.entity';
import { Mission } from 'src/mission/entities/mission.entity';
import { Category } from 'src/mission/types/category';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class VisionService {
  private client: ImageAnnotatorClient;
  private storage = new Storage(); // GCS 인스턴스 생성
  private readonly logger = new Logger(VisionService.name); // 로그를 위한 Logger 인스턴스 생성

  constructor(
    @InjectRepository(CertificatedImage)
    private certificatedImageRepository: Repository<CertificatedImage>,
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
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

  // 이미지 라벨을 감지하고, 주어진 카테고리와 일치하는지 검증
  async certificateImageCategory(
    fileBuffer: Buffer,
    category: Category,
    missionId: number,
    userId: number,
  ) {
    try {
      // 이미지 라벨 감지를 위해 fileBuffer 사용
      const [result] = await this.client.labelDetection(fileBuffer);

      const labels = result.labelAnnotations.map((label) => label.description);
      // 주어진 카테고리가 감지된 라벨들 중 하나와 일치하는지 확인
      const isCategoryMatched = labels.includes(category);

      /*
      // 로그 파일 생성 및 업로드
      const logContent = `Requested Category: ${category}, Detected Labels: ${labels.join(', ')}, Is Category Matched: ${isCategoryMatched}`;
      const bucketName = `mission_certification`;

      await this.uploadLogToGCS(bucketName, 'logs/', path, logContent); // 로그 업로드 호출
      */

      const user = await this.userRepository.findOneBy({ user_id: userId });

      if (!user) {
        throw new Error('User not found');
      }

      const mission = await this.missionRepository.findOneBy({
        missionId,
      });

      if (!mission) {
        throw new Error('Mission not found');
      }

      // CertificatedImage 테이블에 결과 저장
      const certificatedImage = this.certificatedImageRepository.create({
        certificatedAt: new Date(),
        isCertificated: isCategoryMatched,
        user: user, // 사용자 엔티티 연결
        mission: mission, // 미션 엔티티 연결
      });

      await this.certificatedImageRepository.save(certificatedImage);

      // 결과 객체 반환
      return {
        requestedCategory: category,
        detectedLabels: labels,
        isCategoryMatched: isCategoryMatched,
      };
    } catch (error) {
      this.logger.error(`detectLabels 오류: ${error.message}`);
      throw new Error(`Label Detection 실패: ${error.message}`);
    }
  }

  async uploadLogToGCS(
    bucketName: string,
    logFolder: string,
    fileName: string,
    logContent: string,
  ): Promise<void> {
    const fileContent = Buffer.from(logContent, 'utf8');

    // 현재 시간을 한국표준시로 포맷팅하여 파일명에 사용
    const currentTime = format(new Date(), 'yyyy-MM-dd_HH:mm:ss', {
      locale: ko,
    });
    // 로그 파일명을 생성할 때, 지정된 폴더 경로를 포함시킴
    const destinationFileName = `${logFolder}${currentTime}_${fileName}.txt`;

    const file = this.storage.bucket(bucketName).file(destinationFileName);
    await file.save(fileContent); // 파일 저장
    this.logger.log(`Log file uploaded: ${destinationFileName}`); // 로그 기록
  }
}
