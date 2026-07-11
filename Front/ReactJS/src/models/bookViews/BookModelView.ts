import { Author } from "../author/author";
import { Book } from "../book/Book";
import { Category } from "../category/Category";
import { Publisher } from "../publisher/publisher";
// import { Tag } from "../tag/tag";
import { Image } from "../images/images";
// import { Language } from "../language/language";
// import { BookTranslation } from "../bookTranslation/bookTranslation";

export class BookModelView {
  constructor(
    public book: Book,
    public authors: Author[],
    public categories: Category[],
    public publishers: Publisher[],
    // tags: Tag[],
    public images: Image[],
    // languages: Language[],
    // translations: BookTranslation[]
  ) {
    // this.book = book;
    // this.authors = authors;
    // this.categories = categories;
    // this.publishers = publishers;
    // // this.tags = tags;
    // this.images = images;
    // // this.languages = languages;
    // // this.translations = translations;
  }
  toPlainObject() {
    return {
      book: this.book,
      authors: this.authors,
      categories: this.categories,
      publishers: this.publishers,
      images: this.images
    };
  }
}

export type BookModelViewObject = ReturnType<BookModelView['toPlainObject']>;