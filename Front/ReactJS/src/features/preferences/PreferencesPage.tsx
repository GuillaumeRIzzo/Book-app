import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useSession } from 'next-auth/react';

import {
  Autocomplete,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
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
import { selectPreference } from './preferenceSelector';
import CustomButton from '@/components/common/Button';
import generateColorVariants from '@/utils/colorUtils';
import { selectAllColors } from '../colors/colorSelector';
import getCountryCode from '@/utils/flagUtils';
import { useTheme } from '@/components/context/ThemeContext';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const PreferencesPage: React.FC = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const themeContext = useTheme();
  const { t } = useTranslation();

  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  const { applyTheme } = themeContext;

  const router = useRouter();

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

  useEffect(() => {
    if (!uuid) {
      if (typeof window !== 'undefined') {
        router.replace('/');
      }
    }
  }, [uuid, router]);

  const preference = useSelector(selectPreference);

  const userPreference = preference;

  const languages = useSelector(selectAllLanguages);
  const colors = useSelector(selectAllColors);

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

  const handleColorPick = (hex: string, type: 'primary' | 'secondary') => {
    const variants = generateColorVariants(hex);

    if (type === 'primary') {
      setPrimaryColor(variants);
    } else if (type === 'secondary') {
      setSecondaryColor(variants);
    }
  };

  const themes = useSelector(selectAllThemes);

  const defaultLanguage = languages.find(l => l.isDefault);
  const defaultTheme = themes.find(t => t.themeName === 'Light');
  const defaultPrimaryColor = colors.find(
    c => c.colorName === 'Indigo',
  )?.colorUuid;
  const defaultSecondaryColor = colors.find(
    c => c.colorName === 'Limonana',
  )?.colorUuid;

  const defaultPreferences = {
    preferenceUuid: '00000000-0000-0000-0000-000000000000',
    userUuid: uuid,
    languageUuid: defaultLanguage?.languageUuid,
    themeUuid: defaultTheme?.themeUuid,
    primaryColorUuid: defaultPrimaryColor,
    secondaryColorUuid: defaultSecondaryColor,
  };

  const [formData, setFormData] = useState({
    preferenceUuid:
      userPreference?.preferenceUuid || defaultPreferences.preferenceUuid,
    userUuid: userPreference?.userUuid || defaultPreferences.userUuid,
    languageUuid:
      userPreference?.languageUuid || defaultPreferences.languageUuid,
    themeUuid: userPreference?.themeUuid || defaultPreferences.themeUuid,
    primaryColorUuid:
      userPreference?.primaryColorUuid || defaultPreferences.primaryColorUuid,
    secondaryColorUuid:
      userPreference?.secondaryColorUuid ||
      defaultPreferences.secondaryColorUuid,
  });

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
      const name = selectedTheme?.themeName?.toLowerCase();
      if (name === 'dark' || name === 'light') {
        applyTheme(name);
      } else {
        applyTheme('light'); // fallback par défaut
      }
    }
  }, [formData.themeUuid, themes, applyTheme]);

  const resetToDefault = () => {
    setFormData(defaultPreferences);

    const name = defaultTheme?.themeName?.toLowerCase();
    if (name === 'dark' || name === 'light') {
      applyTheme(name);
    } else {
      applyTheme('light'); // fallback de sécurité
    }
  };

  const savePreferences = () => {
    try {
      const encryptedPayload: EncryptedPayload = encryptPayload(
        formData as Record<string, unknown>,
      );

      if (!userPreference) {
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
        {t('preferences.title')}
      </Typography>

      <Box className=' */space-y-6'>
        <Autocomplete
          options={languages}
          getOptionLabel={option =>
            t(`languages.${option.isoCode}`, {
              defaultValue: option.languageName,
            })
          }
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
              label={t('preferences.language')}
              name='languageUuid'
            />
          )}
          renderOption={(props, option) => {
            const countryCode = getCountryCode(option.isoCode);
            const flagUrl = `https://flagcdn.com/w40/${countryCode}.png`;
            const label = t(`languages.${option.isoCode}`, {
              defaultValue: option.languageName,
            });

            return (
              <li
                {...props}
                key={option.languageUuid}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {countryCode && (
                  <Image
                    loading='lazy'
                    width='24'
                    height='20'
                    src={flagUrl}
                    alt=''
                    style={{ marginRight: 10 }}
                  />
                )}
                {label}
              </li>
            );
          }}
        />

        <Box>
          <label className='block text-sm font-medium mb-1 text-primary'>
            {t('preferences.theme')}
          </label>
          <ToggleButtonGroup
            value={formData.themeUuid}
            exclusive
            onChange={handleChangeButton}
            aria-label='Theme'
            className='rounded px-3 py-2'
            sx={{
              '& .MuiToggleButton, .Mui-selected': {
                color: 'var(--color-primary-main)',
              },
            }}
          >
            {themes.map(opt => (
              <ToggleButton
                key={opt.themeUuid}
                value={opt.themeUuid}
                className='text-primary-light'
              >
                {t(`theme.${opt.themeName}`)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box display='flex'>
          <Box className='w-1/3'>
            <label
              aria-label='primaryColorUuid'
              className='block text-sm font-medium my-2'
              style={{
                color: `${primaryColor.main}`,
              }}
            >
              {t('preferences.color.text')}
            </label>
            {colors.map(color => (
              <Tooltip key={color.colorName} title={color.colorName} arrow>
                <span className='bg-transparent border-0 outline-0 m-0 cursor-pointer align-middle border-r-[50%] p-0 justify-center relative items-center inline-flex'>
                  <input
                    type='radio'
                    aria-label={color.colorName}
                    name='primaryColorUuid'
                    value={color.colorUuid}
                    checked={formData.primaryColorUuid === color.colorUuid}
                    onChange={() => {
                      setFormData(prev => ({
                        ...prev,
                        primaryColorUuid: color.colorUuid,
                      }));
                      handleColorPick(color.colorHex, 'primary');
                    }}
                    className='absolute opacity-0 w-full h-full top-0 left-0 m-0 p-0 z-1'
                  />
                  <Box
                    className='w-12 h-12'
                    sx={{
                      backgroundColor: `${color.colorHex}`,
                    }}
                  />
                  {formData.primaryColorUuid === color.colorUuid && (
                    <span className='overflow-hidden pointer-events-none absolute z-0 inset-0 border-r-inherit'>
                      ✔
                    </span>
                  )}
                </span>
              </Tooltip>
            ))}
          </Box>
          <Box className='w-1/3'>
            <label
              aria-label='secondaryColorUuid'
              className='block text-sm font-medium my-2'
              style={{
                color: `${secondaryColor.main}`,
              }}
            >
              {t('preferences.color.button')}
            </label>
            {colors.map(color => (
              <Tooltip key={color.colorName} title={color.colorName} arrow>
                <span className='bg-transparent border-0 outline-0 m-0 cursor-pointer align-middle border-r-[50%] p-0 justify-center relative items-center inline-flex'>
                  <input
                    type='radio'
                    aria-label={color.colorName}
                    name='secondaryColorUuid'
                    value={color.colorUuid}
                    checked={formData.secondaryColorUuid === color.colorUuid}
                    onChange={() => {
                      setFormData(prev => ({
                        ...prev,
                        secondaryColorUuid: color.colorUuid,
                      }));
                      handleColorPick(color.colorHex, 'secondary');
                    }}
                    className='absolute opacity-0 w-full h-full top-0 left-0 m-0 p-0 z-1'
                  />
                  <Box
                    className='w-12 h-12'
                    sx={{
                      backgroundColor: `${color.colorHex}`,
                    }}
                  />
                  {formData.secondaryColorUuid === color.colorUuid && (
                    <span className='overflow-hidden pointer-events-none absolute z-0 inset-0 border-r-inherit'>
                      ✔
                    </span>
                  )}
                </span>
              </Tooltip>
            ))}
          </Box>
        </Box>

        <Box className='flex gap-4 mt-4'>
          <CustomButton
            onClick={savePreferences}
            className='px-4 py-2 rounded'
            text={t('preferences.buttons.save')}
            sx={{
              color: "var(--color-primary-dark)",
              backgroundColor: "var(--color-secondary-main)",
              borderColor: "var(--color-secondary-main)",
              "&:hover": {
                borderColor: "var(--color-secondary-dark)",
                backgroundColor: "var(--color-secondary-dark)"
              }
            }}
          />

          <CustomButton
            onClick={resetToDefault}
            className='px-4 py-2 rounded'
            text={t('preferences.buttons.reset')}
            variant='outlined'
            sx={{
              color: "var(--color-primary-main)",
              borderColor: "var(--color-secondary-main)",
              "&:hover": {
                borderColor: "var(--color-secondary-dark)"
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PreferencesPage;
