import { Body, ValidationPipe, Res, HttpStatus, HttpException } from '@nestjs/common';
import { SftpRequestDto } from './dto/sftp-request.dto';
import { SftpRepository } from './sftp.repository';
import { Response } from 'express';
import { HTTP_ERROR_CONSTANTS } from '../constants/http-error-messages.constants';

export class SftpService {

  constructor(private readonly sftpRepository: SftpRepository) { }

  /* File Functions */
  async putFile(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    const putFile: boolean = await this.sftpRepository.putFile(sftpRequest);

    if (!putFile) {
      console.error(`[SFTP putFile] ${HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_PUT_FILE}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_PUT_FILE, HttpStatus.CONFLICT);
    }

    return res.status(200).json(putFile);
  }

  async getFile(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    const getFile: boolean = await this.sftpRepository.getFile(sftpRequest);

    if (!getFile) {
      console.error(`[SFTP getFile] ${HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_GET_FILE}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_GET_FILE, HttpStatus.CONFLICT);
    }

    return res.status(200).json(getFile);
  }

  async moveFile(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    const moveFile: boolean = await this.sftpRepository.moveFile(sftpRequest);

    if (!moveFile) {
      console.error(`[SFTP moveFile] ${HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_MOVE_FILE}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_MOVE_FILE, HttpStatus.CONFLICT);
    }

    return res.status(200).json(moveFile);
  }

  async deleteFile(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    const deleteFile: boolean = await this.sftpRepository.deleteFile(sftpRequest);

    if (!deleteFile) {
      console.error(`[SFTP deleteFile] ${HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_DELETE_FILE}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_DELETE_FILE, HttpStatus.CONFLICT);
    }

    return res.status(200).json(deleteFile);
  }

  async renameFile(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    const renameFile: boolean = await this.sftpRepository.renameFile(sftpRequest);

    if (!renameFile) {
      console.error(`[SFTP renameFile] ${HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_RENAME_FILE}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_RENAME_FILE, HttpStatus.CONFLICT);
    }

    return res.status(200).json(renameFile);
  }

  async existsFile(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    const existsFile: boolean = await this.sftpRepository.existsFile(sftpRequest);

    if (!existsFile) {
      console.error(`[SFTP existsFile] ${HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_EXIST_FILE}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_EXIST_FILE, HttpStatus.CONFLICT);
    }

    return res.status(200).json(existsFile);
  }

  async list(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<any[], Record<string, any[]>>> {
    const files: any[] = await this.sftpRepository.list(sftpRequest);

    if (!files || (files && files.length == 0)) {
      console.error(`[SFTP list] ${HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_LIST_FILE}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_LIST_FILE, HttpStatus.CONFLICT);
    }

    return res.status(200).json(files);
  }

  async getBase64FromRemoteFile(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<string, Record<string, string>>> {
    const base64: string = await this.sftpRepository.getBase64FromRemoteFile(sftpRequest);

    if (!base64) {
      console.error(`[SFTP getBase64FromRemoteFile] ${HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_GET_BASE64_REMOTE_FILE}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_GET_BASE64_REMOTE_FILE, HttpStatus.CONFLICT);
    }

    return res.status(200).json(base64);
  }

  async getBufferFromRemoteFile(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<number[], Record<string, number[]>>> {
    const buffer: number[] = await this.sftpRepository.getBufferFromRemoteFile(sftpRequest);

    if (!buffer || (buffer && buffer.length == 0)) {
      console.error(`[SFTP getBufferFromRemoteFile] ${HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_GET_BUFFER_REMOTE_FILE}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_GET_BUFFER_REMOTE_FILE, HttpStatus.CONFLICT);
    }

    return res.status(200).json(buffer);
  }

  async checkIfFileIsDirectory(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    const isDirectory: boolean = await this.sftpRepository.checkIfFileIsDirectory(sftpRequest);

    if (!isDirectory) {
      console.error(`[SFTP checkIfFileIsDirectory] ${HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_CHECK_FILE_IS_DIRECTORY}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_CHECK_FILE_IS_DIRECTORY, HttpStatus.CONFLICT);
    }

    return res.status(200).json(isDirectory);
  }

  async uploadDir(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    const uploadDir: boolean = await this.sftpRepository.uploadDir(sftpRequest);

    if (!uploadDir) {
      console.error(`[SFTP uploadDir] ${HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_UPLOAD_DIR}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_UPLOAD_DIR, HttpStatus.CONFLICT);
    }

    return res.status(200).json(uploadDir);
  }

  async downloadDir(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    const downloadDir: boolean = await this.sftpRepository.downloadDir(sftpRequest);

    if (!downloadDir) {
      console.error(`[SFTP downloadDir] ${HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_DOWNLOAD_DIR}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_DOWNLOAD_DIR, HttpStatus.CONFLICT);
    }

    return res.status(200).json(downloadDir);
  }

  /* Folder Functions */
  async createFolder(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    const createFolder: boolean = await this.sftpRepository.createFolder(sftpRequest);

    if (!createFolder) {
      console.error(`[SFTP createFolder] ${HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_CREATE_FOLDER}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_CREATE_FOLDER, HttpStatus.CONFLICT);
    }

    return res.status(200).json(createFolder);
  }

  async deleteFolder(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    const deleteFolder: boolean = await this.sftpRepository.deleteFolder(sftpRequest);

    if (!deleteFolder) {
      console.error(`[SFTP deleteFolder] ${HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_DELETE_FOLDER}`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.SFTP.SFTP_UNNABLE_DELETE_FOLDER, HttpStatus.CONFLICT);
    }

    return res.status(200).json(deleteFolder);
  }
}
