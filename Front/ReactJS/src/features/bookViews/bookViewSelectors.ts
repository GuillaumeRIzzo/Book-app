import { createSelector } from '@reduxjs/toolkit';

import { selectAllBooks } from '../books/bookSelectors';
import { selectAllAuthors } from '../authors/authorSelector';
import { selectAllCategories } from '../categories/categoriesSelector';
import { selectAllPublishers } from '../publishers/publisherSelector';
import { selectAllTags } from '../tags/tagSelector';
// import { selectAllLanguages } from '../languages/languageSelectors';

import { BookModelView, BookModelViewObject } from '@/models/bookViews/BookModelView';
import { Book } from '@/models/book/Book';

export const selectBookModelViews = createSelector(
  [
    selectAllBooks,
    selectAllAuthors,
    selectAllCategories,
    selectAllPublishers,
    selectAllTags,
  ],
  (
    books,
    authors,
    categories,
    publishers,
    tags,
  ): BookModelViewObject[] => {
    return books.map((book: Book) => {
      const matchedAuthors = authors.filter((a: { authorUuid: string; }) => book.authorUuids.includes(a.authorUuid));
      const matchedCategories = categories.filter((c: { categoryUuid: string; }) => book.categoryUuids.includes(c.categoryUuid));
      const matchedPublishers = publishers.filter((p: { publisherUuid: string; }) => book.publisherUuids.includes(p.publisherUuid));
      const matchedTags = tags.filter((t: { tagUuid: string; }) => book.tagUuids.includes(t.tagUuid));

      const view = new BookModelView(
        book,
        matchedAuthors,
        matchedCategories,
        matchedPublishers,
        matchedTags
      );

      return view.toPlainObject();
    });
  }
);
