import { IsNotEmpty} from 'class-validator';

export class ViewsHistoriesDto {
  
    @IsNotEmpty()
    postId: number;
  
    @IsNotEmpty()
    userId: number;
}


// Omit the 'id' property
export type ViewsHistoriesDtoWithoutId = Omit<ViewsHistoriesDto, 'id'>;
