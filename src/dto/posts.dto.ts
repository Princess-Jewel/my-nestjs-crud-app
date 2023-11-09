import { IsString, IsNotEmpty, IsEmail,} from 'class-validator';

export class CreatePostsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  userId: number;

  @IsString()
  images: string;
}


// Omit the 'id' property
export type CreatePostsWithoutId = Omit<CreatePostsDto, 'id'>;
