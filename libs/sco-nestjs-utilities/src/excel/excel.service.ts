import { ExcelRepository } from "./excel.repository";
import { ExcelDto } from "./dto/excel.dto";
import { Response } from 'express';
import { HTTP_ERROR_CONSTANTS } from "../constants/http-error-messages.constants";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class ExcelService {

  constructor(private readonly excelRepository: ExcelRepository) {}

  async createFile(res: Response, excelDto: ExcelDto): Promise<Response<any, Record<string, any>>> {
    if (!excelDto.workbook) {
      console.error(`[Excel createFile] ${HTTP_ERROR_CONSTANTS.EXCEL.EXCEL_WORKBOOK_NOT_PROVIDED}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.EXCEL.EXCEL_WORKBOOK_NOT_PROVIDED, HttpStatus.PAYMENT_REQUIRED);
    }

    if (!excelDto.fileName) {
      console.error(`[Excel createFile] ${HTTP_ERROR_CONSTANTS.EXCEL.EXCEL_FILENAME_NOT_PROVIDED}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.EXCEL.EXCEL_FILENAME_NOT_PROVIDED, HttpStatus.PAYMENT_REQUIRED);
    }

    if (!excelDto.extension) {
      console.error(`[Excel createFile] ${HTTP_ERROR_CONSTANTS.EXCEL.EXCEL_EXTENSION_NOT_PROVIDED}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.EXCEL.EXCEL_EXTENSION_NOT_PROVIDED, HttpStatus.PAYMENT_REQUIRED);
    }

    const validExtension: boolean = await this.excelRepository.validateExtension(excelDto.extension);
    if (!validExtension) {
      console.error(`[Excel createFile] ${HTTP_ERROR_CONSTANTS.EXCEL.EXCEL_INVALID_EXTENSION}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.EXCEL.EXCEL_INVALID_EXTENSION, HttpStatus.CONFLICT);
    }

    this.excelRepository.setWorkSheet(excelDto);

    const xlsxFileCreated: any = await this.excelRepository.generateExcelFile(excelDto);
    if (!xlsxFileCreated) {
      console.error(`[Excel createFile] ${HTTP_ERROR_CONSTANTS.EXCEL.EXCEL_UNNABLE_TO_CREATE_FILE}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.EXCEL.EXCEL_UNNABLE_TO_CREATE_FILE, HttpStatus.CONFLICT);
    }
    
    console.log(`[Excel createFile] File '${excelDto.fileName}' successfully created`);
    return res.status(200).json(xlsxFileCreated);
  }
}
