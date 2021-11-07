import { Injectable } from '@angular/core';
import * as languages from 'libs/ui-components/src/lib/assets/others/languages.json';

export interface ToLanguage {
  languageCode: string;
  name: string;
  nativeName: string;
}

@Injectable({ providedIn: 'root' })
export class TerritoryLanguageService {
  private readonly LANGUAGES_DICTIONARY: {
    [languageCode: string]: { name: string; nativeName: string };
  };
  private readonly LANGUAGES: ToLanguage[] = [];

  constructor() {
    // typescript automatic encapsulates languages object into a default module
    this.LANGUAGES_DICTIONARY = (<any>languages).default;
    Object.keys(this.LANGUAGES_DICTIONARY).forEach((langCode) =>
      this.LANGUAGES.push({
        languageCode: langCode,
        name: this.LANGUAGES_DICTIONARY[langCode].name,
        nativeName: this.LANGUAGES_DICTIONARY[langCode].nativeName,
      })
    );

    Object.freeze(this.LANGUAGES_DICTIONARY);
    Object.freeze(this.LANGUAGES);
  }

  public searchLanguage(searchPhrase: string): ToLanguage[] {
    if (searchPhrase) {
      const normalizedSearchPhrase = searchPhrase.toLowerCase().trim();
      return this.LANGUAGES.filter(
        (lang) =>
          lang.name.toLowerCase().startsWith(normalizedSearchPhrase) ||
          lang.nativeName.toLowerCase().startsWith(normalizedSearchPhrase)
      );
    }
  }

  public getLanguageByCode(languageCode: string): ToLanguage {
    if (!!this.LANGUAGES_DICTIONARY[languageCode]) {
      return {
        languageCode: languageCode,
        nativeName: this.LANGUAGES_DICTIONARY[languageCode].nativeName,
        name: this.LANGUAGES_DICTIONARY[languageCode].name,
      };
    }

    return null;
  }
}
