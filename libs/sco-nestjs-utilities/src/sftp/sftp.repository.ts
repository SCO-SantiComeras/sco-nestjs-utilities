import { Inject, Injectable } from '@nestjs/common';
import { SftpRequestDto } from './dto/sftp-request.dto';
import { SftpConfig } from './config/sftp-config';

@Injectable()
export class SftpRepository {

    private _Client: any;
    private _sftp: any;
    private _configurationSftp: SftpConfig;

    constructor(@Inject('CONFIG_OPTIONS') private options: SftpConfig) {
        this._Client = require('ssh2-sftp-client');
        this._configurationSftp = options;
    }

    async onModuleInit() {
        this._sftp = await this.createClient();
    }

    /* File Functions */
    async putFile(sftpRequest: SftpRequestDto): Promise<boolean> {
        let puttedFile = false;

        await this._sftp
            .connect(this._configurationSftp)
            .then(async () => {
                return await this._sftp.fastPut(sftpRequest.path, sftpRequest.newPath);
            })
            .then((data) => {
                if (sftpRequest.verbose) {
                    console.log(`[SFTP putFile] ${JSON.stringify(data)}`);
                }

                if (data != false) {
                    puttedFile = true;
                }
            })
            .then(async () => {
                return await this.closeConnection();
            })
            .catch(async (err) => {
                if (sftpRequest.verbose) {
                    console.error(`[SFTP putFile] ${err.message}`);
                }
                return await this.closeConnection();
            });

        return puttedFile;
    }

    async getFile(sftpRequest: SftpRequestDto): Promise<boolean> {
        let gettedFile = false;

        await this._sftp
            .connect(this._configurationSftp)
            .then(async () => {
                return await this._sftp.exists(sftpRequest.path);
            })
            .then((data) => {
                if (data == false) {
                    if (sftpRequest.verbose) {
                        console.log(`[SFTP getFile] Remote file does not exists`);
                    }
                }
            })
            .then(async () => {
                return await this._sftp.fastGet(sftpRequest.path, sftpRequest.newPath);
            })
            .then((data) => {
                if (sftpRequest.verbose) {
                    console.log(`[SFTP getFile] ${JSON.stringify(data)}`);
                }
                if (data) {
                    gettedFile = true;
                }
            })
            .then(async () => {
                return await this.closeConnection();
            })
            .catch(async (err) => {
                if (sftpRequest.verbose) {
                    console.error(`[SFTP getFile] ${err.message}`);
                }
                return await this.closeConnection();
            });

        return gettedFile;
    }

    async moveFile(sftpRequest: SftpRequestDto): Promise<boolean> {
        let movedFile = false;

        await this._sftp
            .connect(this._configurationSftp)
            .then(async () => {
                return await this._sftp.exists(sftpRequest.path);
            })
            .then((data) => {
                if (data == false) {
                    if (sftpRequest.verbose) {
                        console.log(`[SFTP moveFile] Remote file does not exists.`);
                    }
                }
            })
            .then(async () => {
                return await this._sftp.rcopy(sftpRequest.path, sftpRequest.newPath);
            })
            .then((data) => {
                if (sftpRequest.verbose) {
                    console.log(`[SFTP moveFile] ${JSON.stringify(data)}`);
                }
                if (data != false) {
                    movedFile = true;
                }
            })
            .then(async () => {
                return await this._sftp.delete(sftpRequest.path);
            })
            .then((data) => {
                if (sftpRequest.verbose) {
                    console.log(`[SFTP moveFile] ${JSON.stringify(data)}`);
                }
            })
            .then(async () => {
                return await this.closeConnection();
            })
            .catch(async (err) => {
                if (sftpRequest.verbose) {
                    console.error(`[SFTP moveFile] ${err.message}`);
                }
                return await this.closeConnection();
            });

        return movedFile;
    }

    async deleteFile(sftpRequest: SftpRequestDto): Promise<boolean> {
        let deletedFile = false;

        await this._sftp
            .connect(this._configurationSftp)
            .then(async () => {
                return await this._sftp.exists(sftpRequest.path);
            })
            .then((data) => {
                if (data == false) {
                    if (sftpRequest.verbose) {
                        console.log(`[SFTP deleteFile] Remote file does not exists.`);
                    }
                }
            })
            .then(async () => {
                return await this._sftp.delete(sftpRequest.path);
            })
            .then((data) => {
                if (sftpRequest.verbose) {
                    console.log(`[SFTP deleteFile] ${JSON.stringify(data)}`);
                }
                if (data != false) {
                    deletedFile = true;
                }
            })
            .then(async () => {
                return await this.closeConnection();
            })
            .catch(async (err) => {
                if (sftpRequest.verbose) {
                    console.error(`[SFTP deleteFile] ${err.message}`);
                }
                return await this.closeConnection();
            });

        return deletedFile;
    }

    async renameFile(sftpRequest: SftpRequestDto): Promise<boolean> {
        let renamedFile = false;

        await this._sftp
            .connect(this._configurationSftp)
            .then(async () => {
                return await this._sftp.exists(sftpRequest.path);
            })
            .then((data) => {
                if (data == false) {
                    if (sftpRequest.verbose) {
                        console.log(`[SFTP renameFile] Remote file does not exists.`);
                    }
                }
            })
            .then(async () => {
                return await this._sftp.rename(sftpRequest.path, sftpRequest.newPath);
            })
            .then((data) => {
                if (sftpRequest.verbose) {
                    console.log(`[SFTP renameFile] ${JSON.stringify(data)}`);
                }
                if (data != false) {
                    renamedFile = true;
                }
            })
            .then(async () => {
                return await this.closeConnection();
            })
            .catch(async (err) => {
                if (sftpRequest.verbose) {
                    console.error(`[SFTP renameFile] ${err.message}`);
                }
                return await this.closeConnection();
            });

        return renamedFile;
    }

    async existsFile(sftpRequest: SftpRequestDto): Promise<boolean> {
        let exists = false;

        await this._sftp
            .connect(this._configurationSftp)
            .then(async () => {
                return await this._sftp.exists(sftpRequest.path);
            })
            .then((data) => {
                if (sftpRequest.verbose) {
                    console.log(`[SFTP existsFile] ${JSON.stringify(data)}`);
                }
                if (data != false) exists = true;
            })
            .then(async () => {
                return await this.closeConnection();
            })
            .catch(async (err) => {
                if (sftpRequest.verbose) {
                    console.error(`[SFTP existsFile] ${err.message}`);
                }
                return await this.closeConnection();
            });

        return exists;
    }

    async list(sftpRequest: SftpRequestDto): Promise<any[]> {
        const list: any[] = [];

        await this._sftp
            .connect(this._configurationSftp)
            .then(async () => {
                return await this._sftp.list(sftpRequest.path);
            })
            .then(async (data: any[]) => {
                if (sftpRequest.verbose) {
                    console.log(`[SFTP list] ${JSON.stringify(data)}`);
                }
                if (data) {
                    data.forEach(async (element) => {
                        list.push({
                            name: element.name,
                            type: element.type == '-' ? 'file' : 'directory',
                        });
                    });
                }
            })
            .then(async () => {
                return await this.closeConnection();
            })
            .then(async () => {
                return list;
            })
            .catch(async (err) => {
                if (sftpRequest.verbose) {
                    console.error(`[SFTP list] ${err.message}`);
                }
                return await this.closeConnection();
            });

        return list;
    }

    async getBase64FromRemoteFile(sftpRequest: SftpRequestDto): Promise<string> {
        let base64 = '';

        await this._sftp
            .connect(this._configurationSftp)
            .then(async () => {
                return await this._sftp.get(sftpRequest.path);
            })
            .then(async (data: any) => {
                if (sftpRequest.verbose) {
                    console.log(`[SFTP getBase64FromRemoteFile] ${JSON.stringify(data)}`);
                }
                if (data) {
                    base64 = Buffer.from(data).toString('base64');
                }
            })
            .then(async () => {
                return await this.closeConnection();
            })
            .then(async () => {
                return base64;
            })
            .catch(async (err) => {
                if (sftpRequest.verbose) {
                    console.error(`[SFTP getBase64FromRemoteFile] ${err.message}`);
                }
                return await this.closeConnection();
            });

        return base64;
    }

    async getBufferFromRemoteFile(sftpRequest: SftpRequestDto): Promise<number[]> {
        let buffer: number[] = null;

        await this._sftp
            .connect(this._configurationSftp)
            .then(async () => {
                return await this._sftp.get(sftpRequest.path);
            })
            .then(async (data: Object) => {
                if (sftpRequest.verbose) {
                    console.log(`[SFTP getBufferFromRemoteFile] ${JSON.stringify(data)}`);
                }
                if (data) {
                    buffer = JSON.parse(JSON.stringify(data)).data;
                }
            })
            .then(async () => {
                return await this.closeConnection();
            })
            .then(async () => {
                return buffer;
            })
            .catch(async (err) => {
                if (sftpRequest.verbose) {
                    console.error(`[SFTP getBufferFromRemoteFile] ${err.message}`);
                }
                return await this.closeConnection();
            });

        return buffer;
    }

    async checkIfFileIsDirectory(sftpRequest: SftpRequestDto): Promise<boolean> {
        let isDirectory = false;

        await this._sftp
            .connect(this._configurationSftp)
            .then(async () => {
                return await this._sftp.stat(sftpRequest.path);
            })
            .then(async (data: Object) => {
                if (sftpRequest.verbose) {
                    console.log(`[SFTP checkIfFileIsDirectory] ${JSON.stringify(data)}`);
                }
                if (data) {
                    isDirectory = JSON.parse(JSON.stringify(data)).isDirectory;
                }
            })
            .then(async () => {
                return await this.closeConnection();
            })
            .then(async () => {
                return isDirectory;
            })
            .catch(async (err) => {
                if (sftpRequest.verbose) {
                    console.error(`[SFTP checkIfFileIsDirectory] ${err.message}`);
                }
                return await this.closeConnection();
            });

        return isDirectory;
    }

    async uploadDir(sftpRequest: SftpRequestDto): Promise<boolean> {
        let uploadedDir = false;

        await this._sftp
            .connect(this._configurationSftp)
            .then(async () => {
                return await this._sftp.uploadDir(sftpRequest.path, sftpRequest.newPath);
            })
            .then((data) => {
                if (sftpRequest.verbose) {
                    console.log(`[SFTP uploadDir] ${JSON.stringify(data)}`);
                }
                if (data != false) {
                    uploadedDir = true;
                }
            })
            .then(async () => {
                return await this.closeConnection();
            })
            .catch(async (err) => {
                if (sftpRequest.verbose) {
                    console.error(`[SFTP uploadDir] ${err.message}`);
                }
                return await this.closeConnection();
            });

        return uploadedDir;
    }

    async downloadDir(sftpRequest: SftpRequestDto): Promise<boolean> {
        let downloadedDir = false;

        await this._sftp
            .connect(this._configurationSftp)
            .then(async () => {
                return await this._sftp.downloadDir(
                    sftpRequest.path,
                    sftpRequest.newPath,
                );
            })
            .then((data) => {
                if (sftpRequest.verbose) {
                    console.log(`[SFTP downloadDir] ${JSON.stringify(data)}`);
                }
                if (data != false) {
                    downloadedDir = true;
                }
            })
            .then(async () => {
                return await this.closeConnection();
            })
            .catch(async (err) => {
                if (sftpRequest.verbose) {
                    console.error(`[SFTP downloadDir] ${err.message}`);
                }
                return await this.closeConnection();
            });

        return downloadedDir;
    }

    /* Folder Functions */
    async createFolder(sftpRequest: SftpRequestDto): Promise<boolean> {
        let createdFolder = false;

        await this._sftp
            .connect(this._configurationSftp)
            .then(async () => {
                return await this._sftp.mkdir(sftpRequest.path, sftpRequest.recursive);
            })
            .then((data) => {
                if (sftpRequest.verbose) {
                    console.log(`[SFTP createFolder] ${JSON.stringify(data)}`);
                }
                if (data != false) {
                    createdFolder = true;
                }
            })
            .then(async () => {
                return await this.closeConnection();
            })
            .catch(async (err) => {
                if (sftpRequest.verbose) {
                    console.error(`[SFTP createFolder] ${err.message}`);
                }
                return await this.closeConnection();
            });

        return createdFolder;
    }

    async deleteFolder(sftpRequest: SftpRequestDto): Promise<boolean> {
        let deletedFolder = false;

        await this._sftp
            .connect(this._configurationSftp)
            .then(async () => {
                return await this._sftp.rmdir(sftpRequest.path, sftpRequest.recursive);
            })
            .then((data) => {
                if (sftpRequest.verbose) {
                    console.log(`[SFTP deleteFolder] ${JSON.stringify(data)}`);
                }
                if (data != false) {
                    deletedFolder = true;
                }
            })
            .then(async () => {
                return await this.closeConnection();
            })
            .catch(async (err) => {
                if (sftpRequest.verbose) {
                    console.error(`[SFTP deleteFolder] ${err.message}`);
                }
                return await this.closeConnection();
            });

        return deletedFolder;
    }

    /* Connection functions */
    private async createClient() {
        return new this._Client();
    }

    private async closeConnection(): Promise<void> {
        try {
            await this._sftp.client.removeAllListeners('error');
            await this._sftp.end();
            return;
        } catch (err) {
            console.error(`[SFTP closeConnection] ${err.message}`);
        }
    }

    private async getSftpConfig() {
        return this._configurationSftp;
    }

    private async setSftpConfig(options: SftpConfig) {
        this._configurationSftp = options;
    }
}
