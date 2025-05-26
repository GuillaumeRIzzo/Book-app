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
  ): BookModelView[] => {
    return books.map(book => {
      const matchedAuthors = authors.filter(a => book.authorUuids.includes(a.authorUuid));
      const matchedCategories = categories.filter(c => book.categoryUuids.includes(c.categoryUuid));
      const matchedPublishers = publishers.filter(p => book.publisherUuids.includes(p.publisherUuid));
      // const matchedTags = tags.filter(t => book.tagUuids.includes(t.tagUuid));
      const matchedImages = images.filter(i => book.imageUuid.includes(i.imageUuid));
      // const matchedLanguages = languages.filter(l => book.languageUuids.includes(l.languageUuid));
      // const matchedTranslations = translations.filter(t => book.bookTranslationUuids.includes(t.bookTranslationUuid));

      return new BookModelView(
        book,
        matchedAuthors,
        matchedCategories,
        matchedPublishers,
        // matchedTags,
        matchedImages,
        // matchedLanguages,
        // matchedTranslations
      );
    });
  }
);
