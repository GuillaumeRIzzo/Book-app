import { createSelector } from '@reduxjs/toolkit';

import { selectAllBooks } from '../books/bookSelectors';
import { selectAllAuthors } from '../authors/authorSelector';
import { selectAllCategories } from '../categories/categoriesSelector';
import { selectAllPublishers } from '../publishers/publisherSelector';
import { selectAllTags } from '../tags/tagSelector';
import { selectAllLanguages } from '../languages/languageSelector';

import { BookModelView, BookModelViewObject } from '@/models/bookViews/BookModelView';
import { Book } from '@/models/book/Book';
import { Author } from '@/models/author/author';
import { Category } from '@/models/category/Category';
import { Publisher } from '@/models/publisher/publisher';
import { Tag } from '@/models/tag/tag';
import { Language } from '@/models/language/language';
import { BookImage } from '@/models/bookImages/bookImages';
import { selectAllBookImages } from '../bookImages/bookImageSelectors';

export const selectBookModelViews = createSelector(
  [
    selectAllBooks,
    selectAllAuthors,
    selectAllCategories,
    selectAllPublishers,
    selectAllTags,
    selectAllBookImages,
    selectAllLanguages,
  ],
  (
    books: Book[],
    authors: Author[],
    categories: Category[],
    publishers: Publisher[],
    tags: Tag[],
    bookImages: BookImage[],
    languages: Language[],
  ): BookModelViewObject[] => {

    return books.map((book: Book) => {

      const matchedAuthors = authors.filter(author =>
        book.authorUuids.includes(author.authorUuid)
      );

      const matchedCategories = categories.filter(category =>
        book.categoryUuids.includes(category.categoryUuid)
      );

      const matchedPublishers = publishers.filter(publisher =>
        book.publisherUuids.includes(publisher.publisherUuid)
      );

      const matchedTags = tags.filter(tag =>
        book.tagUuids.includes(tag.tagUuid)
      );

      const matchedLanguages = languages.filter(language =>
        book.languageUuids.includes(language.languageUuid)
      );
      const matchedImages = bookImages.filter(
        i => i.bookUuid === book.bookUuid
      );

      const view = new BookModelView(
        book,
        matchedAuthors,
        matchedCategories,
        matchedPublishers,
        matchedTags,
        matchedImages,
        matchedLanguages
      );

      return view.toPlainObject();
    });
  }
);
