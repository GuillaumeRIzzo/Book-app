import store from '@/redux/store';
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Styled Components
const openSearchAnimation = keyframes`
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 28vw;
    opacity: 1;
  }
`;

const closeSearchAnimation = keyframes`
  from {
    width: 28vw;
    opacity: 1;
  }
  to {
    width: 0;
    opacity: 0;
  }
`;

const SearchContainer = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  background: #eaf1fb;
  border-radius: 32px;
  padding: 8px 16px;
  position: relative;
  width: ${(props) => (props.$isOpen ? '28vw' : 'auto')};
  animation: ${(props) =>
      props.$isOpen ? openSearchAnimation : closeSearchAnimation}
    0.3s ease-in-out;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-size: 1rem;
  background: inherit;
  padding: 8px;
`;

const SearchIconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;

  svg {
    font-size: 1.5rem;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 100%;
  width: 43%;
  background: white;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const ResultItem = styled.div<{ $isSelected: boolean }>`
  padding: 8px 16px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  background: ${(props) => (props.$isSelected ? '#dbeafe' : 'white')};

  &:hover {
    background: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 16px;

  svg {
    font-size: 1.2rem;
  }
`;

const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  color: #aaa;
`;

interface SearchResult {
  type: string;
  item: any;
}

const SearchBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]); // Search history state
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSearch = (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    const lowerCaseTerm = term.toLowerCase();

    const books = store.getState().books.books;
    const authors = store.getState().authors.authors;
    const publishers = store.getState().publishers.publishers;
    const bookCategories = store.getState().bookCategories.bookCategories;

    const filteredBooks = books.filter((book: { bookTitle: string }) =>
      book.bookTitle.toLowerCase().includes(lowerCaseTerm)
    );
    const filteredAuthors = authors.filter((author: { authorName: string }) =>
      author.authorName.toLowerCase().includes(lowerCaseTerm)
    );
    const filteredPublishers = publishers.filter(
      (publisher: { publisherName: string }) =>
        publisher.publisherName.toLowerCase().includes(lowerCaseTerm)
    );
    const filteredCategories = bookCategories.filter(
      (category: { bookCategoName: string }) =>
        category.bookCategoName.toLowerCase().includes(lowerCaseTerm)
    );

    setResults([
      ...filteredBooks.map((b) => ({ type: 'Book', item: b })),
      ...filteredAuthors.map((a) => ({ type: 'Author', item: a })),
      ...filteredPublishers.map((p) => ({ type: 'Publisher', item: p })),
      ...filteredCategories.map((c) => ({ type: 'Category', item: c })),
    ]);
    setSelectedIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' && results.length > 0) {
      setSelectedIndex((prev) =>
        prev === null ? 0 : Math.min(prev + 1, results.length - 1)
      );
    } else if (e.key === 'ArrowUp' && results.length > 0) {
      setSelectedIndex((prev) =>
        prev === null ? results.length - 1 : Math.max(prev - 1, 0)
      );
    } else if (e.key === 'Enter' && selectedIndex !== null) {
      const selected = results[selectedIndex];
      setSearchTerm(
        selected.item.bookTitle ||
          selected.item.authorName ||
          selected.item.publisherName ||
          selected.item.bookCategoName
      );
      setHistory((prev) => [...new Set([searchTerm, ...prev])]);
      setResults([]);
    } else if (e.key === 'Escape') {
      toggleSearch();
    }
  };

  const toggleSearch = () => {
    setIsOpen((prev) => !prev);
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

  useEffect(() => {
    if (isOpen) {
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsOpen(false);
        }
      };
      window.addEventListener('keydown', handleGlobalKeyDown);
      return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }
    if (!isOpen) {
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'k') {
          e.preventDefault();
          setIsOpen(true);
        }
      };
      window.addEventListener('keydown', handleGlobalKeyDown);
      return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }
  }, [isOpen]);

  return (
    <div>
      <SearchContainer $isOpen={isOpen}>
        <SearchIconButton onClick={toggleSearch}>
          <span role="img" aria-label="search">
            🔍 {!isOpen && " : ctrl + k"}
          </span>
        </SearchIconButton>
        {isOpen && (
          <>
            <SearchInput
              ref={inputRef}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              autoFocus={true}
              placeholder="Search books, authors, categories..."
            />
            <CloseButton onClick={toggleSearch}>
              <span role="img" aria-label="close">
                ❌
              </span>
            </CloseButton>
          </>
        )}
      </SearchContainer>
      {isOpen && (
        <Overlay>
          {history.length > 0 && (
            <>
              <div style={{ padding: '8px 16px', fontWeight: 'bold' }}>Search History</div>
              {history.map((item, index) => (
                <ResultItem
                  key={index}
                  $isSelected={false}
                  onClick={() => selectHistoryItem(item)}
                >
                  <strong>History:</strong> {item}
                </ResultItem>
              ))}
            </>
          )}
          {searchTerm && (
          results.length ? (
            results.map((result, index) => (
              <ResultItem
                key={index}
                $isSelected={index === selectedIndex}
                onClick={() =>
                  setSearchTerm(
                    result.item.bookTitle ||
                      result.item.authorName ||
                      result.item.publisherName ||
                      result.item.bookCategoName
                  )
                }
              >
                <strong>{result.type}:</strong> {result.item.bookTitle || result.item.authorName || result.item.publisherName || result.item.bookCategoName}
              </ResultItem>
            ))
          ) : (
            <NoResults>No results found</NoResults>
          ))}
        </Overlay>
      )}
    </div>
  );
};

export default SearchBar;
