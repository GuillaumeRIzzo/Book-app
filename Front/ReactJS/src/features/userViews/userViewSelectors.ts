import { createSelector } from '@reduxjs/toolkit';

import { UserModelView } from '@/models/userViews/UserModelView';
import { selectAllUsers } from '../users/userSelector';
import { selectAllUserRights } from '../userRights/userRightSelector';

export const selectUserModelViews = createSelector(
  [selectAllUsers, selectAllUserRights],
  (users, rights): any[] => {
    return users
      .map(user => {
        const matchedUserRight = rights.find(r => user.userRightUuid === r.userRightUuid);
        if (!matchedUserRight) {
          console.warn(`User ${user.userLogin} has no matching right`);
          return null;
        }
        if (!matchedUserRight) return null; // évite les UserModelView sans droits
        const view = new UserModelView(user, matchedUserRight);
        return view.toPlainObject();
      })
      .filter(Boolean); // retire les null
  }
);
