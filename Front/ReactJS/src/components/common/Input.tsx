import styled from 'styled-components';
import TextField, { StandardTextFieldProps } from '@mui/material/TextField';
import { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const StyledInputWrapper = styled.div`
  margin: 10px 0;
`;

type CustomVariant = 'outlined' | 'filled' | 'standard';
type ExtendedVariant = StandardTextFieldProps['variant'] | CustomVariant;

interface InputProps extends Omit<StandardTextFieldProps, 'variant'> {
  infoText?: string;
  variant?: ExtendedVariant;
  multiline?: boolean;
  rows?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  placeholder,
  value,
  name,
  onChange,
  onBlur,
  infoText,
  className,
  variant = 'outlined',
  color = 'primary',
  size = 'medium',
  multiline = false,
  rows = 4,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const isPassword = type === 'password';

  // Inject custom border + label color styles
  const sharedStyles = {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.dark',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.dark',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.dark',
    },
    '& .MuiInputLabel-root': {
      color: 'primary.light',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'primary.main',
    },
    '& .MuiOutlinedInput-root': {
      color: 'primary.main',
    },
  };

  return (
    <StyledInputWrapper className={className}>
      <TextField
        label={label}
        type={isPassword && showPassword ? 'text' : type}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        variant={variant as StandardTextFieldProps['variant']}
        color={color}
        fullWidth
        size={size}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        InputProps={{
          ...(rest.InputProps ?? {}),
          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
        sx={{
          ...(rest.sx ?? {}),
          ...sharedStyles,
        }}
        {...rest}
      />
      {infoText && <p className="text-base text-red-500 mt-1">{infoText}</p>}
    </StyledInputWrapper>
  );
};

export default Input;
