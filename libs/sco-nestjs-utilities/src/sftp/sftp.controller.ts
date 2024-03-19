import { Body, Controller, Post, ValidationPipe, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { SftpRequestDto } from './dto/sftp-request.dto';
import { Response } from 'express';
import { SftpService } from './sftp.service';

@Controller(`api/v1/sftp`)
@ApiTags('sftp')
export class SftpController {

  constructor(private readonly sftpService: SftpService) { }

  /* File Functions */
  @Post('putFile')
  @ApiOperation({
    summary: 'putFile',
    description: 'Put file in sftp server',
  })
  @ApiBody({
    description: 'Example to put local file in remote server',
    type: SftpRequestDto,
    examples: {
      a: {
        value: {
          path: "./local_path/local_file.txt",
          newPath: "./remote_path/remote_file.txt",
          recursive: true,
          verbose: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'File putted in remote server successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable to put file in remote server',
  })
  async putFile(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    return await this.sftpService.putFile(res, sftpRequest);
  }

  @Post('getFile')
  @ApiOperation({
    summary: 'getFile',
    description: 'Get file of sftp server',
  })
  @ApiBody({
    description: 'Example to get remote file to local file',
    type: SftpRequestDto,
    examples: {
      a: {
        value: {
          path: "./remote_path/remote_file.txt",
          newPath: "./local_path/local_file.txt",
          recursive: true,
          verbose: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Get remote file to local file successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable to get file in remote server',
  })
  async getFile(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    return await this.sftpService.getFile(res, sftpRequest);
  }

  @Post('moveFile')
  @ApiOperation({
    summary: 'moveFile',
    description: 'Move file of sftp server',
  })
  @ApiBody({
    description: 'Example to move remote file to remote new path file',
    type: SftpRequestDto,
    examples: {
      a: {
        value: {
          path: "./remote_path/remote_file.txt",
          newPath: "./new_remote_path/new_remote_file.txt",
          recursive: true,
          verbose: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Move remote file to new path successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable to move file in remote server',
  })
  async moveFile(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    return await this.sftpService.moveFile(res, sftpRequest);
  }

  @Post('deleteFile')
  @ApiOperation({
    summary: 'deleteFile',
    description: 'Delete file of sftp server',
  })
  @ApiBody({
    description: 'Example to delete remote file',
    type: SftpRequestDto,
    examples: {
      a: {
        value: {
          path: "./remote_path/remote_file.txt",
          recursive: true,
          verbose: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Remote file deleted successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable to delete file in remote server',
  })
  async deleteFile(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    return await this.sftpService.deleteFile(res, sftpRequest);
  }

  @Post('renameFile')
  @ApiOperation({
    summary: 'renameFile',
    description: 'Rename a file of sftp server',
  })
  @ApiBody({
    description: 'Example to rename remote file to remote new name file',
    type: SftpRequestDto,
    examples: {
      a: {
        value: {
          path: "./remote_path/remote_file.txt",
          newPath: "./remote_path/new_remote_file_name.txt",
          recursive: true,
          verbose: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Rename remote file to new name successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable to rename file in remote server',
  })
  async renameFile(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    return await this.sftpService.renameFile(res, sftpRequest);
  }

  @Post('existsFile')
  @ApiOperation({
    summary: 'existsFile',
    description: 'Exist file in sftp server',
  })
  @ApiBody({
    description: 'Example check if file exist',
    type: SftpRequestDto,
    examples: {
      a: {
        value: {
          path: "./remote_path/remote_file.txt",
          recursive: true,
          verbose: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Remote file exists successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable to check if exists remote file',
  })
  async existsFile(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    return await this.sftpService.existsFile(res, sftpRequest);
  }

  @Post('list')
  @ApiOperation({
    summary: 'list',
    description: 'List files in a sftp server route',
  })
  @ApiBody({
    description: 'Example to list file from remte folder',
    type: SftpRequestDto,
    examples: {
      a: {
        value: {
          path: "./remote_path/",
          recursive: true,
          verbose: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'List folder files from remote server successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable to list folder files from remote server',
  })
  async list(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<any[], Record<string, any[]>>> {
    return await this.sftpService.list(res, sftpRequest);
  }

  @Post('getBase64FromRemoteFile')
  @ApiOperation({
    summary: 'getBase64FromRemoteFile',
    description: 'Get base64 from remote file',
  })
  @ApiBody({
    description: 'Example to get base64 from remote file',
    type: SftpRequestDto,
    examples: {
      a: {
        value: {
          path: "./remote_path/remote_file.txt",
          recursive: true,
          verbose: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Get base64 from remote file successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable to get base64 from remote file',
  })
  async getBase64FromRemoteFile(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<string, Record<string, string>>> {
    return await this.sftpService.getBase64FromRemoteFile(res, sftpRequest);
  }

  @Post('getBufferFromRemoteFile')
  @ApiOperation({
    summary: 'getBufferFromRemoteFile',
    description: 'Get read stream from remote file',
  })
  @ApiBody({
    description: 'Example get file buffer from remote file',
    type: SftpRequestDto,
    examples: {
      a: {
        value: {
          path: "./remote_path/remote_file.txt",
          recursive: true,
          verbose: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Buffer from remote file successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable to get file buffer from remote file',
  })
  async getBufferFromRemoteFile(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<number[], Record<string, number[]>>> {
    return await this.sftpService.getBufferFromRemoteFile(res, sftpRequest);
  }

  @Post('checkIfFileIsDirectory')
  @ApiOperation({
    summary: 'checkIfFileIsDirectory',
    description: 'Check if file is directory',
  })
  @ApiBody({
    description: 'Example chek if remote file is a directory',
    type: SftpRequestDto,
    examples: {
      a: {
        value: {
          path: "./remote_path/",
          recursive: true,
          verbose: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Check if remote file is directory successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable to check if remote file is directory',
  })
  async checkIfFileIsDirectory(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    return await this.sftpService.checkIfFileIsDirectory(res, sftpRequest);
  }

  @Post('uploadDir')
  @ApiOperation({
    summary: 'uploadDir',
    description: 'Upload a dir to remote server',
  })
  @ApiBody({
    description: 'Example to upload local dir to remote dir',
    type: SftpRequestDto,
    examples: {
      a: {
        value: {
          path: "./local_path/",
          newPath: "./remote_path/",
          recursive: true,
          verbose: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Local dir uploaded to remote dir successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable to upload local dir to remote dir',
  })
  async uploadDir(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    return await this.sftpService.uploadDir(res, sftpRequest);
  }

  @Post('downloadDir')
  @ApiOperation({
    summary: 'downloadDir',
    description: 'Download dir from remote server',
  })
  @ApiBody({
    description: 'Example to download remote dir to local dir',
    type: SftpRequestDto,
    examples: {
      a: {
        value: {
          path: "./remote_path/",
          newPath: "./local_path/",
          recursive: true,
          verbose: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Remote dir downloaded to local dir successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable to download remtoe dir to local dir',
  })
  async downloadDir(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    return await this.sftpService.downloadDir(res, sftpRequest);
  }

  /* Folder Functions */
  @Post('createFolder')
  @ApiOperation({
    summary: 'createFolder',
    description: 'Create a folder in a sftp server',
  })
  @ApiBody({
    description: 'Example to crete remote folder',
    type: SftpRequestDto,
    examples: {
      a: {
        value: {
          path: "./remote_path/",
          recursive: true,
          verbose: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Remote folder created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable crete remote folder',
  })
  async createFolder(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    return await this.sftpService.createFolder(res, sftpRequest);
  }

  @Post('deleteFolder')
  @ApiOperation({
    summary: 'deleteFolder',
    description: 'Delete a folder in a sftp server',
  })
  @ApiBody({
    description: 'Example to delete remote folder',
    type: SftpRequestDto,
    examples: {
      a: {
        value: {
          path: "./remote_path/",
          recursive: true,
          verbose: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Remote folder deleted successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable delete remote folder',
  })
  async deleteFolder(@Res() res: Response, @Body(ValidationPipe) sftpRequest: SftpRequestDto): Promise<Response<boolean, Record<string, boolean>>> {
    return await this.sftpService.deleteFolder(res, sftpRequest);
  }
}
