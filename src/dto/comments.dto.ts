import { IsString, IsNotEmpty, IsEmail} from 'class-validator';

export class CreateCommentsDto {
    @IsString()
    @IsNotEmpty()
    title: string;
  
  
    @IsNotEmpty()
    postId: number;
  
    @IsEmail()
    @IsNotEmpty()
    comment: string;
  
    @IsNotEmpty()
    userId: number;
}


// Omit the 'id' property
export type CreateCommentsDtoWithoutId = Omit<CreateCommentsDto, 'id'>;
