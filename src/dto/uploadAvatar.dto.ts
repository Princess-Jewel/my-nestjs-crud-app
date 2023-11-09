import { IsString, IsNotEmpty, IsEmail, MinLength, IsInt, Min, Max } from 'class-validator';

export class UploadAvatarDto {
  @IsString()
  @IsNotEmpty()
  fname: string;

  @IsString()
  @IsNotEmpty()
  lname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsInt()
  @Min(0)   
  @Max(150) 
  age: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  
  @IsString()
  avatar: string;
}


// Omit the 'id' property
export type UploadAvatarWithoutId = Omit<UploadAvatarDto, 'id'>;
