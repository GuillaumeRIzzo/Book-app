import styled from 'twin.macro';
import Button from '@mui/material/Button';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { ButtonBaseProps } from '@mui/material';

const StyledButtonWrapper = styled.div`
  mt-4
  flex
  justify-center
`;

interface ButtonProps extends ButtonBaseProps {
  text: string;
  onClick?: () => void;
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
}

const CustomButton: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = 'contained',
  color = 'primary',
  disable = false,
  type = 'submit',
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
        endIcon={<ArrowRightIcon className='w-5 h-5' />}
        onClick={onClick}
        disabled={disable}
        type={type}
        {...rest}
      >
        {text}
      </Button>
    </StyledButtonWrapper>
  );
};

CustomButton.defaultProps;

export default CustomButton;
