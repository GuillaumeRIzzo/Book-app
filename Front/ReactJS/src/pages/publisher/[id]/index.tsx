import { withNoSSR } from '@/components/common/withNoSSR';
import PublisherDetails from '@/features/publishers/PublisherDetails';

const PublisherDetailsPage: React.FC = () => {
  return <PublisherDetails />;
};

export default withNoSSR(PublisherDetailsPage);
