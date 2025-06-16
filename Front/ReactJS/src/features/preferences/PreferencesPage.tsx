import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useSession } from 'next-auth/react';

import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';

import { AppDispatch } from '@/redux/store';
import Input from '@/components/common/Input';
import { selectAllThemes } from '../themes/themeSelector';
import { selectAllLanguages } from '../languages/languageSelector';
import {
  decryptPayload,
  EncryptedPayload,
  encryptPayload,
} from '@/utils/encryptUtils';
import { createPreference, updatePreferenceAsync } from './PreferenceSlice';
import { selectAllPreferences } from './preferenceSelector';
import CustomButton from '@/components/common/Button';
import generateColorVariants from '@/utils/colorUtils';
import { selectAllColors } from '../colors/colorSelector';
import getCountryCode from '@/utils/flagUtils';
import { useTheme } from '@/components/context/ThemeContext';

const PreferencesPage: React.FC = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { applyTheme } = useTheme();

  const { uuid } = useMemo(() => {
    if (session?.user?.encryptedSession) {
      const { encryptedData, iv } = session.user.encryptedSession;
      try {
        // Explicitly cast the decrypted data to the expected type
        const decryptedData = decryptPayload<{ uuid: string }>(
          encryptedData,
          iv,
        );
        return { uuid: decryptedData.uuid };
      } catch (error) {
        console.error('Failed to decrypt session data:', error);
      }
    }
    return { uuid: '' };
  }, [session]);

  const preference = useSelector(selectAllPreferences);

  const userPreference = preference.find(p => p.userUuid === uuid);

  const languages = useSelector(selectAllLanguages);
  const colors = useSelector(selectAllColors);

  useEffect(() => {
    if (languages.length > 0) {
      const defaultLang = languages.find(l => l.isDefault);
      if (defaultLang) {
        setFormData(prev => ({
          ...prev,
          languageUuid: defaultLang.languageUuid || defaultLang.isoCode,
        }));
      }
    }
  }, [languages]);

  const [primaryColor, setPrimaryColor] = useState({
    light: '',
    main: '',
    dark: '',
    contrast: '',
  });

  const [secondaryColor, setSecondaryColor] = useState({
    light: '',
    main: '',
    dark: '',
    contrast: '',
  });

  const handleColorPick = (hex: string) => {
    const variants = generateColorVariants(hex);
    setPrimaryColor(variants);
  };

  const themes = useSelector(selectAllThemes);
  
  const defaultLanguage = languages.find(l => l.isDefault);
  const defaultTheme = themes.find(t => t.themeName === 'Light');
  const defaultPrimaryColor = colors.find(c => c.colorName === '');
  const defaultSecondaryColor = colors.find(c => c.colorName === '');
  const defaultBackground = colors.find(c => c.colorName === '');

  const defaultPreferences = {
    preferenceUuid: '',
    userUuid: uuid,
    languageUuid: defaultLanguage?.languageUuid ?? '',
    themeUuid: defaultTheme?.themeUuid ?? '',
    primaryColorUuid: typeof defaultPrimaryColor === 'string' ? defaultPrimaryColor : '',
    secondaryColorUuid: typeof defaultSecondaryColor === 'string' ? defaultSecondaryColor : '',
    backgroundColorUuid: typeof defaultBackground === 'string' ? defaultBackground : '',
  };

  const [formData, setFormData] = useState({
    preferenceUuid: userPreference?.preferenceUuid || '',
    userUuid: userPreference?.userUuid || uuid,
    languageUuid: userPreference?.languageUuid || defaultPreferences.languageUuid,
    themeUuid: userPreference?.themeUuid || defaultPreferences.themeUuid,
    primaryColorUuid: userPreference?.primaryColorUuid || primaryColor.main,
    secondaryColorUuid:
      userPreference?.secondaryColorUuid || secondaryColor.main,
    backgroundColorUuid: userPreference?.backgroundColorUuid || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeButton = (
    e: React.MouseEvent<HTMLElement>,
    newThemeUuid: string | null,
  ) => {
    if (newThemeUuid !== null) {
      setFormData(prev => ({ ...prev, themeUuid: newThemeUuid }));
    }
  };

  useEffect(() => {
    const selectedTheme = themes.find(t => t.themeUuid === formData.themeUuid);

    if (selectedTheme?.themeName === 'System') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    } else {
      applyTheme(selectedTheme?.themeName.toLowerCase());
    }
  }, [formData.themeUuid, themes]);

    const resetToDefault = () => {
    setFormData(defaultPreferences);
    applyTheme(defaultTheme?.themeName.toLowerCase() || 'light');
};

  const savePreferences = () => {
    try {
      const encryptedPayload: EncryptedPayload = encryptPayload(
        formData as Record<string, unknown>,
      );
      if (formData.preferenceUuid === '') {
        dispatch(createPreference(encryptedPayload)).unwrap();
      } else {
        dispatch(
          updatePreferenceAsync({
            preferenceUuid: formData.preferenceUuid,
            payload: encryptedPayload,
          }),
        ).unwrap();
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l’enregistrement des préférences');
    }
  };

  return (
    <Box className='max-w-2xl mx-auto py-10 px-4'>
      <Typography
        variant='h4'
        component='h1'
        className='text-2xl font-bold text-primary'
        marginBottom={2}
      >
        Vos préférences
      </Typography>

      <Box className=' */space-y-6'>
        <Autocomplete
          options={languages}
          getOptionLabel={option => option.languageName}
          isOptionEqualToValue={(option, value) =>
            option.languageUuid === value.languageUuid
          }
          value={
            languages.find(l => l.languageUuid === formData.languageUuid) ||
            null
          }
          onChange={(event, value) => {
            setFormData(prev => ({
              ...prev,
              languageUuid: value?.languageUuid || '',
            }));
          }}
          renderInput={params => (
            <Input
              {...params}
              label='Choisissez une langue'
              name='languageUuid'
            />
          )}
          renderOption={(props, option) => {
            const countryCode = getCountryCode(option.isoCode);
            const flagUrl = `https://flagcdn.com/w40/${countryCode}.png`;

            return (
              <li
                {...props}
                key={option.languageUuid}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {countryCode && (
                  <img
                    loading='lazy'
                    width='24'
                    src={flagUrl}
                    alt=''
                    style={{ marginRight: 10 }}
                  />
                )}
                {option.languageName}
              </li>
            );
          }}
        />

        <Box>
          <label className='block text-sm font-medium mb-1 text-primary'>
            Thème
          </label>
          <ToggleButtonGroup
            color='primary'
            value={formData.themeUuid}
            exclusive
            onChange={handleChangeButton}
            aria-label='Theme'
            className='rounded px-3 py-2'
          >
            {themes.map(opt => (
              <ToggleButton key={opt.themeUuid} value={opt.themeUuid} className='text-primary-light'>
                {opt.themeName}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box>
          {/* <label className='block text-sm font-medium my-2 text-primary'>Couleur</label> */}

          <Box className='w-1/3'>
          {colors.map(color => (
            <span className='bg-transparent border-0 outline-0 m-0 cursor-pointer align-middle border-r-[50%] p-0 justify-center relative items-center inline-flex'>
              <input type='radio' aria-label={color.colorName} name='primaryColorUuid' value={color.colorUuid} className='absolute opacity-0 w-full h-full top-0 left-0 m-0 p-0 z-1 cursor-pointer'/>
              <Box className='w-12 h-12 cursor-pointer' sx={{
                backgroundColor: `${color.colorHex}`
              }}/>
              <span className='overflow-hidden pointer-events-none absolute z-0 inset-0 border-r-inherit'></span>
            </span>
          ))}
          </Box>
        </Box>

        <Box className='flex gap-4 mt-4'>
          <CustomButton
            onClick={savePreferences}
            className='bg-secondary text-primary-dark px-4 py-2 rounded hover:bg-secondary-dark'
            text='Sauvegarder'
          />

          <CustomButton
            onClick={resetToDefault}
            className='text-primary-dark px-4 py-2 rounded border-secondary hover:border-secondary-dark'
            text='Réinitialiser'
            variant='outlined'
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PreferencesPage;
