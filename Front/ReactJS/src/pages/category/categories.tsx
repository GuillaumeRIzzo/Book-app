import { withNoSSR } from '@/components/common/withNoSSR';
import CategoryList from '@/features/categories/CategoriesList';

const Publishers: React.FC = () => {
  return <CategoryList />;
};

export default withNoSSR(Publishers);