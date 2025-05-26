import { Author } from "../author/author";
import { Book } from "../book/Book";
import { Category } from "../category/Category";
import { Publisher } from "../publisher/publisher";
// import { Tag } from "../tag/tag";
import { Image } from "../images/images";
// import { Language } from "../language/language";
// import { BookTranslation } from "../bookTranslation/bookTranslation";

export class BookModelView {
  book: Book;
  authors: Author[];
  categories: Category[];
  publishers: Publisher[];
  // tags: Tag[];
  images: Image[];
  // languages: Language[];
  // translations: BookTranslation[];

  constructor(
    book: Book,
    authors: Author[],
    categories: Category[],
    publishers: Publisher[],
    // tags: Tag[],
    images: Image[],
    // languages: Language[],
    // translations: BookTranslation[]
  ) {
    this.book = book;
    this.authors = authors;
    this.categories = categories;
    this.publishers = publishers;
    // this.tags = tags;
    this.images = images;
    // this.languages = languages;
    // this.translations = translations;
  }
}
