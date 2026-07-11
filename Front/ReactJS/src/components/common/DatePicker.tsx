// components/form/BirthDatePicker.tsx
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

import fr from 'date-fns/locale/fr';
import en from 'date-fns/locale/en-US';

interface BirthDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

const localeMap: Record<string, Locale> = {
  fr,
  'fr-FR': fr,
  en,
  'en-US': en,
};

export const BirthDatePicker = ({ value, onChange }: BirthDatePickerProps) => {
  const { t, i18n } = useTranslation('form');
  const currentLocale = localeMap[i18n.language] ?? en;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={currentLocale}>
      <DatePicker
        label={t('birthDate')}
        value={value}
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            variant="outlined"
            size="medium"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--color-primary-dark)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--color-primary-dark)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--color-primary-dark)',
              },
              '& .MuiInputLabel-root': {
                color: 'var(--color-primary-light)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'var(--color-primary-main)',
              },
              '& .MuiOutlinedInput-root': {
                color: 'var(--color-primary-main)',
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};
