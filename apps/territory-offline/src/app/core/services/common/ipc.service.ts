import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IpcService {
  constructor() {}

  public on(channel: string, listener: any): void {
    // TODO implement
  }

  public async send(channel: string, data?: any): Promise<boolean> {
    window.postMessage(
      {
        isIpcMessage: true,
        channel: channel,
        data: data,
      },
      '*'
    );

    return true;
  }

  public async sendFileSave(data: { fileName: string; subPath: string; data: any }) {
    window.postMessage(
      {
        isIpcMessage: true,
        channel: 'file-save',
        data,
      },
      '*'
    );
  }
}
