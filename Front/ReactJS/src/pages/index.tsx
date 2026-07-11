import { withNoSSR } from '@/components/common/withNoSSR';
import BookList from '@/features/books/BookList';

const books: React.FC = () => {
  return <BookList />;
};

export default withNoSSR(books);