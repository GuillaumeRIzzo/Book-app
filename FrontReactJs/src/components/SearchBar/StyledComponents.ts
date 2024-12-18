import styled, { keyframes } from 'styled-components';

// Styled Components
export const openSearchAnimation = keyframes`
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 28vw;
    opacity: 1;
  }
`;

export const closeSearchAnimation = keyframes`
  from {
    width: 28vw;
    opacity: 1;
  }
  to {
    width: 0;
    opacity: 0;
  }
`;

export const SearchContainer = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  background: #eaf1fb;
  border-radius: ${props => (props.$isOpen ? '32px 32px 0px 0px' : '32px')};
  padding: 8px 16px;
  position: relative;
  width: ${props => (props.$isOpen ? '28vw' : 'auto')};
  animation: ${props =>
      props.$isOpen ? openSearchAnimation : closeSearchAnimation}
    0.3s ease-in-out;
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-size: 1rem;
  background: inherit;
  padding: 8px;
`;

export const SearchIconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;

  svg {
    font-size: 1.5rem;
  }
`;

export const Overlay = styled.div`
  position: absolute;
  top: 100%;
  width: 44.3%;
  background: white;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;


export const ResultItem = styled.div<{ $isSelected: boolean }>`
  padding: 8px 16px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  background: ${props => (props.$isSelected ? '#dbeafe' : 'white')};

  &:hover {
    background: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  // Style adjustments for hover
  &:hover {
    transition: color 0.2s ease;
  }

  svg {
    font-size: 1.2rem;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 16px;

  svg {
    font-size: 1.2rem;
  }
`;

export const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  color: #aaa;
`;