import { Injectable } from '@angular/core';
import { AuthService } from '../auth/authService.service';
import { Publisher } from './publisher';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  constructor(private authService: AuthService) { }
	
	ngOnInit(): void {
	}

	async getPublishers(publisherId?: number): Promise<Publisher[]> {
    let url;

    (publisherId != undefined) ?
      url = `${this.authService.apiUrl}Publishers/${publisherId}` :
      url = `${this.authService.apiUrl}Publishers`

    var results = await axios.get<Publisher[]>(url);

    const { data = results.data } = results;

    return data;
  }

	async AddPublisher(publisher: Publisher) {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token not available');
    }

    try {
      const response = await axios.post(`${this.authService.apiUrl}Publishers`, publisher, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}
