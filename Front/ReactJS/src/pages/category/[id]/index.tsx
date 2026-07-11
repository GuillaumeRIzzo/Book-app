import { withNoSSR } from '@/components/common/withNoSSR';
import CategoryDetails from '@/features/categories/CategoryDetails';

const CategoryDetailsPage: React.FC = () => {
  return <CategoryDetails />;
};

export default withNoSSR(CategoryDetailsPage);
