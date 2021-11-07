import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';
import { box, hash } from 'tweetnacl';
import { encodeBase64 } from 'tweetnacl-util';
import { ApplicationState } from '../../store/index.reducers';
import { selectPasswordHash } from '../../store/settings/settings.selectors';
import { Observable } from 'rxjs';
import { TweetNaclService } from './tweetnacl/tweet-nacl.service';
import { TimedEntity } from '@territory-offline-workspace/shared-interfaces';
import { stringToUint8Array } from '@territory-offline-workspace/shared-utils';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  constructor(private store: Store<ApplicationState>, private tweetNaclService: TweetNaclService) {}

  public isPasswordCorrect(passwordFromUserInput): Observable<boolean> {
    return this.store.pipe(
      select(selectPasswordHash),
      first(),
      map((savedPasswordHash) =>
        this.tweetNaclService.checkPassword(passwordFromUserInput, savedPasswordHash)
      )
    );
  }

  public decryptSecretKey(password: string, publicKey: any, encryptedSecretKey: any): Uint8Array {
    const passwordAsUint8 = this.tweetNaclService.padToSecretBoxKeyLength(password);
    const decryptedSecretKey = this.tweetNaclService.sDecrypt(encryptedSecretKey, passwordAsUint8);
    const secretKey = stringToUint8Array(decryptedSecretKey);
    this.tweetNaclService.setCaches(publicKey, secretKey);
    return secretKey;
  }

  public generateInitialConfig(password: string) {
    const passwordAsUint8 = this.tweetNaclService.padToSecretBoxKeyLength(password);
    const keyPair = box.keyPair();
    this.tweetNaclService.setCaches(keyPair.publicKey, keyPair.secretKey);
    return {
      hash: encodeBase64(hash(passwordAsUint8)),
      encryptedSecretKey: this.tweetNaclService.sEncrypt(
        keyPair.secretKey.toString(),
        passwordAsUint8
      ),
      secretKey: keyPair.secretKey,
      publicKey: keyPair.publicKey,
    };
  }

  public async asymmetricEncryption(
    dataToBeEncrypted: TimedEntity
  ): Promise<{ id: string; cipher: string }> {
    return {
      id: dataToBeEncrypted.id,
      cipher: this.tweetNaclService.aEncrypt(dataToBeEncrypted),
    };
  }

  public async asymmetricDecryption(cipherWithNonce: string): Promise<unknown> {
    return JSON.parse(this.tweetNaclService.aDecrypt(cipherWithNonce));
  }
}
