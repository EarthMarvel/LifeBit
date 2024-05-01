import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsNumber()
  @IsNotEmpty({ message: '인증 코드를 입력해주세요.' })
  verifyToken: number;

  @IsString()
  @IsNotEmpty({ message: '최소 6자리 이상의 비밀번호를 입력해주세요.' })
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 다시 한 번 입력해주세요.' })
  chekPassword: string;

  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;
}
