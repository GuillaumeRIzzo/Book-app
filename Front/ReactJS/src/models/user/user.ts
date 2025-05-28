export class User {
  userId: number;
  userUuid: string;
  userFirstname: string;
  userLastname: string;
  userPassword: string;
  userPasswordLastChangedAt : Date;
  userMustChangePassword: boolean;
  userLogin: string;
  userEmail: string;
  userBirthDate: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  userRightUuid: string;
  genderUuid: string;

  constructor(
    userId: number,
    userUuid: string,
    userFirstname: string,
    userLastname: string,
    userPassword: string,
    userPasswordLastChangedAt: Date,
    userMustChangePassword: boolean,
    userLogin: string,
    userEmail: string,
    userBirthDate: Date,
    isDeleted: boolean,
    createdAt: Date,
    updatedAt: Date,
    userRightUuid: string,
    genderUuid: string,
  ) {
    this.userId = userId;
    this.userUuid = userUuid;
    this.userFirstname = userFirstname;
    this.userLastname = userLastname;
    this.userPassword = userPassword;
    this.userPasswordLastChangedAt = userPasswordLastChangedAt;
    this.userMustChangePassword = userMustChangePassword;
    this.userLogin = userLogin;
    this.userEmail = userEmail;
    this.userBirthDate = userBirthDate;
    this.isDeleted =isDeleted;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userRightUuid = userRightUuid;
    this.genderUuid = genderUuid;
  }
}
