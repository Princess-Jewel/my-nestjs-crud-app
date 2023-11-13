import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class PostImagesDto {
  @IsNotEmpty()
  postId: number;

  @IsNotEmpty()
  imageUrl: string;

  @IsNotEmpty()
  userId: number;
}

// Omit the 'id' property
export type PostImagesDtoWithoutId = Omit<PostImagesDto, 'id'>;
