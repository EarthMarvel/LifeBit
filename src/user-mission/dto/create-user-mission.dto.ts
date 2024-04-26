import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserMissionDto {
  // 사용자의 ID를 나타내는 필드
  @IsNotEmpty() // 비어 있지 않은지 검증
  @IsNumber() // 숫자 형식인지 검증
  userId: number;

  // 미션의 ID를 나타내는 필드
  @IsNotEmpty() // 비어 있지 않은지 검증
  @IsNumber() // 숫자 형식인지 검증
  missionId: number;
}
