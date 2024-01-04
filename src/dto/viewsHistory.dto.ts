import { IsNotEmpty} from 'class-validator';

export class ViewsHistoryDto {
  
    @IsNotEmpty()
    postId: number;
  
    @IsNotEmpty()
    userId: number;
}


// Omit the 'id' property
export type ViewsHistoryDtoWithoutId = Omit<ViewsHistoryDto, 'id'>;
