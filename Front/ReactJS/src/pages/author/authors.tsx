import { withNoSSR } from '@/components/common/withNoSSR';
import AuthorList from '@/features/authors/AuthorList';

const Authors: React.FC = () => {
  return <AuthorList />;
};

export default withNoSSR(Authors);