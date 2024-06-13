import axios from 'axios';

import { environment } from '@/environments/environment';

export const apiClient = axios.create({
  baseURL: environment.API_BASE_URL,
});
