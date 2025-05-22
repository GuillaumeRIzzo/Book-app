import { BookCategory } from "../book-category/bookCategory";

export class Book {
    bookId: number;
    bookTitle: string;
    bookDescription: string;
    bookPublishDate: Date;
    bookPageCount: number;
    bookAverageRating: number;
    bookRatingCount: number;
    bookImageLink: string;
    bookLanguage: string;
    publisherId: number;
    authorId: number;
    read: boolean;
    inList: boolean;
    categories: BookCategory[];

    constructor() {
        this.bookId = 0
        this.bookTitle = ""
        this.bookDescription = ""
        this.bookPublishDate = new Date()
        this.bookPageCount = 0
        this.bookAverageRating = 0
        this.bookRatingCount = 0
        this.bookImageLink = ""
        this.bookLanguage = ""
        this.publisherId = 0
        this.authorId = 0
        this.read = false
        this.inList = false
        this.categories = [];
    }
}