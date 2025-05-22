// book-filter.service.ts
import { Injectable } from '@angular/core';
import { Book } from './book';

type BookFilterCriteria = Partial<{
  bookTitle: string;
  bookDescription: string;
  bookLanguage: string;
  categories: string;
  read: boolean;
  inList: boolean;
  authorId: number;
  publisherId: number;
}>;

@Injectable({
  providedIn: 'root'
})
export class BookFilterService {

  filterBooks(books: Book[], filterCriteria: BookFilterCriteria): Book[] {
    const filteredBooks = books.filter(book => {
      return Object.keys(filterCriteria).every(key => {
        if (!filterCriteria[key as keyof BookFilterCriteria]) {
          return true;
        }

        const value = filterCriteria[key as keyof BookFilterCriteria];
        switch (key) {
          case 'categories':
            return book.categories.some(category => category.bookCategoName === value);
          case 'read':
          case 'inList':
            return book[key as 'read' | 'inList'] === value;
          case 'authorId':
          case 'publisherId':
            return book[key as 'authorId' | 'publisherId'] === value;
          default:
            const bookValue = book[key as keyof Book];
            if (typeof bookValue === 'string') {
              return (bookValue as string).toLowerCase().includes((value as string).toLowerCase());
            }
            return bookValue === value;
        }
      });
    });

    return this.sortBooksByTitle(filteredBooks);
  }

  groupBooks(books: Book[], groupBy: keyof Book): { [key: string]: Book[] } {
    const groupedBooks = books.reduce((groups, book) => {
      const key = book[groupBy];
      const groupKey = String(key); // Convert key to string to use as index
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(book);
      return groups;
    }, {} as { [key: string]: Book[] });

    // Sort each group by title
    Object.keys(groupedBooks).forEach(groupKey => {
      groupedBooks[groupKey] = this.sortBooksByTitle(groupedBooks[groupKey]);
    });

    return groupedBooks;
  }

  sortBooksByTitle(books: Book[]): Book[] {
    return books.sort((a, b) => a.bookTitle.localeCompare(b.bookTitle));
  }
}
