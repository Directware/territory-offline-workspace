import {TranslateService} from '@ngx-translate/core';
import {Injectable} from '@angular/core';
import {Plugins} from "@capacitor/core";

const {Share, Clipboard} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PlatformAgnosticActionsService
{
  constructor(private translate: TranslateService)
  {
  }

  public restartApp()
  {
    document.location.href = 'index.html';
  }

  public async share(file: any, fileName: string)
  {
    const translations = await this.translate.get(['platformActions.sync, platformActions.sharingFailed']).toPromise();
    await Plugins.FileSharer.share({
      filename: fileName,
      base64Data: btoa(file),
      contentType: "text/plain;charset=utf-8",
      android: {
        chooserTitle: translations['platformActions.sync']
      }
    }).catch(error => console.error(translations['platformActions.sharingFailed'], error.message));
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
