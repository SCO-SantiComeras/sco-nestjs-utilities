import { Body, Controller, Post, ValidationPipe, Res } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ExcelService } from "./excel.service";
import { ExcelDto } from "./dto/excel.dto";
import { Response } from 'express';

@Controller('api/v1/excel')
@ApiTags('excel')
export class ExcelController {

  constructor(private readonly excelService: ExcelService) {}

  @Post('createFile')
  @ApiOperation({
    summary: 'createFile',
    description: 'Create xlsx file',
  })
  @ApiResponse({
    status: 200,
    description: 'Xlsx file created successfully',
  })
  @ApiResponse({
    status: 402,
    description: 'Workbook not provided,  File name not provided,  Extension not provided',
  })
  @ApiResponse({
    status: 409,
    description: 'Extension is not valid,  Unnable to create xlsx file',
  })
  async createFile(
    @Res() res: Response,
    @Body(ValidationPipe) excelDto: ExcelDto
  ): Promise<Response<any, Record<string, any>>> {
    return await this.excelService.createFile(res, excelDto);
  }
}
