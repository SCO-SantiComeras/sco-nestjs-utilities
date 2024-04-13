import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsObject, IsString } from "class-validator";
import { WorkBook, utils } from "xlsx";
import { ExcelExtensionEnum } from "../enum/excel-extension.enum";
import { VALIDATION_ERROR_CONSTANTS } from "../../constants/validation-error-messages.constants";

export class ExcelDto {

    @ApiProperty()
    @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.EXCEL.COLUMNS.NOT_EMPTY })
    @IsArray({ message: VALIDATION_ERROR_CONSTANTS.EXCEL.COLUMNS.INVALID_VALUE })
    columns: string[];

    @ApiProperty()
    @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.EXCEL.DATA.NOT_EMPTY })
    @IsArray({ message: VALIDATION_ERROR_CONSTANTS.EXCEL.DATA.INVALID_VALUE })
    data: string[][];

    @ApiProperty()
    @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.EXCEL.WORKBOOK.NOT_EMPTY })
    @IsObject({ message: VALIDATION_ERROR_CONSTANTS.EXCEL.WORKBOOK.INVALID_VALUE })
    workbook: WorkBook;

    @ApiProperty()
    @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.EXCEL.FILE_NAME.NOT_EMPTY })
    @IsString({ message: VALIDATION_ERROR_CONSTANTS.EXCEL.FILE_NAME.INVALID_VALUE })
    fileName: string;

    @ApiProperty()
    @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.EXCEL.EXTENSION.NOT_EMPTY })
    @IsEnum(ExcelExtensionEnum, { message: VALIDATION_ERROR_CONSTANTS.EXCEL.EXTENSION.INVALID_VALUE })
    extension: ExcelExtensionEnum;

    constructor(fileName: string, extension: ExcelExtensionEnum) {
        this.workbook = utils.book_new();
        this.fileName = fileName;
        this.extension = extension;
    }
}