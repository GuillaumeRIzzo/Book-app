export class Language {
  languageId: number;
  languageUuid: string;
  languageName: string;
  isoCode: string;
  isDefault: boolean;

  constructor(
    languageId: number,
    languageUuid: string,
    languageName: string,
    isoCode: string,
    isDefault: boolean,
  ) {
    this.languageId = languageId;
    this.languageUuid = languageUuid;
    this.languageName = languageName;
    this.isoCode = isoCode;
    this.isDefault = isDefault;
  }
}
