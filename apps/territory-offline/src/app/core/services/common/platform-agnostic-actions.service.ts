import {Injectable} from '@angular/core';
import {Plugins, registerWebPlugin} from "@capacitor/core";
import {FileSharer} from "@byteowls/capacitor-filesharer";

@Injectable({
  providedIn: 'root'
})
export class PlatformAgnosticActionsService
{
  constructor()
  {
    registerWebPlugin(FileSharer);
  }

  public restartApp()
  {
    document.location.href = 'index.html';
  }

  public async share(file: any, fileName: string)
  {
    await Plugins.FileSharer.share({
      filename: fileName,
      base64Data: btoa(file),
      contentType: "text/plain;charset=utf-8",
      android: {
        chooserTitle: "Territory Offline Sync"
      }
    }).catch(error => console.error("File sharing failed", error.message));
  }
}
