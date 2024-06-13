import { FC } from "react";
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { RootState } from '@redux/store';
import { Book } from '@/models/book/Book';

const BookDetails: FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const book = useSelector((state: RootState) => 
    state.books.books.find((b: Book) => b.bookId === Number(id))
  );

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <img src={book.bookImageLink} alt={book.bookTitle} />
      <h1>{book.bookTitle}</h1>
      <p>{book.bookDescription}</p>
    </div>
  )  
}


export default BookDetails;