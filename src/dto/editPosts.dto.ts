import { IsString, IsNotEmpty, IsEmail,} from 'class-validator';

export class EditPostsDto {
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
}


// Omit the 'id' property
export type EditPostsWithoutId = Omit<EditPostsDto, 'id'>;
