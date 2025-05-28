export class Category {
  categoryId: number;
  categoryUuid: string;
  categoryName: string;
  categoryDescription: string;
  imageUrl: string;
  imageAlt?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    categoryId: number,
    categoryUuid: string,
    categoryName: string,
    categoryDescription: string,
    imageUrl: string,
    imageAlt: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.categoryId = categoryId
    this.categoryUuid = categoryUuid
    this.categoryName = categoryName
    this.categoryDescription = categoryDescription
    this.imageUrl = imageUrl
    this.imageAlt = imageAlt
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
