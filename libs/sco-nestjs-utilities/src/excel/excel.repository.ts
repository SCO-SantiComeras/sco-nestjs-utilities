import { Injectable } from "@nestjs/common";
import { ExcelDto } from "./dto/excel.dto";
import { write } from "xlsx";
import { ExcelExtensionEnum } from "./enum/excel-extension.enum";

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
}
