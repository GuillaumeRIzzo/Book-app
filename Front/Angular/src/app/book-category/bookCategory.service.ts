import { Injectable } from '@angular/core';
import { AuthService } from '../auth/authService.service';
import { BookCategory } from './bookCategory';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class BookCategoryService {


  constructor(private authService: AuthService) { }
	
	ngOnInit(): void {
	}

	async getBookCategories(): Promise<BookCategory[]> {
    let url = `${this.authService.apiUrl}BookCategory`

    var results = await axios.get<BookCategory[]>(url);

    const { data = results.data } = results;

    return data;
  }


  async getBookCategory(bookCategoId: number): Promise<BookCategory> {
    let url = `${this.authService.apiUrl}BookCategory/${bookCategoId}`
   
    var results = await axios.get<BookCategory>(url);

    const { data = results.data } = results;

    return data;
  }
	async AddBookCategory(bookCatego: BookCategory) {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token not available');
    }

    try {
      const response = await axios.post(`${this.authService.apiUrl}BookCategory`, bookCatego, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.status;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async deleteBookCategory(bookCatego: BookCategory) {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token not available');
    }

    try {
      const response = await axios.delete(`${this.authService.apiUrl}BookCategorys/${bookCatego.bookCategoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.status;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}
