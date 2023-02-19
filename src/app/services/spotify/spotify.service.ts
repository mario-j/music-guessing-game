import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '../../models/token';
import 'rxjs/Rx';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private clientId = environment.clientId;
  private clientSecret = environment.clientSecret;
  private token: Token = <Token>{};
  private searchUrl = 'https://api.spotify.com/v1/search';
  private getRecommendationsUrl = 'https://api.spotify.com/v1/recommendations';

  constructor(private httpClient: HttpClient) { }

  async search(queryString: string): Promise<void | any> {
      await this.refreshAccessToken();
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token.access_token}`
      })

      return this.httpClient.get(this.searchUrl + queryString, { headers: headers })
                 .toPromise()
                 .then(response => {
                   return JSON.parse(JSON.stringify(response));
                 })
                 .catch(this.error);
  }

  async getRecommendations(queryString: string): Promise<void | any> {
      await this.refreshAccessToken();
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token.access_token}`
      })

      return this.httpClient.get(this.getRecommendationsUrl + queryString, { headers: headers })
                 .toPromise()
                 .then(response => {
                   return JSON.parse(JSON.stringify(response));
                 })
                 .catch(this.error);
  }

  refreshAccessToken() {
    const authorizationTokenUrl = `https://accounts.spotify.com/api/token`;
    const body = 'grant_type=client_credentials';
    return this.httpClient.post(authorizationTokenUrl, body, {
        headers: new HttpHeaders({
            Authorization:
                'Basic  ' + btoa(this.clientId + ':' + this.clientSecret),
            'Content-Type': 'application/x-www-form-urlencoded;',
        }),
    })
    .toPromise()
    .then(response => {
      var token = JSON.parse(JSON.stringify(response));
      this.token.access_token = token.access_token;
      this.token.token_type = token.token_type;
      this.token.expires_in = token.expires_in;
    });
  }

  // Error handling
  private error (error: any) {
    let message = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(message);
  }

}
