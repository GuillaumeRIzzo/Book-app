import { withNoSSR } from '@/components/common/withNoSSR';
import BookDetails from '@/features/books/BookDetails/BookDetails';

const BookDetailsPage: React.FC = () => {
  return <BookDetails />;
};

export default withNoSSR(BookDetailsPage);
