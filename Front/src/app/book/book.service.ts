import { Injectable } from '@angular/core';

import { Book } from './book';
import { AuthService } from '../auth/authService.service';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private authService: AuthService) { }


  async getBooks(userId?: number): Promise<Book[]> {
    let url;

    (userId != undefined) ?
      url = `${this.authService.apiUrl}Books/${userId}` :
      url = `${this.authService.apiUrl}Books`

    var results = await axios.get<Book[]>(url);

    const { data = results.data } = results;

    return data;
  }

  async getBook(bookId?: number): Promise<Book> {
    let url = `${this.authService.apiUrl}Books/${bookId}`;

    var results = await axios.get<Book>(url);

    const { data = results.data } = results;

    return data;
  }

  async addBook(book: Book) {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token not available');
    }

    try {
      const response = await axios.post(`${this.authService.apiUrl}Books`, book, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.status;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async uppdateBook(book: Book) {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token not available');
    }

    try {
      const response = await axios.put(`${this.authService.apiUrl}Books/${book.bookId}`, book, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.status;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async deleteBook(book: Book) {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token not available');
    }

    try {
      const response = await axios.delete(`${this.authService.apiUrl}Books/${book.bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.status;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}
