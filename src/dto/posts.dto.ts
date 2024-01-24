import { IsString, IsNotEmpty, IsEmail, IsInt,} from 'class-validator';

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

  // @IsString(allowNull: true,)
  // avatar: string;
  

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsInt()
  amount: number;

  @IsString()
  transactionType: string;
}


// Omit the 'id' property
export type CreatePostsWithoutId = Omit<CreatePostsDto, 'id'>;
