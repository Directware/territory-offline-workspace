import { Observable } from 'rxjs';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';

export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  public getTranslation(lang: string): Observable<Object> {
    return this.http.get(`/assets/i18n/${lang.toLowerCase()}.json`);
  }
}
