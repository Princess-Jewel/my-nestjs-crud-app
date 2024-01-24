import { IsString, IsNotEmpty, IsEmail, MinLength, IsInt, Min, Max } from 'class-validator';

export class UpdateUsersWalletDto {
    @IsInt()
  @IsNotEmpty()
  id: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

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
export type UpdateUsersWalletDtoWithoutId = Omit<UpdateUsersWalletDto, 'id'>;