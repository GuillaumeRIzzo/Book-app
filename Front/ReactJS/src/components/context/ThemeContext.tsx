import { selectPreference } from '@/features/preferences/preferenceSelector';
import { selectAllThemes } from '@/features/themes/themeSelector';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useSelector } from 'react-redux';

export interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  applyTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  isSystem: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userTheme = useSelector(selectPreference);
  const themes = useSelector(selectAllThemes);

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSystem, setIsSystem] = useState(false);

  // Apply current theme to <html> class
  const applyTheme = useCallback((newTheme: 'light' | 'dark') => {
    document.documentElement.className =
      newTheme === 'dark' ? 'theme-dark' : 'theme-light';
    setTheme(newTheme);
  }, []);

  // On mount or preference change, determine user theme
  useEffect(() => {
    if (userTheme && themes.length > 0) {
      const selectedThemeUuid = userTheme.themeUuid;

      const themeObj = themes.find(t => t.themeUuid === selectedThemeUuid);

      if (themeObj?.themeName === 'System') {
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)',
        ).matches;

        setIsSystem(true);
        applyTheme(prefersDark ? 'dark' : 'light');
      } else {
        setIsSystem(false);

        applyTheme(
          themeObj?.themeName.toLowerCase() === 'dark' ? 'dark' : 'light',
        );
      }
    }
  }, [userTheme, themes, applyTheme]);

  // (Optional) Listen to OS theme change if system mode is enabled
  useEffect(() => {
    if (!isSystem) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => {
      applyTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [isSystem, applyTheme]);

  const toggleTheme = () => {
    applyTheme(theme === 'light' ? 'dark' : 'light');
    setIsSystem(false); // manually toggled, no longer "system"
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, toggleTheme, applyTheme, isSystem }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
