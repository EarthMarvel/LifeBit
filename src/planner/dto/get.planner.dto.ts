import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Matches } from "class-validator";

export class DateDto {

    @IsNotEmpty()
    @IsNumber()
    year : number;

    @IsNotEmpty()
    @IsNumber()
    month : number;
}