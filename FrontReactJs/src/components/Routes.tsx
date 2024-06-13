import { Routes, Route } from 'react-router-dom';

import Home from '@/pages';
import BookDetailsPage from '@/pages/book/[id]';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book/:id" element={<BookDetailsPage />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
