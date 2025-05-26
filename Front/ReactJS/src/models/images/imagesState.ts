import { Image } from "./images";

export interface ImagesState {
  images: Image[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
