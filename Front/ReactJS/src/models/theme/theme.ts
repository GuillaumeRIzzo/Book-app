export class Theme {
  themeId: number;
  themeUuid: string;
  themeName: string;
  isDefault: boolean;

  constructor(
    themeId: number,
    themeUuid: string,
    themeName: string,
    isDefault: boolean,
  ) {
    this.themeId = themeId;
    this.themeUuid = themeUuid;
    this.themeName = themeName;
    this.isDefault = isDefault;
  }
}
