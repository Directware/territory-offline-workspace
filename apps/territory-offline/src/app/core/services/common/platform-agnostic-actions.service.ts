import {TranslateService} from '@ngx-translate/core';
import {Injectable} from '@angular/core';
import {Plugins} from "@capacitor/core";
import {IpcService} from "./ipc.service";

const {Share, Clipboard} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PlatformAgnosticActionsService
{
  constructor(private translate: TranslateService, private ipcService: IpcService)
  {
  }

  public restartApp()
  {
    document.location.href = 'index.html';
  }

  public async share(file: any, fileName: string, subPath = "")
  {
    await this.ipcService.send("save-file", {file: btoa(file), subPath, fileName});
    /*
    await Plugins.FileSharer.share({
      filename: fileName,
      base64Data: btoa(file),
      contentType: "text/plain;charset=utf-8",
      android: {
        chooserTitle: this.translate.instant('platformActions.sync')
      }
    }).catch(error => console.error(this.translate.instant('platformActions.sharingFailed'), error.message));
    */
  }

  public async shareText(text: string)
  {
    await Share.share({
      text: text
    }).catch(async () =>
    {
      await Clipboard.write({string: text});
      alert(this.translate.instant("common.shareNotAvailable"));
    });
  }
}
