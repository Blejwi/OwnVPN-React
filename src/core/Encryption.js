import fs from 'fs';
import CryptoJS from 'crypto-js';
import $q from 'q';
/**
 * Encryption singleton instance reference is kept in this variable.
 */
let instance = null;

/**
 * Function used to delete Encryption singleton.
 * Used in case of changing filepath of password.
 */
export const deleteInstance = () => {
    instance = null;
};

/**
 * Singleton class used for encryption of OwnVPN configuration file
 */
export default class Encryption {
    /**
     * Constructor function that checks if given file exists and if password is valid
     * @param {string} [filepath=null] Path to config file
     * @param {string} [encryptionKey=null] Password used for config decryption
     * @param {bool} [runChecks=true] Option that indicates if file and password check should be ran
     * @return {Encryption}
     */
    constructor(filepath = null, encryptionKey = null, runChecks = true) {
        if (instance) {
            return instance;
        }

        /**
         * Path to config file
         */
        this.filepath = filepath;

        /**
         * Password used for config decryption
         */
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

    /**
     * Checks if given config file exists
     * @return {boolean}
     */
    fileExists() {
        try {
            fs.accessSync(this.filepath);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * Check if given password can decrypt read configuration file
     * @return {boolean}
     */
    isKeyValid() {
        try {
            this.readSync();
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * Function used for encryption of config file content
     * @param {object} data Data to be encrypted
     * @return {*}
     */
    encrypt(data) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey);
    }

    /**
     * Function used for decprytion of config file content
     * @param {*} data Encrypted data
     * @return {object} Decrypted data
     */
    decrypt(data) {
        const bytes = CryptoJS.AES.decrypt(data.toString(), this.encryptionKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }

    /**
     * Function used for synchronous read of file
     * @return {*} Content of file
     */
    readSync() {
        return this.decrypt(fs.readFileSync(this.filepath, 'utf-8', 'r'));
    }

    /**
     * Asynchronous read function
     * @return {promise}
     */
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

    /**
     * Asynchronous save function
     * @param {object} data Data to be saved
     * @param {string} [flag='w'] Flag to be used during file write
     * @return {promise}
     */
    save(data, flag = 'w') {
        const deferred = $q.defer();
        fs.writeFile(this.filepath, this.encrypt(data), { encoding: 'utf8', flag }, (error) => {
            if (error) {
                deferred.reject(error);
                return;
            }
            deferred.resolve();
        });
        return deferred.promise;
    }
}
