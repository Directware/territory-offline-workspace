import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {map, take} from 'rxjs/operators';
import {box, hash, randomBytes, secretbox} from 'tweetnacl';
import {decodeBase64, decodeUTF8, encodeBase64, encodeUTF8} from 'tweetnacl-util';
import {ApplicationState} from '../../store/index.reducers';
import {selectPasswordHash, selectSettings} from '../../store/settings/settings.selectors';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class CryptoService
{
  constructor(private store: Store<ApplicationState>)
  {
  }

  public isPasswordCorrect(password): Observable<boolean>
  {
    return this.store.pipe(
      select(selectPasswordHash),
      take(1),
      map(savedPasswordHash =>
      {
        const passwordWithPadding = this.passwordWithPadding(password);
        const passwordHash = hash(passwordWithPadding);
        return savedPasswordHash === encodeBase64(passwordHash);
      })
    );
  }

  public decryptSecretKey(password: string, encryptedSecretKey: any): Uint8Array
  {
    const passwordAsUint8 = this.passwordWithPadding(password);
    const decryptedSecretKey = this.decryptWithSecretBox(encryptedSecretKey, passwordAsUint8);
    return new Uint8Array(Object.values(decryptedSecretKey));
  }

  public generateInitialConfig(password: string)
  {
    const passwordAsUint8 = this.passwordWithPadding(password);
    const keyPair = box.keyPair();
    return {
      hash: encodeBase64(hash(passwordAsUint8)),
      encryptedSecretKey: this.encryptWithSecretBox(keyPair.secretKey, passwordAsUint8),
      secretKey: keyPair.secretKey,
      publicKey: keyPair.publicKey
    };
  }

  public async asymmetricEncryption(data: any): Promise<{ id: string, cipher: string }>
  {
    const settings = await this.store.pipe(select(selectSettings), take(1)).toPromise();
    const nonce = randomBytes(box.nonceLength);
    const messageUint8 = decodeUTF8(JSON.stringify(data));
    const cipher = box(messageUint8, nonce, settings.publicKey, settings.secretKey);
    const fullMessage = new Uint8Array(nonce.length + cipher.length);
    fullMessage.set(nonce);
    fullMessage.set(cipher, nonce.length);
    return {id: data.id, cipher: encodeBase64(fullMessage)};
  }

  public async asymmetricDecryption(cipherWithNonce: string)
  {
    const settings = await this.store.pipe(select(selectSettings), take(1)).toPromise();
    const messageWithNonceAsUint8Array = decodeBase64(cipherWithNonce);
    const nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength);
    const cipher = messageWithNonceAsUint8Array.slice(secretbox.nonceLength, cipherWithNonce.length);
    const decrypted = box.open(cipher, nonce, settings.publicKey, settings.secretKey);
    const base64DecryptedMessage = encodeUTF8(decrypted);

    return JSON.parse(base64DecryptedMessage);
  }

  private encryptWithSecretBox(json: any, key: Uint8Array): string
  {
    const nonce = randomBytes(secretbox.nonceLength);
    const messageUint8 = decodeUTF8(JSON.stringify(json));
    const cipher = secretbox(messageUint8, nonce, key);

    const fullMessage = new Uint8Array(nonce.length + cipher.length);
    fullMessage.set(nonce);
    fullMessage.set(cipher, nonce.length);

    return encodeBase64(fullMessage);
  }

  private decryptWithSecretBox(messageWithNonce, key: Uint8Array)
  {
    const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
    const nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength);
    const message = messageWithNonceAsUint8Array.slice(secretbox.nonceLength, messageWithNonce.length);

    const decrypted = secretbox.open(message, nonce, key);

    if (!decrypted)
    {
      throw new Error('Could not decrypt message');
    }

    const base64DecryptedMessage = encodeUTF8(decrypted);
    return JSON.parse(base64DecryptedMessage);
  }

  private passwordWithPadding(password: string): Uint8Array
  {
    return new Uint8Array(
      password
        .padEnd(secretbox.keyLength, '0')
        .split('')
        .map(c => c.charCodeAt(0))
    );
  }
}
