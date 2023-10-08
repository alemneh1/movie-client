import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieData } from '../Movie/movieData';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private http: HttpClient) {}

  getData(prompt: string): Observable<MovieData> {
    const apiUrl = `${environment.apiUrl}/bot/chat?prompt=${prompt}`;
    return this.http.get<MovieData>(apiUrl);
  }
}
