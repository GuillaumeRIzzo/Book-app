import styled from 'styled-components';
import tw from 'twin.macro';

const BookImageWrapper = styled.div`
  ${tw`w-full md:w-1/3`}
  img {
    ${tw`w-full h-auto object-cover`}
  }
`;

type BookImageProps = {
  src: string;
  alt: string;
};

const BookImage: React.FC<BookImageProps> = ({ src, alt }) => {
  return (
    <BookImageWrapper>
      <img src={src} alt={alt} />
    </BookImageWrapper>
  );
};

export default BookImage;
