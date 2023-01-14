import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { TranslateService } from "@ngx-translate/core";
import { saveAs } from "file-saver";
import { IpcService } from "./ipc.service";

const { Share, Clipboard, Device } = Plugins;

@Injectable({
  providedIn: "root",
})
export class PlatformAgnosticActionsService {
  constructor(
    private translate: TranslateService,
    private ipcService: IpcService
  ) {}

  public restartApp() {
    document.location.href = "index.html";
  }

  // TODO handle Mobile
  public async share(file: any, fileName: string, subPath = "") {
    const info = await Device.getInfo();

    switch (info.platform) {
      case "web": {
        // TODO: für Excel, Gzip Dateien geht das aber PDFs nicht
        var blob = new Blob([this.stringToArrayBuffer(file)]);
        saveAs(blob, fileName);
        break;
      }
      default: {
        await this.ipcService.send("save-file", { file, subPath, fileName });
      }
    }
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

  public async shareText(text: string) {
    await Share.share({
      text: text,
    }).catch(async () => {
      await Clipboard.write({ string: text });
      alert(this.translate.instant("common.shareNotAvailable"));
    });
  }

  private stringToArrayBuffer(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
}
