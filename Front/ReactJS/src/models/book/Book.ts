import { BookImage } from "../bookImages/bookImages";
export class Book {
  bookId: number;
  bookUuid: string;
  bookTitle: string;
  bookSubtitle: string;
  bookDescription: string;
  bookPageCount: number;
  bookPublishDate: Date;
  bookIsbn: string;
  bookPrice: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  bookSeriesUuid: string;

  authorUuids: string;
  categoryUuids: string;
  publisherUuids: string;
  tagUuids: string;
  languageUuids: string;

  images: BookImage[];

  constructor() {
    this.bookId = 0;
    this.bookUuid = '';
    this.bookTitle = '';
    this.bookSubtitle = '';
    this.bookDescription = '';
    this.bookPageCount = 0;
    this.bookPublishDate = new Date();
    this.bookIsbn = '';
    this.bookPrice = 0;
    this.isDeleted = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.bookSeriesUuid = '';

    this.authorUuids = '';
    this.categoryUuids = '';
    this.publisherUuids = '';
    this.tagUuids = '';
    this.languageUuids = '';

    this.images = [];
  }
}
