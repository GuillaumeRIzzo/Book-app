import { useRouter } from 'next/router';
import React, { useState, useRef, useEffect } from 'react';

import store from '@/redux/store';
import SearchItem from './SearchItem';

export type SearchResult =
  | { type: 'History'; item: string }
  | { type: 'Livre'; item: { bookTitle: string; bookId: number; } }
  | { type: 'Auteur'; item: { authorFullName: string; authorId: number } }
  | { type: 'Éditeur'; item: { publisherName: string; publisherId: number } }
  | { type: 'Catégorie'; item: { categoryName: string; categoryId: number } };


const SearchBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const combinedResults: SearchResult[] = [
    ...history.map(item => ({ type: 'History' as const, item })),
    ...results,
  ];

  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchBarRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  const handleSearch = (term: string) => {
    if (!term.trim() || term.trim().length < 2) {
      setResults([]);
      return;
    }

    const lowerCaseTerm = term.toLowerCase();

    const books = store.getState().books.books;
    const authors = store.getState().authors.authors;
    const publishers = store.getState().publishers.publishers;
    const Categories = store.getState().categories.categories;

    const filteredBooks = books.filter((book: { bookTitle: string }) =>
      book.bookTitle.toLowerCase().includes(lowerCaseTerm),
    );
    const filteredAuthors = authors.filter((author: { authorFullName: string }) =>
      author.authorFullName.toLowerCase().includes(lowerCaseTerm),
    );
    const filteredPublishers = publishers.filter(
      (publisher: { publisherName: string }) =>
        publisher.publisherName.toLowerCase().includes(lowerCaseTerm),
    );
    const filteredCategories = Categories.filter(
      (category: { categoryName: string }) =>
        category.categoryName.toLowerCase().includes(lowerCaseTerm),
    );

    setResults([
      ...filteredBooks.map(b => ({ type: 'Livre' as const, item: b })),
      ...filteredAuthors.map(a => ({ type: 'Auteur' as const, item: a })),
      ...filteredPublishers.map(p => ({ type: 'Éditeur' as const, item: p })),
      ...filteredCategories.map(c => ({ type: 'Catégorie' as const, item: c })),
    ]);

    setSelectedIndex(null);
  };

  const getTitle = (result: SearchResult): string => {
  switch (result.type) {
    case 'Livre': return result.item.bookTitle;
    case 'Auteur': return result.item.authorFullName;
    case 'Éditeur': return result.item.publisherName;
    case 'Catégorie': return result.item.categoryName;
    case 'History': return result.item;
  }
}

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' && combinedResults.length > 0) {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev === null ? 0 : Math.min(prev + 1, combinedResults.length - 1),
      );
    } else if (e.key === 'ArrowUp' && combinedResults.length > 0) {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev === null ? combinedResults.length - 1 : Math.max(prev - 1, 0),
      );
    } else if (e.key === 'Enter') {
      // Redirect to first result if no item is selected
      if (selectedIndex !== null) {
        // If an item is selected, redirect
        const selected = combinedResults[selectedIndex];
        if (selected) {
          if (selected.type === 'History') {
            setSearchTerm(selected.item);
            handleSearch(selected.item);
          } else {
            setSearchTerm(getTitle(selected));
          }
          goToSearch(selectedIndex);
        }
      } else if (results.length > 0) {
        // If no item is selected but there are results, redirect to the first result
        goToSearch(0);
      } else {
        console.log('No results to navigate to.');
      }
      if (searchTerm) {
        setHistory(prev => [...new Set([searchTerm, ...prev])]);
      }
    } else if (e.key === 'Escape') {
      toggleSearch();
    } else if (e.key === 'Delete' && selectedIndex !== null) {
      deleteRecentSearches(selectedIndex);
    }
  };

  const deleteRecentSearches = (index?: number) => {
    if (index !== undefined) {
      const selected = combinedResults[index];

      if (selected.type === 'History') {
        const updatedHistory = history.filter(item => item !== selected.item);
        setHistory(updatedHistory);
        clearSearch();
      }
    }
  };

  const goToSearch = (index: number) => {
    const selected = index == 0 ? results[index] : combinedResults[index];
    if (!selected) return;

    switch (selected.type) {
      case 'Livre':
        router.push(`/book/${selected.item.bookId}`);
        break;
      case 'Auteur':
        router.push(`/author/${selected.item.authorId}`);
        break;
      case 'Éditeur':
        router.push(`/publisher/${selected.item.publisherId}`);
        break;
      case 'Catégorie':
        router.push(`/category/${selected.item.categoryId}`);
        break;
      default:
        console.warn('Unknown type, cannot navigate');
        break;
    }
  };

  const toggleSearch = () => {
    setIsOpen(prev => !prev);
    if (!isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setSelectedIndex(null);
  };

  const selectHistoryItem = (historyItem: string) => {
    setSearchTerm(historyItem);
    setResults([]);
  };

const resultImage = (result: SearchResult) => {
  switch (result.type) {
    case 'Livre':
      return '/default-book-image.png'; // image générique ou selon un autre mécanisme
    case 'Auteur':
    case 'Éditeur':
    case 'Catégorie':
      return 'https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg';
    default:
      return '';
  }
};

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBarRef.current &&
      overlayRef.current &&
      !searchBarRef.current.contains(event.target as Node) &&
      !overlayRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleGlobalKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    if (!isOpen) {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <SearchItem
      isOpen={isOpen}
      searchBarRef={searchBarRef}
      inputRef={inputRef}
      searchTerm={searchTerm}
      combinedResults={combinedResults}
      overlayRef={overlayRef}
      selectedIndex={selectedIndex}
      setSearchTerm={term => setSearchTerm(term)}
      handleSearch={term => handleSearch(term)}
      deleteRecentSearches={index => deleteRecentSearches(index)}
      resultImage={result => resultImage(result)}
      handleKeyDown={e => handleKeyDown(e)}
      clearSearch={() => clearSearch()}
      toggleSearch={() => toggleSearch()}
      goToSearch={(index) => goToSearch(index)}
      selectHistoryItem={(item) => selectHistoryItem(item)}
      setHistory={(item) => setHistory(item)}
    />
  );
};

export default SearchBar;
