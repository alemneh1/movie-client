import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RateLimitService {
  private readonly rateLimitKey = 'rateLimitData';

  constructor() {}

  setRateLimitCookie(requestCount: number) {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    const rateLimitData = {
      timestamp: now.getTime(),
      count: requestCount,
    };

    document.cookie = `${this.rateLimitKey}=${JSON.stringify(
      rateLimitData
    )}; expires=${expirationDate.toUTCString()}; path=/`;
  }

  checkRateLimit(): boolean {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${this.rateLimitKey}=`));

    if (cookie) {
      const rateLimitData = JSON.parse(cookie.split('=')[1]);
      const timestamp = rateLimitData.timestamp;
      const now = new Date().getTime();
      const elapsedTime = now - timestamp;

      if (elapsedTime < 24 * 60 * 60 * 1000 && rateLimitData.count >= 25) {
        // Rate limit exceeded
        alert('Rate limit exceeded. Please try again later.');
        return false;
      }
    }
    return true;
  }

  handleRequest() {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${this.rateLimitKey}=`));

    if (cookie) {
      const rateLimitData = JSON.parse(cookie.split('=')[1]);
      const requestCount = rateLimitData.count + 1;
      this.setRateLimitCookie(requestCount);
    } else {
      // First request of the day
      this.setRateLimitCookie(1);
    }

    return this.checkRateLimit();
  }
}
