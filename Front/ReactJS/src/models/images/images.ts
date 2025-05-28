export class Image {
  imageId: number;
  imageUuid: string;
  bookUuid: string;
  imageUrl: string
  imageAlt: string;
  isCover: boolean;
  imageOrder: number;
  createdAt: Date;
  updatedAt: Date;
  imageTypeUuid: string;

  constructor() {
    this.imageId = 0;
    this.imageUuid = '';
    this.bookUuid = '';
    this.imageAlt = '';
    this.isCover = false;
    this.imageOrder = 0;
    this.imageUrl = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.imageTypeUuid = '';
  }
}
