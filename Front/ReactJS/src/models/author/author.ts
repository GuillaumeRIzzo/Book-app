export class Author {
  authorId: number;
  authorUuid: string;
  authorFullName: string;
  AuthorBirthDate: Date;
  AuthorBirthPlace: string;
  AuthorDeathDate: Date;
  AuthorDeathPlace: string;
  AuthorBio: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  constructor(
    authorId: number,
    authorUuid: string,
    authorFullName: string,
    AuthorBirthDate: Date,
    AuthorBirthPlace: string,
    AuthorDeathDate: Date,
    AuthorDeathPlace: string,
    AuthorBio: string,
    isDeleted: boolean,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.authorId = authorId
    this.authorUuid = authorUuid
    this.authorFullName = authorFullName
    this.AuthorBirthDate = AuthorBirthDate
    this.AuthorBirthPlace = AuthorBirthPlace
    this.AuthorDeathDate = AuthorDeathDate
    this.AuthorDeathPlace = AuthorDeathPlace
    this.AuthorBio = AuthorBio
    this.isDeleted = isDeleted
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  } 
}
