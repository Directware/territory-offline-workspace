import {Injectable} from '@angular/core';
import {Plugins} from '@capacitor/core';
import {environment} from "../../../../environments/environment";
const {Device} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class DataSecurityService
{
  private platform: 'ios' | 'android' | 'electron' | 'web';
  private implicitEncryptionAvailable: boolean;
  private biometricAuthAvailable: boolean;

  constructor()
  {
  }

  public async init()
  {
    const deviceInfo = await Device.getInfo();
    this.platform = deviceInfo.platform;
    this.implicitEncryptionAvailable = deviceInfo.platform === 'ios' || deviceInfo.platform === 'android';

    this.biometricAuthAvailable = false
  }

  public mustUsePassword()
  {
    if (environment.production)
    {
      return this.platform === "electron" || this.platform === "web";
    }

    return false;
  }

  public platformBiometricAuthAvailable()
  {
    return this.biometricAuthAvailable;
  }

  public async verify(message: string)
  {
  }
}
