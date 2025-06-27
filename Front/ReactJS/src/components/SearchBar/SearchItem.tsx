import { Box } from '@mui/material';
import { TrashIcon } from '@heroicons/react/24/solid';

import { SearchResult } from './SearchBar';

import {
  SearchContainer,
  SearchIconButton,
  SearchInput,
  CloseButton,
  Overlay,
  ResultItem,
  DeleteButton,
  NoResults,
  ResultsFooter
} from './StyledComponents';

interface SearchItemProps {
  isOpen: boolean;
  searchBarRef: React.MutableRefObject<HTMLDivElement | null>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  searchTerm: string;
  combinedResults: SearchResult[];
  overlayRef: React.MutableRefObject<HTMLDivElement | null>;
  selectedIndex: number | null;
  setSearchTerm: (term: string) => void;
  handleSearch: (term: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  clearSearch: () => void;
  toggleSearch: () => void;
  deleteRecentSearches: (index: number) => void;
  resultImage: (result: SearchResult) => string;
  goToSearch: (index: number) => void;
  selectHistoryItem: (item: any) => void;
  setHistory: (item: any) => void;
}

const SearchItem: React.FC<SearchItemProps> = ({
  isOpen,
  searchBarRef,
  inputRef,
  searchTerm,
  combinedResults,
  overlayRef,
  selectedIndex,
  setSearchTerm,
  handleSearch,
  handleKeyDown,
  clearSearch,
  toggleSearch,
  deleteRecentSearches,
  resultImage,
  goToSearch,
  selectHistoryItem,
  setHistory
}) => {
  return (
    <Box>
      <SearchContainer $isOpen={isOpen} ref={searchBarRef}>
        <SearchIconButton onClick={toggleSearch}>
          <span role='img' aria-label='search' className='text-primary-dark'>
            🔍 {!isOpen && ' : ctrl + k'}
          </span>
        </SearchIconButton>
        {isOpen && (
          <>
            <SearchInput
              ref={inputRef}
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              autoFocus={true}
              placeholder='Recherche : livres / auteurs / catégories / éditeurs'
              className='text-primary-dark'
            />
            <CloseButton
              onClick={() => {
                clearSearch();
                toggleSearch();
              }}
            >
              <span role='img' aria-label='close'>
                ❌
              </span>
            </CloseButton>
          </>
        )}
      </SearchContainer>
      {isOpen && (
        <Overlay ref={overlayRef}>
          {combinedResults.length > 0 ? (
  <>
    {combinedResults.map((result, index) => (
      <ResultItem
        key={index}
        $isSelected={index === selectedIndex}
        onClick={() => {
          if (result.type === 'History') {
            selectHistoryItem(result.item);
            handleSearch(result.item);
          } else {
            setSearchTerm(
              result.item.bookTitle ||
                result.item.authorFullName ||
                result.item.publisherName ||
                result.item.categoryName,
            );
            setHistory((prev: any) => [...new Set([searchTerm, ...prev])]);
            goToSearch(index);
          }
        }}
      >
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box display='flex'>
            <p className='mr-2 text-primary-dark'>
              <strong>{result.type}:</strong>
            </p>
            {result.type === 'History' ? (
              <p className='w-96 text-primary-dark'>{result.item}</p>
            ) : (
              <p className='text-primary-dark'>
              {result.item.bookTitle ||
              result.item.authorFullName ||
              result.item.publisherName ||
              result.item.categoryName}
              </p>
            )}
          </Box>
          {result.type === 'History' && (
            <DeleteButton
              onClick={e => {
                e.stopPropagation(); // Prevent bubbling to ResultItem's click handler
                deleteRecentSearches(index);
              }}
            >
              <TrashIcon className='block h-6 w-6' />
            </DeleteButton>
          )}
        </Box>
        <img src={resultImage(result)} width={30} />
      </ResultItem>
    ))}
    {/* New Section Styled as Row and Clickable */}
    <ResultsFooter onClick={() => goToSearch(0)}>
      <span role="img" aria-label="search">🔍</span>
      <h3>Tous les résultats pour "{searchTerm}"</h3>
      <span className='text-primary-dark'>Cliquez <strong>ici</strong> ou <br />appuyez sur <strong>ENTRER</strong> <br /> pour voir plus de détails.</span>
    </ResultsFooter>
  </>
) : (
  <NoResults>No results found</NoResults>
)}
        </Overlay>
      )}
    </Box>
  );
};

export default SearchItem;
