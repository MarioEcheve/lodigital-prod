import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '.././../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {


  encrypt(value): string {
    return CryptoJS.AES.encrypt(value, environment.author.toLowerCase().trim()).toString();
  }

  decrypt(value) {
    return CryptoJS.AES.decrypt(value, environment.author.toLowerCase().trim()).toString(CryptoJS.enc.Utf8);
  }

}
