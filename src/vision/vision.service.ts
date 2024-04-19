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

  // 이미지 라벨을 감지하고, 주어진 카테고리와 일치하는지 검증
  async certificateImageCategory(
    fileBuffer: Buffer,
    category: Category,
    missionId: number,
    userId: number,
  ) {
    try {
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

      console.log('mission.category : ' + mission.category);

      if (mission.category === category) {
        console.log('mission.category === category');
      } else {
        console.log('mission.category : ' + mission.category);
        console.log('category : ' + category);
      }

      // mission.category와 category는 다를 수 있다.
      // category를 입력값으로 받을 게 아니라 .. mission.category를 사용해야 한다.
      // 근데 드롭다운으로 받는 걸 category에 string으로 넣어주면 될 거 같음 이건 프론트랑 연결할 때 생각해보자

      // 이미지 라벨 감지를 위해 fileBuffer 사용
      const [result] = await this.client.labelDetection(fileBuffer);

      const labels = result.labelAnnotations.map((label) => label.description);

      // ** Sports 카테고리와 관련된 라벨 목록
      const sportsRelatedLabels = [
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
      ];

      // ** COOKING 카테고리와 관련된 라벨 목록
      const cookingRelatedLabels = [
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
      ];

      // ** MUSIC 카테고리와 관련된 라벨 목록
      const musicRelatedLabels = [
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
      ];

      // ** ART 카테고리와 관련된 라벨 목록
      const artRelatedLabels = [
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
      ];

      // ** TRAVEL 카테고리와 관련된 라벨 목록
      const travelRelatedLabels = [
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
      ];

      // ** PHOTOGRAPHY 카테고리와 관련된 라벨 목록
      const photographyRelatedLabels = [
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
      ];

      // ** Workout 카테고리와 관련된 라벨 목록
      const workoutRelatedLabels = [
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
      ];

      // ** Reading 카테고리와 관련된 라벨 목록
      const readingRelatedLabels = [
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
      ];

      // ** Study 카테고리와 관련된 라벨 목록
      const studyRelatedLabels = [
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
      ];

      // ** Selfhelp 카테고리와 관련된 라벨 목록
      const selfhelpRelatedLabels = [
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
      ];

      var relatedLabels = [];

      switch (category) {
        case 'Sports':
          relatedLabels = sportsRelatedLabels;
          break;
        case 'Cooking':
          relatedLabels = cookingRelatedLabels;
          break;
        case 'Music':
          relatedLabels = musicRelatedLabels;
          break;
        case 'Art':
          relatedLabels = artRelatedLabels;
          break;
        case 'Travel':
          relatedLabels = travelRelatedLabels;
          break;
        case 'Photography':
          relatedLabels = photographyRelatedLabels;
          break;
        case 'Workout':
          relatedLabels = workoutRelatedLabels;
          break;
        case 'Reading':
          relatedLabels = readingRelatedLabels;
          break;
        case 'Study':
          relatedLabels = studyRelatedLabels;
          break;
        case 'Selfhelp':
          relatedLabels = selfhelpRelatedLabels;
          break;
      }

      // ** 감지된 라벨 중에서 Workout 카테고리와 관련된 라벨이 하나라도 있는지 확인
      const isCategoryMatched = labels.some((label) =>
        relatedLabels.includes(label),
      );

      // ** 인증 성공 여부에 따라 다른 작업 수행
      if (isCategoryMatched) {
        // 인증 성공 로직
        console.log('인증 성공 : ', labels.join(', '));
      } else {
        // 인증 실패 로직
        console.log('인증 실패 : ', labels.join(', '));
      }

      const certificatedImage = this.certificatedImageRepository.create({
        certificatedAt: new Date(),
        isCertificated: isCategoryMatched,
        user: user, // 사용자 엔티티 연결
        mission: mission, // 미션 엔티티 연결
        category: category, // 카테고리 연결
      });

      // CertificatedImage 테이블에 결과 저장
      await this.certificatedImageRepository.save(certificatedImage);

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
