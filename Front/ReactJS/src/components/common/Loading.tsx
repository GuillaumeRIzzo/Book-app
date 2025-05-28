import { CircularProgress, Container } from '@mui/material';

const Loading: React.FC = () => {
  return (
    <Container className='h-[54rem] flex justify-center items-center'>
      <CircularProgress className='min-w-32 min-h-32' />
    </Container>
  );
};


export default Loading;