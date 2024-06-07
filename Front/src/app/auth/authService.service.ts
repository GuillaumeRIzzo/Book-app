import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiUrl = environment.API_BASE_URL;

  private token = new BehaviorSubject<string | null>(null);
  token$ = this.token.asObservable();

  private log = new BehaviorSubject<boolean>(false);
  log$ = this.log.asObservable();

  constructor() {
    this.setLog();
   }

  async login(identifier: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiUrl}Identity/login`, {
        identifier,
        password
      });

      const { token, id, login, right } = response.data;
      
      if (token && right) {
        this.setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('right', right);
        localStorage.setItem('id', id);
        localStorage.setItem('login', login);
        this.setLog();
        return true;
      }
      return false;
    } catch (error) {
      // console.error('Login failed:', error);
      return false;
    }
  }

  async checkUserValidity(): Promise<boolean> {
    if (!this.token.getValue()) {
      // Token not available, user is not logged in
      return false;
    }

    try {
      const response = await axios.get(`${this.apiUrl}/check-user`, {
        headers: { Authorization: `Bearer ${this.token.getValue()}` }
      });
      // You can handle the response here, maybe return true if user is valid, false otherwise
      return true;
    } catch (error) {
      console.error('Error checking user validity:', error);
      return false;
    }
  }

  setLog() {
    this.log.next(this.getToken() != null);
  }

  getToken(): string | null {
    return this.token.getValue() || localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token.next(token);
    if (token == "") {
      localStorage.removeItem('token');
      localStorage.removeItem('right');
      localStorage.removeItem('id');
      localStorage.removeItem('login');
    }
  }
  
  hasPermission(requiredPermissions: string[]): boolean {
    return requiredPermissions.some(permission => permission == localStorage.getItem('right'));
  }
}
