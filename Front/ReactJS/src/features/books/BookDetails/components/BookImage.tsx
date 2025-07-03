import styled from 'styled-components';
import tw from 'twin.macro';
import Image from 'next/image';

import { BookImage as ImageModel } from '@/models/bookImages/bookImages';
import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const BookImageWrapper = styled.div`
  ${tw`w-full md:w-1/4`}
  img {
    ${tw`w-full h-auto object-cover`}
  }
`;

type BookImageProps = {
  images: ImageModel[];
};

const BookImage: React.FC<BookImageProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <BookImageWrapper>
      <Box className='w-full md:w-1/2 mx-auto flex flex-col items-center gap-4'>
        {/* Main Image */}
        <Box className='relative w-full h-[300px]'>
          <Image
            src={images[currentIndex].imageUrl}
            alt={images[currentIndex].imageAlt || `Book image ${currentIndex + 1}`}
            className='object-cover rounded-xl shadow-lg'
            fill
          />
          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrev}
                className='!absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow'
                aria-label='Previous image'
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={handleNext}
                className='!absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow'
                aria-label='Next image'
              >
                <ChevronRight />
              </IconButton>
            </>
          )}
        </Box>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <Box className='flex overflow-x-auto gap-2 w-full py-2 px-1'>
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`border-2 rounded-md overflow-hidden flex-shrink-0 w-20 h-20 ${
                  index === currentIndex
                    ? 'border-blue-500'
                    : 'border-transparent'
                }`}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.imageAlt || `Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className='object-cover w-full h-full'
                />
              </button>
            ))}
          </Box>
        )}
      </Box>
    </BookImageWrapper>
  );
};

export default BookImage;
