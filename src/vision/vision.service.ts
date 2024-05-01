import { Injectable, Logger } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CertificatedImage } from './entity/certificatedImage.entity';
import { Mission } from 'src/mission/entities/mission.entity';
import { User } from 'src/user/entities/user.entity';
import { Point } from 'src/point/entity/point.entity';
import { PointService } from 'src/point/point.service';

@Injectable()
export class VisionService {
  private client: ImageAnnotatorClient;
  private readonly logger = new Logger(VisionService.name);

  constructor(
    @InjectRepository(CertificatedImage)
    private certificatedImageRepository: Repository<CertificatedImage>,
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    private pointService: PointService,
  ) {
    this.client = new ImageAnnotatorClient();
  }

  // 이미지 라벨 감지 및 인증 결과 반환
  async certificateImageCategory(
    fileBuffer: Buffer,
    category: string,
    missionId: number,
    userId: number,
  ): Promise<boolean> {
    try {
      // 사용자 및 미션 조회
      const user = await this.getUser(userId);
      const mission = await this.getMission(missionId);

      // 포인트 조회 및 생성
      const currentPoint = await this.getOrCreatePoint(user);

      // 이미지 라벨 감지
      const labels = await this.detectLabels(fileBuffer);

      // 카테고리 관련 라벨 조회
      const relatedLabels = this.getRelatedLabelsByCategory(category);

      // 인증 여부 확인
      const isCategoryMatched = this.isCategoryMatched(labels, relatedLabels);

      // 인증 결과 저장
      await this.saveCertificateImage(
        isCategoryMatched,
        user,
        mission,
        category,
      );

      // 인증 성공 시 포인트 업데이트
      if (isCategoryMatched) {
        await this.updateUserPoints(userId);
      }

      return isCategoryMatched;
    } catch (error) {
      this.logger.error(`certificateImageCategory 오류: ${error.message}`);
      throw new Error(`certificatedImageCategory 실패: ${error.message}`);
    }
  }

  // 사용자 조회
  private async getUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ['point'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // 미션 조회
  private async getMission(missionId: number): Promise<Mission> {
    const mission = await this.missionRepository.findOneBy({ missionId });

    if (!mission) {
      throw new Error('Mission not found');
    }

    return mission;
  }

  // 포인트 조회 및 생성
  private async getOrCreatePoint(user: User): Promise<Point> {
    let point = await this.pointRepository.findOne({
      where: { user: { user_id: user.user_id } },
    });

    if (!point) {
      point = new Point();
      point.totalValue = 0;
      point.value = 0;
      point.user = user;
      await this.pointRepository.save(point);
      user.point = point;
      await this.userRepository.save(user);
    }

    return point;
  }

  // 이미지 라벨 감지
  private async detectLabels(fileBuffer: Buffer): Promise<string[]> {
    const [result] = await this.client.labelDetection(fileBuffer);
    return result.labelAnnotations.map((label) => label.description);
  }

  // 카테고리 관련 라벨 목록 조회
  private getRelatedLabelsByCategory(category: string): string[] {
    const categoryLabelMap = {
      Sports: [
        'Football',
        'Basketball',
        'Soccer',
        'Tennis',
        'Golf',
        'Running',
        'Swimming',
        'Baseball',
        'Volleyball',
        'Tennis Racket',
        'Baseball Bat',
        'Football',
        'Soccer Ball',
        'Golf Club',
        'Running Shoes',
        'Swim Cap',
        'Gym Equipment',
        'Stadium',
        'Gym',
        'Tennis Court',
        'Golf Course',
        'Running Track',
        'Swimming Pool',
        'Sports Field',
        'Sports Uniform',
        'Jersey',
        'Sneakers',
        'Tracksuit',
        'Swimwear',
        'Competition',
        'Tournament',
        'Race',
        'Match',
        'Event',
      ],
      Cooking: [
        'Cooking',
        'Baking',
        'Grilling',
        'Frying',
        'Boiling',
        'Chopping',
        'Mixing',
        'Kneading',
        'Vegetables',
        'Fruits',
        'Meat',
        'Fish',
        'Spices',
        'Herbs',
        'Flour',
        'Eggs',
        'Milk',
        'Butter',
        'Knife',
        'Cutting Board',
        'Pan',
        'Pot',
        'Oven',
        'Mixer',
        'Blender',
        'Spatula',
        'Bowl',
        'Measuring Cup',
        'Dish',
        'Meal',
        'Cuisine',
        'Soup',
        'Salad',
        'Cake',
        'Pizza',
        'Sandwich',
        'Dessert',
        'Kitchen',
        'Stove',
        'Countertop',
        'Refrigerator',
        'Recipe',
        'Gourmet',
        'Homemade',
        'Vegetarian',
        'Vegan',
        'BBQ',
        'Sushi',
        'Pastry',
      ],
      Music: [
        'Guitar',
        'Piano',
        'Drum',
        'Violin',
        'Microphone',
        'Headphones',
        'Saxophone',
        'DJ Mixer',
        'Synthesizer',
        'Turntable',
        'Concert',
        'Performance',
        'Rehearsal',
        'Recording',
        'Singing',
        'Dancing',
        'Classical Music',
        'Rock Music',
        'Jazz',
        'Pop Music',
        'Hip Hop Music',
        'Electronic Music',
        'Folk Music',
        'Music Production',
        'Sound Engineering',
        'Music Mixing',
        'Songwriting',
        'Music Studio',
        'Concert Hall',
        'Music Festival',
        'Nightclub',
        'Music Album',
        'Music Score',
        'Concert Ticket',
      ],
      Art: [
        'Paintbrush',
        'Easel',
        'Palette',
        'Sculpture Tools',
        'Drawing Pad',
        'Painting',
        'Sculpture',
        'Drawing',
        'Abstract Art',
        'Contemporary Art',
        'Street Art',
        'Digital Art',
        'Photography',
        'Installation Art',
        'Performance Art',
        'Art Exhibition',
        'Art Class',
        'Art Creation',
        'Artistic Performance',
        'Gallery Viewing',
        'Artist',
        'Sculptor',
        'Painter',
        'Photographer',
        'Impressionism',
        'Surrealism',
        'Cubism',
        'Modernism',
        'Oil Paint',
        'Watercolor',
        'Acrylic Paint',
        'Charcoal',
        'Ink',
        'Pastel',
        'Art Gallery',
        'Museum',
        'Art Studio',
        'Art School',
        'Exhibition Hall',
      ],
      Travel: [
        'Landmark',
        'National Park',
        'Beach',
        'Mountain',
        'Lake',
        'River',
        'Desert',
        'Forest',
        'Historical Site',
        'Cityscape',
        'Island',
        'Airplane',
        'Train',
        'Bus',
        'Ship',
        'Boat',
        'Car Rental',
        'Bicycle Rental',
        'Airport',
        'Train Station',
        'Harbor',
        'Hotel',
        'Resort',
        'Hostel',
        'Bed and Breakfast',
        'Camping Site',
        'Hiking',
        'Skiing',
        'Scuba Diving',
        'Surfing',
        'Safari',
        'Hot Air Ballooning',
        'Sightseeing',
        'Fishing',
        'Cycling',
        'Festival',
        'Museum',
        'Art Gallery',
        'Concert',
        'Theater',
        'Cultural Performance',
        'Restaurant',
        'Cafe',
        'Street Food',
        'Local Cuisine',
        'Winery',
        'Brewery',
        'Wildlife',
        'Nature Reserve',
        'Botanical Garden',
        'Zoo',
        'Aquarium',
      ],
      Photography: [
        'Camera',
        'Lens',
        'Tripod',
        'Flash',
        'Memory Card',
        'Portrait',
        'Landscape',
        'Night Photography',
        'Macro Photography',
        'Street Photography',
        'Documentary Photography',
        'Black and White',
        'Long Exposure',
        'Photo Editing',
        'Filter',
        'Photoshop',
        'Lightroom',
        'Photo Shoot',
        'Photography Workshop',
        'Photo Exhibition',
        'Photography Contest',
        'Lighting',
        'Bokeh',
        'Reflector',
        'Softbox',
        'Nature Photography',
        'Wildlife Photography',
        'Fashion Photography',
        'Sports Photography',
        'Event Photography',
        'Architectural Photography',
        'Photo Print',
        'Photo Album',
        'Gallery',
        'Frame',
      ],
      Workout: [
        'Exercise Equipment',
        'Gym',
        'Fitness Center',
        'Sportswear',
        'Running/Jogging',
        'Yoga',
        'Fitness',
        'Weight Lifting',
        'Cycling',
        'Sport',
      ],
      Reading: [
        'Book',
        'Reading Glasses',
        'Library',
        'Bookshelf',
        'E-Reader or Tablet',
        'Newspaper',
        'Magazine',
        'Study or Studying',
        'Literature',
        'Text',
      ],
      Study: [
        'Book',
        'Notebook',
        'Pen/Pencil',
        'Study Desk or Study Room',
        'Computer or Laptop',
        'Library',
        'Student',
        'Classroom',
        'Textbook',
        'Educational Material',
      ],
      Selfhelp: [
        'Educational Material',
        'Online Course',
        'Tutorial',
        'Lecture',
        'Seminar',
        'Workshop',
        'Meditation',
        'Diary',
        'Self-help Book',
        'Motivational Quotes',
        'Art',
        'Writing',
      ],
    };
    return categoryLabelMap[category] || [];
  }

  // 인증 여부 확인
  private isCategoryMatched(
    labels: string[],
    relatedLabels: string[],
  ): boolean {
    return labels.some((label) => relatedLabels.includes(label));
  }

  // 인증 결과 저장
  private async saveCertificateImage(
    isCategoryMatched: boolean,
    user: User,
    mission: Mission,
    category: string,
  ): Promise<void> {
    const certificateImage = this.certificatedImageRepository.create({
      certificatedAt: new Date(),
      isCertificated: isCategoryMatched,
      user,
      mission,
      category,
    });

    await this.certificatedImageRepository.save(certificateImage);
  }

  // 사용자 포인트 업데이트
  private async updateUserPoints(userId: number): Promise<void> {
    await this.pointService.plusPoint(100, userId);
  }
}
