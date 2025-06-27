export class UserRight {
  userRightId: number;
  userRightUuid: string;
  userRightName: string;

  constructor(
    userRightId: number,
    userRightUuid: string,
    userRightName: string,
  ) {
    this.userRightId = userRightId;
    this.userRightUuid = userRightUuid;
    this.userRightName = userRightName;
  }
}
