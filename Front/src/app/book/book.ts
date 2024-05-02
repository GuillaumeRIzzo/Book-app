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

    constructor(
        bookId: number,
        bookTitle: string,
        bookDescription: string,
        bookPublishDate: Date,
        bookPageCount: number,
        bookAverageRating: number,
        bookRatingCount: number,
        bookImageLink: string,
        bookLanguage: string,
        publisherId: number,
        authorId: number,
        read: boolean,
        inList: boolean
    ) {
        this.bookId = bookId
        this.bookTitle = bookTitle
        this.bookDescription = bookDescription
        this.bookPublishDate = bookPublishDate
        this.bookPageCount = bookPageCount
        this.bookAverageRating = bookAverageRating
        this.bookRatingCount = bookRatingCount
        this.bookImageLink = bookImageLink
        this.bookLanguage = bookLanguage
        this.publisherId = publisherId
        this.authorId = authorId
        this.read = read
        this.inList = inList
    }
}