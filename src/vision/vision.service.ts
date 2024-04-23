import { Inject, Injectable, Logger } from '@nestjs/common'; // Logger 추가
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CertificatedImage } from './entity/certificatedImage.entity';
import { Mission } from 'src/mission/entities/mission.entity';
import { Category } from 'src/mission/types/category';
import { User } from 'src/user/entities/user.entity';
import { Point } from 'src/point/entity/point.entity';
import { PointService } from 'src/point/point.service';

@Injectable()
export class VisionService {
  private client: ImageAnnotatorClient;
  private readonly logger = new Logger(VisionService.name); // 로그를 위한 Logger 인스턴스 생성

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

  // 이미지 라벨을 감지하고, 주어진 카테고리와 일치하는지 검증
  async certificateImageCategory(
    fileBuffer: Buffer,
    category: Category,
    missionId: number,
    userId: number,
  ) {
    console.log('before try : userId : ' + userId);
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: userId },
        relations: ['point'],
      });

      if (!user) {
        throw new Error('User not found');
      }

      const point = await this.pointRepository.findOne({
        where: { user: { user_id: userId } },
        relations: ['user'],
      });

      console.log('initial : point.user : ' + point.user);
      console.log('initial : point.id : ' + point.id);
      console.log('initial : point.user.user_id :' + point.user.user_id);

      if (!user.point) {
        // 새 Point 객체 생성
        const newPoint = new Point();
        newPoint.totalValue = 0; // 초기 totalValue 설정
        newPoint.value = 0; // 초기 value 설정

        // user와 새로운 Point 객체 연결
        user.point = newPoint;

        // 데이터베이스에 새 Point 객체 저장
        await this.pointRepository.save(newPoint);
        // 변경된 user 객체도 저장할 수 있음 (user 엔티티에 따라 다름)
        await this.userRepository.save(user);
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

      const currentPoint = await this.pointRepository.findOne({
        where: { user: { user_id: userId } }, // 수정된 부분
        relations: ['user'],
      });

      console.log('currentPoint : ' + currentPoint);
      console.log('currentPoint.id : ' + currentPoint.id);

      if (!currentPoint) {
        throw new Error('currentPoint not found');
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

        // 사용자의 현재 포인트 가져오기 또는 새로 생성
        let userPoint = await this.pointRepository.findOne({
          where: { user: { user_id: userId } },
        });

        console.log('userPoint : ' + userPoint);
        console.log('userId : ' + userId);

        // if (!userPoint) {
        //   userPoint = this.pointRepository.create({
        //     user: user, // User 엔티티 인스턴스 자체를 할당
        //     totalValue: 0,
        //     value: 0,
        //   });
        // }

        // 포인트 업데이트
        this.pointService.plusPoint(100, userId);

        await this.pointRepository.save(userPoint);

        console.log(
          `사용자 ID ${user.user_id}의 포인트 업데이트 성공: totalValue에 100 추가, value를 100으로 설정`,
        );
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

      // 함수 마지막에 총 포인트 값을 반환
      const updatedUser = await this.userRepository.findOne({
        where: { user_id: userId },
      });

      return {
        requestedCategory: category,
        detectedLabels: labels,
        isCategoryMatched,
        Point,
      };
    } catch (error) {
      this.logger.error(`detectLabels 오류: ${error.message}`);
      throw new Error(`Label Detection 실패: ${error.message}`);
    }
  }
}
