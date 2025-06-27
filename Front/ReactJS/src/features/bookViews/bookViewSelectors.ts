import { createSelector } from '@reduxjs/toolkit';

import { selectAllBooks } from '../books/bookSelectors';
import { selectAllAuthors } from '../authors/authorSelector';
import { selectAllCategories } from '../categories/categoriesSelector';
import { selectAllPublishers } from '../publishers/publisherSelector';
// import { selectAllTags } from '../tags/tagSelectors';
import { selectAllImages } from '../images/imageSelectors';
// import { selectAllLanguages } from '../languages/languageSelectors';
// import { selectAllBookTranslations } from '../bookTranslations/bookTranslationSelectors';

import { BookModelView } from '@/models/bookViews/BookModelView';
import { Book } from '@/models/book/Book';

export const selectBookModelViews = createSelector(
  [
    selectAllBooks,
    selectAllAuthors,
    selectAllCategories,
    selectAllPublishers,
    // selectAllTags,
    selectAllImages,
    // selectAllLanguages,
    // selectAllBookTranslations
  ],
  (
    books,
    authors,
    categories,
    publishers,
    // tags,
    images,
    // languages,
    // translations
  ): any[] => {
    return books.map((book: Book) => {
      const matchedAuthors = authors.filter((a: { authorUuid: string; }) => book.authorUuids.includes(a.authorUuid));
      const matchedCategories = categories.filter((c: { categoryUuid: string; }) => book.categoryUuids.includes(c.categoryUuid));
      const matchedPublishers = publishers.filter((p: { publisherUuid: string; }) => book.publisherUuids.includes(p.publisherUuid));
      // const matchedTags = tags.filter(t => book.tagUuids.includes(t.tagUuid));
      const matchedImages = images.filter((i: { imageUuid: string; }) => book.imageUuids.includes(i.imageUuid));
      // const matchedLanguages = languages.filter(l => book.languageUuids.includes(l.languageUuid));
      // const matchedTranslations = translations.filter(t => book.bookTranslationUuids.includes(t.bookTranslationUuid));

      const view = new BookModelView(
        book,
        matchedAuthors,
        matchedCategories,
        matchedPublishers,
        // matchedTags,
        matchedImages,
        // matchedLanguages
        // matchedTranslations
      );

      return view.toPlainObject(); // ✅ transformation en POJO
    });
  }
);