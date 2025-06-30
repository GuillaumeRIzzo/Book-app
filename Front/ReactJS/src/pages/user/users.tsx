import { withNoSSR } from '@/components/common/withNoSSR';
import UserList from '@/features/users/UserList';

const Users: React.FC = () => {
  return <UserList />;
};

export default withNoSSR(Users);