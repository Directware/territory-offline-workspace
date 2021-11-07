import { Injectable } from '@angular/core';
import { box, hash, randomBytes, secretbox } from 'tweetnacl';
import { decodeBase64, decodeUTF8, encodeBase64, encodeUTF8 } from 'tweetnacl-util';

@Injectable({ providedIn: 'root' })
export class TweetNaclService {
  private CACHED_PUBLIC_KEY = null;
  private CACHED_SECRET_KEY = null;

  constructor() {}

  public setCaches(pubKey, secKey) {
    this.CACHED_PUBLIC_KEY = pubKey;
    this.CACHED_SECRET_KEY = secKey;
  }

  public invalidateCaches() {
    this.CACHED_PUBLIC_KEY = null;
    this.CACHED_SECRET_KEY = null;
  }

  public checkPassword(passwordFromUserInput: string, savedPasswordHash: string): boolean {
    const passwordWithPadding = this.padToSecretBoxKeyLength(passwordFromUserInput);
    const passwordHash = hash(passwordWithPadding);
    return savedPasswordHash === encodeBase64(passwordHash);
  }

  public sEncrypt(toBeEncrypted: string, encryptionKey: Uint8Array): string {
    const nonce = randomBytes(secretbox.nonceLength);
    const messageUint8 = decodeUTF8(toBeEncrypted);
    const cipher = secretbox(messageUint8, nonce, encryptionKey);

    const fullMessage = new Uint8Array(nonce.length + cipher.length);
    fullMessage.set(nonce);
    fullMessage.set(cipher, nonce.length);

    return encodeBase64(fullMessage);
  }

  public sDecrypt(cipher: string, key: Uint8Array): string {
    const messageWithNonceAsUint8Array = decodeBase64(cipher);
    const nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength);
    const message = messageWithNonceAsUint8Array.slice(secretbox.nonceLength, cipher.length);

    const decrypted = secretbox.open(message, nonce, key);

    if (!decrypted) {
      throw new Error('Could not decrypt message');
    }

    return encodeUTF8(decrypted);
  }

  public aEncrypt(dataToBeEncrypted: unknown): string {
    if (this.CACHED_PUBLIC_KEY && this.CACHED_SECRET_KEY) {
      const nonce = randomBytes(box.nonceLength);
      const messageUint8 = decodeUTF8(JSON.stringify(dataToBeEncrypted));
      const cipher = box(messageUint8, nonce, this.CACHED_PUBLIC_KEY, this.CACHED_SECRET_KEY);
      const fullMessage = new Uint8Array(nonce.length + cipher.length);
      fullMessage.set(nonce);
      fullMessage.set(cipher, nonce.length);
      return encodeBase64(fullMessage);
    } else {
      throw new Error('No public key | no secret key!');
    }
  }

  public aDecrypt(secretData: string): string {
    if (this.CACHED_PUBLIC_KEY && this.CACHED_SECRET_KEY) {
      const messageWithNonceAsUint8Array = decodeBase64(secretData);
      const nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength);
      const cipher = messageWithNonceAsUint8Array.slice(secretbox.nonceLength, secretData.length);
      const decrypted = box.open(cipher, nonce, this.CACHED_PUBLIC_KEY, this.CACHED_SECRET_KEY);
      return encodeUTF8(decrypted);
    } else {
      throw new Error('No public key | no secret key!');
    }
  }

  public padToSecretBoxKeyLength(phrase: string): Uint8Array {
    return new Uint8Array(
      phrase
        .padEnd(secretbox.keyLength, '0')
        .split('')
        .map((c) => c.charCodeAt(0))
    );
  }
}
