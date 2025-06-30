import { withNoSSR } from '@/components/common/withNoSSR';
import AuthorDetails from '@/features/authors/AuthorDetails';

const AuthorDetailsPage: React.FC = () => {
  return <AuthorDetails />;
};

export default withNoSSR(AuthorDetailsPage);
