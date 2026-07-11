import { createSelector } from '@reduxjs/toolkit';

import { selectAllBooks } from '../books/bookSelectors';
import { selectAllAuthors } from '../authors/authorSelector';
import { selectAllCategories } from '../categories/categoriesSelector';
import { selectAllPublishers } from '../publishers/publisherSelector';
// import { selectAllTags } from '../tags/tagSelectors';
import { selectAllImages } from '../images/imageSelectors';
// import { selectAllLanguages } from '../languages/languageSelectors';
// import { selectAllBookTranslations } from '../bookTranslations/bookTranslationSelectors';

import { BookModelView, BookModelViewObject } from '@/models/bookViews/BookModelView';
import { Book } from '@/models/book/Book';

export const selectBookModelViews = createSelector(
  [
    selectAllBooks,
    selectAllAuthors,
    selectAllCategories,
    selectAllPublishers,
    selectAllImages,
  ],
  (
    books,
    authors,
    categories,
    publishers,
    images,
  ): BookModelViewObject[] => {
    return books.map((book: Book) => {
      const matchedAuthors = authors.filter(a => book.authorUuids.includes(a.authorUuid));
      const matchedCategories = categories.filter(c => book.categoryUuids.includes(c.categoryUuid));
      const matchedPublishers = publishers.filter(p => book.publisherUuids.includes(p.publisherUuid));
      const matchedImages = images.filter(i => book.imageUuids.includes(i.imageUuid));

      const view = new BookModelView(
        book,
        matchedAuthors,
        matchedCategories,
        matchedPublishers,
        matchedImages
      );

      return view.toPlainObject();
    });
  }
);
