import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { TranslateService } from '@ngx-translate/core';

const { App, Filesystem } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class AppUrlOpenService {
  constructor(private translateService: TranslateService) {}

  public async init(fileExtensionHandler: { extension: string; handler: Function }[]) {
    App.addListener('appUrlOpen', async (appUrlOpen) => {
      const foundFeh = fileExtensionHandler.find((feh) => appUrlOpen.url.endsWith(feh.extension));

      if (foundFeh && foundFeh.handler) {
        try {
          const contents = await Filesystem.readFile({ path: appUrlOpen.url });
          const reader = new FileReader();
          reader.onload = () => foundFeh.handler(reader.result);
          reader.readAsText(new Blob([atob(contents.data)]));
        } catch (e) {
          alert(e.errorMessage);
        }
      } else {
        // TODO need generic message not from FC
        alert(this.translateService.instant('territories.wrongFileType'));
      }
    });
  }
}
