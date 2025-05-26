export class Publisher {
  publisherId: number;
  publisherUuid: string;
  publisherName: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  
  constructor(
    publisherId: number,
    publisherUuid: string,
    publisherName: string,
    imageUrl: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.publisherId = publisherId
    this.publisherUuid = publisherUuid
    this.publisherName = publisherName
    this.imageUrl = imageUrl
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
