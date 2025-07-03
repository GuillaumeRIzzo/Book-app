import { BookImage } from "./bookImages";

export interface BookImagesState {
  images: BookImage[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
