import { FC } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { useTheme } from '@/components/context/ThemeContext';

const Header: FC = () => {

  // const ThemeToggleButton = () => {
  //   const { theme, toggleTheme } = useTheme();
  //   return (
  //     <button onClick={toggleTheme} className="m-4 p-2 border rounded">
  //       Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
  //     </button>
  //   );
  // };
  
  return (
    <nav>
      <Link to="/">Accueil </Link>
      <Link to="/about">À propos</Link>
      {/* <ThemeToggleButton /> */}
      <Outlet />
    </nav>
  );
};

export default Header;