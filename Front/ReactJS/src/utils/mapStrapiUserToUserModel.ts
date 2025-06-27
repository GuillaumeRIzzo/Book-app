import { User } from "@/models/user/user";

export const mapStrapiUserToUserModel = (strapiUser: any): User => ({
  userId: strapiUser.id,
  userLogin: strapiUser.username,
  userEmail: strapiUser.email,
  userFirstname: strapiUser.userFirstname,
  userLastname: strapiUser.userLastname,
  userPassword: strapiUser.password,
  userRight: strapiUser.userRight
});
