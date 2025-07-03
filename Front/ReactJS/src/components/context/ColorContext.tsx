// ColorContext.tsx or ThemeContext.tsx
import { createContext, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectPreference } from '@/features/preferences/preferenceSelector';
import { selectAllColors } from '@/features/colors/colorSelector';
import generateColorVariants from '@/utils/colorUtils';

const ColorContext = createContext({ refreshColors: () => {} });

export const ColorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const preferences = useSelector(selectPreference);
  const colors = useSelector(selectAllColors);

  const userPref = preferences;

  const applyColors = (primaryHex: string, secondaryHex: string) => {
    const primaryVariants = generateColorVariants(primaryHex);
    const secondaryVariants = generateColorVariants(secondaryHex);

    for (const [key, value] of Object.entries(primaryVariants)) {
      document.documentElement.style.setProperty(
        `--color-primary-${key}`,
        value,
      );
    }
    for (const [key, value] of Object.entries(secondaryVariants)) {
      document.documentElement.style.setProperty(
        `--color-secondary-${key}`,
        value,
      );
    }
  };

  // 🔄 This gets called on first render or when Redux changes
  useEffect(() => {
    if (!userPref) return;

    const primaryColor = colors.find(
      c => c.colorUuid === userPref.primaryColorUuid,
    );
    const secondaryColor = colors.find(
      c => c.colorUuid === userPref.secondaryColorUuid,
    );

    if (primaryColor && secondaryColor) {
      applyColors(primaryColor.colorHex, secondaryColor.colorHex);
    }
  }, [userPref, colors]);

  // 🔁 Make refresh available
  const refreshColors = () => {
    if (!preferences || !colors?.length) return;

    const primaryColor = colors.find(
      c => c.colorUuid === preferences.primaryColorUuid,
    );
    const secondaryColor = colors.find(
      c => c.colorUuid === preferences.secondaryColorUuid,
    );

    if (primaryColor && secondaryColor) {
      applyColors(primaryColor.colorHex, secondaryColor.colorHex);
    }
  };

  return (
    <ColorContext.Provider value={{ refreshColors }}>
      {children}
    </ColorContext.Provider>
  );
};

// ✅ Hook to use in components
export const useColor = () => useContext(ColorContext);
