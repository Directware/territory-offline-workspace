import {CryptoService} from "./crypto.service";
import {TweetNaclService} from "./tweetnacl/tweet-nacl.service";

describe("crypto.service.spec", () =>
{
  let cryptoService: CryptoService
  let tweetNaclService: TweetNaclService;

  beforeEach(() =>
  {
    tweetNaclService = new TweetNaclService();
    cryptoService = new CryptoService(null, tweetNaclService)
  })

  it("should generate initial config", () =>
  {
    const password = "my-awesome-password-12345";
    const setCachesSpy = jest.spyOn(tweetNaclService, "setCaches");
    const config = cryptoService.generateInitialConfig(password);

    expect(setCachesSpy).toHaveBeenCalledWith(config.publicKey, config.secretKey);
    expect(config.publicKey).toBeTruthy();
    expect(config.secretKey).toBeTruthy();
    expect(config.hash).toBeTruthy();
    expect(config.encryptedSecretKey).toBeTruthy();

    const decryptedSecretKey = cryptoService.decryptSecretKey(password, config.publicKey, config.encryptedSecretKey)
    expect(decryptedSecretKey).toEqual(config.secretKey)
  })
})
