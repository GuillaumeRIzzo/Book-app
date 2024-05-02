import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiUrl = 'https://localhost:7197/api/';
  private token = new BehaviorSubject<string | null>(null);
  token$ = this.token.asObservable();

  private log: boolean;

  constructor() { }

  async login(identifier: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiUrl}Identity/login`, {
        identifier,
        password
      });

      const { token, userRight } = response.data;
      
      if (token && userRight) {
        this.setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('right', userRight);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
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

  isLog(): boolean {
    this.log = (this.getToken() != null) ? true : false;
    return this.log;
  }

  getToken(): string | null {
    return this.token.getValue() || localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token.next(token);
    if (token == "") {
      localStorage.removeItem('token');
      localStorage.removeItem('right');
    }
  }
  
  hasPermission(requiredPermission: string): boolean {
    const userRight = localStorage.getItem('right');
      return userRight == requiredPermission;
  }
}
