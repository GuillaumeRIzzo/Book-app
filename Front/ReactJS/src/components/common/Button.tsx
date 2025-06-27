import styled from 'twin.macro';
import Button from '@mui/material/Button';
import { ButtonBaseProps } from '@mui/material';

const StyledButtonWrapper = styled.div`
  mt-4
  flex
  justify-center
`;

interface ButtonProps extends ButtonBaseProps {
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  variant?: 'contained' | 'outlined' | 'text';
  color?:
    | 'primary'
    | 'inherit'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  disable?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
}

const CustomButton: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = 'contained',
  color = 'primary',
  disable = false,
  type = 'submit',
  icon,
  iconPosition = 'left',
  ...rest
}) => {
  return (
    <StyledButtonWrapper>
      <Button
        className='
          w-full 
          rounded-md 
          font-semibold 
          leading-6 
          shadow-sm 
          focus-visible:outline 
          focus-visible:outline-2 
          focus-visible:outline-offset-2 
        '
        variant={variant}
        color={color}
        onClick={onClick}
        disabled={disable}
        type={type}
        {...rest}
      >
        {icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        {text}
        {icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </Button>
    </StyledButtonWrapper>
  );
};

CustomButton.defaultProps;

export default CustomButton;
