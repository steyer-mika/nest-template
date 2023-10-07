import { ArrayUnique, IsArray, IsNumber, Min } from 'class-validator';

export class IdsDto {
  @IsArray()
  @ArrayUnique()
  @IsNumber(undefined, { each: true })
  @Min(0, { each: true })
  ids!: number[];
}
