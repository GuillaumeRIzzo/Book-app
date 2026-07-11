import { User } from "../user/user";
import { UserRight } from "../userRight/userRight";

export class UserModelView {
  constructor(
    public user: User,
    public right: UserRight,
  ) {
    this.user = user;
    this.right = right;
  }
  toPlainObject() {
    return {
      user: this.user,
      right: this.right,
    };
  }
}
export type UserModelViewObject = ReturnType<UserModelView['toPlainObject']>;
