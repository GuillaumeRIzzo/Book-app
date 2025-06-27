import { BookModelView } from "./BookModelView";

export type BookModelViewPlain = ReturnType<BookModelView['toPlainObject']>;

export interface bookModelViewState {
  bookViews: BookModelViewPlain[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
