import { Injectable } from '@angular/core';
import { User } from './user';
import axios from 'axios';
import { AuthService } from '../auth/authService.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authService: AuthService) { }

  getUsers(userId?: number): Promise<any> {
    let url;

    (userId != undefined) ?
      url = `${this.authService.apiUrl}Users/${userId}` :
      url = `${this.authService.apiUrl}Users`

    return axios.get<User[]>(url);
  }

  async addUser(user: User) {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token not available');
    }

    try {
      const response = await axios.post(`${this.authService.apiUrl}Users`, user, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

  updateUser(user: User) {
    return axios.put(`${this.authService.apiUrl}Users/${user.userId}`, user);
  }

  deleteUser(user: User) {

  }
}