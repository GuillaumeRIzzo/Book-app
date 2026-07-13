import { BookImage } from "./bookImages";

export interface BookImagesState {
  bookImages: BookImage[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
