import { withNoSSR } from '@/components/common/withNoSSR';
import PublisherList from '@/features/publishers/PublisherList';

const Publishers: React.FC = () => {
  return <PublisherList />;
};

export default withNoSSR(Publishers);