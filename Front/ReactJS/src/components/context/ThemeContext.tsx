import { selectAllPreferences } from '@/features/preferences/preferenceSelector';
import { selectAllThemes } from '@/features/themes/themeSelector';
import { decryptPayload } from '@/utils/encryptUtils';
import { useSession } from 'next-auth/react';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback
} from 'react';
import { useSelector } from 'react-redux';

const ThemeContext = createContext<any>(null);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const userTheme = useSelector(selectAllPreferences);
  const themes = useSelector(selectAllThemes);

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSystem, setIsSystem] = useState(false);

  const { uuid } = useMemo(() => {
    if (session?.user?.encryptedSession) {
      const { encryptedData, iv } = session.user.encryptedSession;
      try {
        const decryptedData = decryptPayload<{ uuid: string }>(encryptedData, iv);
        return { uuid: decryptedData.uuid };
      } catch (error) {
        console.error('Failed to decrypt session data:', error);
      }
    }
    return { uuid: '' };
  }, [session]);

  // Apply current theme to <html> class
  const applyTheme = useCallback((newTheme: 'light' | 'dark') => {
    document.documentElement.className = newTheme === 'dark' ? 'theme-dark' : 'theme-light';
    setTheme(newTheme);
  }, []);

  // On mount or preference change, determine user theme
  useEffect(() => {
    if (userTheme && uuid && themes.length > 0) {
      const selectedThemeUuid = userTheme.find(
        (t: { userUuid: string }) => t.userUuid === uuid,
      )?.themeUuid;
      const themeObj = themes.find(
        (t: { themeUuid: string }) => t.themeUuid === selectedThemeUuid,
      );

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
  }, [userTheme, uuid, themes, applyTheme]);

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
    <ThemeContext.Provider value={{ theme, toggleTheme, applyTheme, isSystem }}>
      {children}
    </ThemeContext.Provider>
  );
};
