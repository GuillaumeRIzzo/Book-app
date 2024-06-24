import styled from 'styled-components';
import TextField, { StandardTextFieldProps } from '@mui/material/TextField';
import { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const StyledInputWrapper = styled.div`
  margin: 10px 0;
  background-color: var(--background-color);
`;

type CustomVariant = 'outlined' | 'filled' | 'standard';
type ExtendedVariant = StandardTextFieldProps['variant'] | CustomVariant;

interface InputProps extends Omit<StandardTextFieldProps, 'variant'> {
  infoText?: string;
  variant?: ExtendedVariant;
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
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <StyledInputWrapper className={className}>
      <TextField
        label={label}
        type={type === 'password' && showPassword ? 'text' : type}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        variant={variant as StandardTextFieldProps['variant']}
        color={color}
        fullWidth
        size={size}
        InputProps={
          type === 'password'
            ? {
                endAdornment: (
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
                ),
              }
            : undefined
        }
        {...rest}
      />
      {infoText && <p className="text-base text-red-500 mt-1">{infoText}</p>}
    </StyledInputWrapper>
  );
};

export default Input;
