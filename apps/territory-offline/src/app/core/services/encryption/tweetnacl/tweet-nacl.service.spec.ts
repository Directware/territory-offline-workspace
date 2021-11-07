import { TweetNaclService } from './tweet-nacl.service';
import { box } from 'tweetnacl';

describe('tweet-nacl.service.spec', () => {
  let tweetNaclService: TweetNaclService;

  beforeEach(() => {
    const keyPair = box.keyPair();
    tweetNaclService = new TweetNaclService();
    tweetNaclService.setCaches(keyPair.publicKey, keyPair.secretKey);
  });

  it('should check password', () => {
    const userPassword = 'my-awesome-password-12345';

    const shouldBeTrueResult = tweetNaclService.checkPassword(
      userPassword,
      '//SXxCcCkhPicC1f9gX+WohEicMfZRvpM7Fe4QWN4m/9snuoxM+YAvEz4SJ8r2u1c3Zf5MIY7ZqCfug507xkFQ=='
    );

    const shouldBeFalseResult = tweetNaclService.checkPassword(
      userPassword + '42',
      '//SXxCcCkhPicC1f9gX+WohEicMfZRvpM7Fe4QWN4m/9snuoxM+YAvEz4SJ8r2u1c3Zf5MIY7ZqCfug507xkFQ=='
    );

    expect(shouldBeTrueResult).toBe(true);
    expect(shouldBeFalseResult).toBe(false);
  });

  it('should encrypt and decrypt data (asymmetric)', () => {
    const dataToBeEncrypted = {
      id: 'my-id',
      name: 'Klimentowicz',
      sureName: 'Mateusz',
    };

    const cipher = tweetNaclService.aEncrypt(dataToBeEncrypted);

    const result = JSON.parse(tweetNaclService.aDecrypt(cipher));

    expect(result.id).toBe('my-id');
    expect(result.name).toBe('Klimentowicz');
    expect(result.sureName).toBe('Mateusz');
  });

  it('should encrypt and decrypt data (symmetric)', () => {
    const password = tweetNaclService.padToSecretBoxKeyLength('my-awesome-password');
    const dataToBeEncrypted = 'my-some-secret-data';

    const encrypted = tweetNaclService.sEncrypt(dataToBeEncrypted, password);
    const decrypted = tweetNaclService.sDecrypt(encrypted, password);

    expect(decrypted).toEqual(dataToBeEncrypted);
  });
});
