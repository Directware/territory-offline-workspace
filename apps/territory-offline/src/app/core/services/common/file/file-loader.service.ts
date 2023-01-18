import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class FileLoaderService {
  private fileReader: FileReader = null;
  private file;
  private fileContent: any;

  constructor() {}

  public openFile(event): FileLoaderService {
    this.fileReader = new FileReader();
    this.file = null;

    if (event.target.files && event.target.files.length) {
      const [f] = event.target.files;
      this.file = f;
      return this;
    } else {
      throw new Error("[FileLoaderService] No File!");
    }
  }

  public readJson(callback: Function): void {
    if (callback) {
      this.fileReader.onload = () => {
        if (typeof this.fileReader.result === "string") {
          const parseData = JSON.parse(this.fileReader.result);
          this.fileContent = parseData;
          callback.call(this, parseData);
        }
      };

      this.fileReader.readAsText(this.file);
    }
  }

  public readText(callback: Function): void {
    if (callback) {
      this.fileReader.onload = () => {
        if (typeof this.fileReader.result === "string") {
          callback.call(this, this.fileReader.result);
        }
      };

      this.fileReader.readAsText(this.file);
    }
  }

  public getFileContent() {
    return this.fileContent;
  }
}
