import { Author } from "../author/author";
import { Book } from "../book/Book";
import { Category } from "../category/Category";
import { Publisher } from "../publisher/publisher";
import { Tag } from "../tag/tag";
import { BookImage } from "../bookImages/bookImages";
import { Language } from "../language/language";

export class BookModelView {
  constructor(
    public book: Book,
    public authors: Author[],
    public categories: Category[],
    public publishers: Publisher[],
    public tags: Tag[],
    public bookImage: BookImage[],
    public languages: Language[],
  ) {}
  toPlainObject() {
    return {
      book: this.book,
      authors: this.authors,
      categories: this.categories,
      publishers: this.publishers,
      bookImage: this.bookImage,
      tags: this.tags,
      languages: this.languages,
    };
  }
}

export type BookModelViewObject = ReturnType<BookModelView['toPlainObject']>;