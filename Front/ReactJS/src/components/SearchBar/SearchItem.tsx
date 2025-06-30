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
import Image from 'next/image';

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
  selectHistoryItem: (item: string) => void;
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
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
    const getTitle = (result: SearchResult): string => {
    switch (result.type) {
      case 'Livre': return result.item.bookTitle;
      case 'Auteur': return result.item.authorFullName;
      case 'Éditeur': return result.item.publisherName;
      case 'Catégorie': return result.item.categoryName;
      case 'History': return result.item;
    }
  }
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
            setSearchTerm(getTitle(result));
            setHistory((prev) => [...new Set([searchTerm, ...prev])]);
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
              {getTitle(result)}
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
        <Image
          src={resultImage(result)}
          width={30}
          height={30}
          alt={`Résultat ${index}`}
        />
      </ResultItem>
    ))}
    {/* New Section Styled as Row and Clickable */}
    <ResultsFooter onClick={() => goToSearch(0)}>
      <span role="img" aria-label="search">🔍</span>
      <h3>Tous les résultats pour &quot;{searchTerm}&quot;</h3>
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
