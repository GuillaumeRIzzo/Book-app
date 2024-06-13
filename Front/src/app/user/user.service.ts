import { Injectable } from '@angular/core';
import { User } from './user';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthService } from '../auth/authService.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private axiosInstance: AxiosInstance;

  constructor(private authService: AuthService) {
    this.axiosInstance = axios.create();
  
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      const token = authService.getToken();
        if (!token) {
          // throw new Error('Token not available');
        }
        config.headers.setAuthorization(`Bearer ${token}`);
      return config;
    });
    
    // Add a response interceptor
    this.axiosInstance.interceptors.response.use(
      response => response,
      (error: AxiosResponse<any, any>) => {
        if (error) {
          const status = error.request.status;
          if (status === 400) {
            return error;
          }
        }
        return Promise.reject(error);
      }
    );
   }

  async getUsers(): Promise<User[]> {
    let url = `${this.authService.apiUrl}Users`;

    try {
      const response = await axios.get<User[]>(url);

      return response.data;

    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async getUser(userId: number): Promise<User> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token not available');
    }

    try {
      let url = `${this.authService.apiUrl}Users/${userId}`;

      const result = await axios.get<User>(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return result.data

    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async addUser(user: User) {
    try {
      const response = await axios.post(`${this.authService.apiUrl}Users`, user);

      return response.status;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async updateUser(user: User) {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token not available');
    }

    const response = await this.axiosInstance.put(`${this.authService.apiUrl}Users/${user.userId}`, user, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.request.status;
  }
  
  async deleteUser(userId: number) {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token not available');
    }

    try {
      const response = await axios.delete(`${this.authService.apiUrl}Users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.status;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}