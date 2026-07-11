import { createSelector } from '@reduxjs/toolkit';

import { UserModelView, UserModelViewObject } from '@/models/userViews/UserModelView';
import { selectAllUsers } from '../users/userSelector';
import { selectAllUserRights } from '../userRights/userRightSelector';

export const selectUserModelViews = createSelector(
  [selectAllUsers, selectAllUserRights],
  (users, rights): UserModelViewObject[] => {
    return users
      .map(user => {
        const matchedUserRight = rights.find(r => user.userRightUuid === r.userRightUuid);
        if (!matchedUserRight) {
          console.warn(`User ${user.userLogin} has no matching right`);
          return null;
        }
        return new UserModelView(user, matchedUserRight).toPlainObject();
      })
      .filter((u): u is UserModelViewObject => u !== null);
  }
);
