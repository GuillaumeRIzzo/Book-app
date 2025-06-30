import { withNoSSR } from '@/components/common/withNoSSR';
import PreferencesPage from '@/features/preferences/PreferencesPage';

const Preferences: React.FC = () => {
  return <PreferencesPage />;
};

export default withNoSSR(Preferences);