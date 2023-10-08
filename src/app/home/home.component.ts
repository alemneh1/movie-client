import { MovieData } from '../Movie/movieData';
import { RateLimitService } from '../rate-limit/RateLimitServic';
import { MovieService } from './../services/movie.service';
import { Component } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }), // Initial state
        animate('1s', style({ opacity: 1 })), // Fade in over 500 milliseconds
      ]),
    ]),
  ],
})
export class HomeComponent {
  prompt: string = '';
  movieList: MovieData[] = [];
  loadingImage = false;
  displayError = false;
  errorMessage = '';
  selectedMovie: MovieData | null = null;
  movieSelcted: boolean = false;

  constructor(
    private movieService: MovieService,
    private rateLimitService: RateLimitService
  ) {}

  onListMovies() {
    this.displayError = false;
    if (this.rateLimitService.handleRequest()) {
      this.movieList = [];
      this.loadingImage = true; // starts the spinner
      this.movieService.getData(this.prompt).subscribe(
        (data: any) => {
          // Handle the data returned from the API
          this.movieList = data; // Assuming the API returns an array of movies
          this.loadingImage = false;
          if (this.movieList.length <= 0) {
            this.errorMessage = 'An error occurred. Please try again.';
            this.displayError = true;
          }
        },
        (error) => {
          // Handle other types of errors
          this.errorMessage = 'An error occurred. Please try again later.';
          this.loadingImage = false;
          this.displayError = true;
        }
      );
      this.prompt = '';
    }
  }
  onInputChange(event: any) {
    // Limit input to 100 characters
    if (event.target.value.length > 100) {
      this.prompt = event.target.value.substring(0, 100);
    } else {
      this.prompt = event.target.value;
    }
  }
  onMovieClicked(movie: MovieData): void {
    this.selectedMovie = movie;
    this.movieSelcted = true;
  }
  goBackToList(): void {
    this.selectedMovie = null;
    this.movieSelcted = false;
  }
}
