import { Injectable, Injector } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { environment } from "../../../../environments/environment";
// import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';

import { Device } from "@capacitor/device";

@Injectable({
  providedIn: "root",
})
export class DataSecurityService {
  private platform: "ios" | "android" | "electron" | "web";
  private implicitEncryptionAvailable: boolean;
  private biometricAuthAvailable: boolean;

  constructor(private injector: Injector) {}

  public async init() {
    const deviceInfo = await Device.getInfo();
    this.platform = deviceInfo.platform;
    this.implicitEncryptionAvailable =
      deviceInfo.platform === "ios" || deviceInfo.platform === "android";

    //TODO: fix
    // if (this.implicitEncryptionAvailable)
    // {
    //   // Plugin is not available in the browser
    //   const fingerprintAIO = this.injector.get(FingerprintAIO);
    //   try
    //   {
    //     const result = await fingerprintAIO.isAvailable();
    //     // TODO ex. BIOMETRIC_PERMISSION_NOT_GRANTED

    //     this.biometricAuthAvailable = result;
    //   }
    //   catch (e)
    //   {
    //     console.error(`[DataSecurityService]: code="${e.code}", message="${e.message}"`);
    //     this.biometricAuthAvailable = false;
    //   }
    // }
  }

  public mustUsePassword() {
    if (!environment.production && this.platform === "web") {
      // dev mode
      return false;
    }

    if (this.platform === "ios" || this.platform === "android") {
      return !this.biometricAuthAvailable;
    }

    return true;
  }

  public platformBiometricAuthAvailable() {
    return this.biometricAuthAvailable;
  }

  public async verify() {
    if (this.implicitEncryptionAvailable) {
      const fingerprintAIO = this.injector.get(FingerprintAIO);
      return fingerprintAIO.show({});
    }

    if (!environment.production) {
      return true;
    }

    throw Error("Can not verify!");
  }
}
