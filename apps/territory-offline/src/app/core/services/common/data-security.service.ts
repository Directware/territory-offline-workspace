import {Injectable} from '@angular/core';
import {Plugins} from '@capacitor/core';
import {environment} from "../../../../environments/environment";

const {Device, BiometricAuth} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class DataSecurityService
{
  private implicitEncryptionAvailable: boolean;
  private biometricAuthAvailable: boolean;

  constructor()
  {
  }

  public async init()
  {
    const deviceInfo = await Device.getInfo().catch();
    this.implicitEncryptionAvailable = deviceInfo.platform === 'ios' || deviceInfo.platform === 'android';

    try
    {
      const result = await BiometricAuth.isAvailable();
      this.biometricAuthAvailable = result.has;
    } catch (e)
    {
      console.warn(e)
    }
  }

  public canAvoidPassword()
  {
    if (environment.production)
    {
      return this.implicitEncryptionAvailable && this.biometricAuthAvailable;
    }

    return true;
  }

  public platformBiometricAuthAvailable()
  {
    return this.biometricAuthAvailable;
  }

  public async verify(message: string)
  {
    if (this.biometricAuthAvailable)
    {
      await BiometricAuth.verify({
        reason: message, // iOS
        title: "", // Android
        description: message // Android
      });
    }
  }
}
