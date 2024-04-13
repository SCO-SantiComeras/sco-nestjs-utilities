import { Injectable } from "@nestjs/common";
import { ExcelDto } from "./dto/excel.dto";
import { write } from "xlsx";
import { ExcelExtensionEnum } from "./enum/excel-extension.enum";
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelRepository {

    constructor() { }

    async generateExcelFile(excelDto: ExcelDto): Promise<any> {
        let xlsxFile: any = undefined;

        try {
            xlsxFile = await write(excelDto.workbook, {
                bookType: excelDto.extension,
                type: 'buffer',
                bookSST: false,
            });
        } catch (error) {
            console.log(`[generateExcelFile] Error: ${JSON.stringify(error)}`);
        } finally {
            return xlsxFile;
        }
    }

    public validateExtension(extension: string): boolean {
        let extensionIsValid: boolean = false;

        const values: string[] = Object.values(ExcelExtensionEnum);
        for (const value of values) {
            if (extension == value) {
                extensionIsValid = true;
                break;
            }
        }

        return extensionIsValid;
    }

    public createWorkSheet(excelDto: ExcelDto): XLSX.WorkSheet {
        const workSheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
            excelDto.columns,
            ...excelDto.data,
        ]);

        if (!workSheet) {
            return undefined;
        }

        return workSheet;
    }

    public setWorkSheet(excelDto: ExcelDto): boolean {
        try {
            XLSX.utils.book_append_sheet(excelDto.workbook , this.createWorkSheet(excelDto), excelDto.fileName);
            return true;
        } catch (error) {
            return false;
        }
    }
}
