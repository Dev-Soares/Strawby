import { IsString, IsOptional, IsNumber } from "class-validator";
import { Transform } from "class-transformer";

export class PaginationDto {
    @IsOptional()
    @IsString()
    cursor?: string;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    limit?: number;
}
