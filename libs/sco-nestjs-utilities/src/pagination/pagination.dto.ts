import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional } from "class-validator";
import { VALIDATION_ERROR_CONSTANTS } from "../constants/validation-error-messages.constants";

export class PaginationDto {

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(undefined, { message: VALIDATION_ERROR_CONSTANTS.PAGINATION.TOTAL_ITEMS.INVALID_VALUE })
  totalItems?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(undefined, { message: VALIDATION_ERROR_CONSTANTS.PAGINATION.TOTAL_PAGES.INVALID_VALUE })
  totalPages?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(undefined, { message: VALIDATION_ERROR_CONSTANTS.PAGINATION.CURRENT_PAGE.INVALID_VALUE })
  currentPage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray({ message: VALIDATION_ERROR_CONSTANTS.PAGINATION.ITEMS.INVALID_VALUE })
  items?: any[];
}