import fs from 'fs';
import CryptoJS from 'crypto-js';
import $q from 'q';

let instance = null;
export default class Encryption {
    constructor(filepath=null, encryptionKey=null, runChecks=true) {
        if(instance) {
            return instance;
        }

        this.filepath = filepath;
        this.encryptionKey = encryptionKey;

        if (runChecks) {
            if (!this.fileExists()) {
                instance = null;
                throw new Error('File not exists');
            }

            if (!this.isKeyValid()) {
                instance = null;
                throw new Error('Password is invalid');
            }
        }

        instance = this;
        return instance;
    }

    fileExists() {
        try {
            fs.accessSync(this.filepath)
        } catch (e) {
            return false;
        }
        return true;
    }

    isKeyValid() {
        try {
            this.readSync();
        } catch (e) {
            return false;
        }
        return true;
    }

    encrypt(data) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey);
    }

    decrypt(data) {
        const bytes  = CryptoJS.AES.decrypt(data.toString(), this.encryptionKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }

    readSync() {
        return this.decrypt(fs.readFileSync(this.filepath, 'utf-8', 'r'));
    }

    read() {
        const deferred = $q.defer();
        fs.readFile(this.filepath, 'utf-8', (error, data) => {
            if (error) {
                deferred.reject(error);
            }
            deferred.resolve(this.decrypt(data));
        });
        return deferred.promise;
    }

    save(data, flag='w') {
        const deferred = $q.defer();
        fs.writeFile(this.filepath, this.encrypt(data), {encoding: 'utf8', flag: flag}, (error) => {
            if (error) {
                deferred.reject(error);
                return;
            }
            deferred.resolve();
        });
        return deferred.promise;
    }
}