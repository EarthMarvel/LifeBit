import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileDto {
  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  nickName: string;
}
