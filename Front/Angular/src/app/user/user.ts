export class User {
  userId: number;
  userFirstname: string;
  userLastname: string;
  userPassword: string;
  userLogin: string;
  userEmail: string;
  userRight: string;

  constructor(
    userId: number,
    userFirstname: string,
    userLastname: string,
    userPassword: string,
    userLogin: string,
    userEmail: string,
    userRight: string
  ) {
    this.userId = userId
    this.userFirstname = userFirstname
    this.userLastname = userLastname
    this.userPassword = userPassword
    this.userLogin = userLogin
    this.userEmail = userEmail
    this.userRight = userRight
  }
}