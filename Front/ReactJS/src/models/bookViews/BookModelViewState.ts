import { BookModelView } from './BookModelView';

export interface bookModelViewState {
  bookViews : BookModelView[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
