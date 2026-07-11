import { Publisher } from "./publisher";

export interface PublisherState {
  publishers: Publisher[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
