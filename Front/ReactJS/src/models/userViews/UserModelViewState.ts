import { UserModelView } from "./UserModelView";

export type UserModelViewPlain = ReturnType<UserModelView['toPlainObject']>;

export interface userModelViewState {
  userViews: UserModelViewPlain[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
