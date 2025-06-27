export class Preference {
  preferenceId: number;
  preferenceUuid: string;
  userUuid: string;
  languageUuid: string;
  themeUuid: string;
  primaryColorUuid: string;
  secondaryColorUuid: string;
  backgroundColorUuid: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    preferenceId: number,
    preferenceUuid: string,
    userUuid: string,
    languageUuid: string,
    themeUuid: string,
    primaryColorUuid: string,
    secondaryColorUuid: string,
    backgroundColorUuid: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.preferenceId = preferenceId;
    this.preferenceUuid = preferenceUuid;
    this.userUuid = userUuid;
    this.languageUuid = languageUuid;
    this.themeUuid = themeUuid;
    this.primaryColorUuid = primaryColorUuid;
    this.secondaryColorUuid = secondaryColorUuid;
    this.backgroundColorUuid = backgroundColorUuid;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
