import { Component, OnInit } from '@angular/core';
import { StatusService } from './services/status.service';
import { SpotifyService } from './services/spotify/spotify.service';
import { Track } from './models/track';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'music-guessing-game';
  status = 'DOWN';
  tracks: Track[] = [];

  constructor(
    private statusService: StatusService,
    private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.seedTracks();
  }

  seedTracks() {
    const randomOffset = Math.floor(Math.random() * 1000);
    const randomSearch = this.getRandomSearch();
    const genre = 'classical';

    const searchQueryString = "?q=track:" + randomSearch + " genre:'" + genre + "'&type=track&limit=1&offset=" + randomOffset; // https://developer.spotify.com/documentation/web-api/reference/#/operations/search
    this.spotifyService
      .search(searchQueryString)
      .then((result: any) => {
        var artist = result.tracks.items[0].artists[0]
        var artistName = artist.name;
        var artistId = artist.id;

        var track = result.tracks.items[0];
        var trackName = track.name;
        var trackId = track.id;
        this.tracks.push({name: trackName, artist: artistName});
        this.seedRecommendedTracks(artistId, genre, trackId);
      });
  }

  seedRecommendedTracks(artistId: string, genre: string, trackId: string) {
    const limit = 3;
    const recommendationQueryString = "?seed_artists=" + artistId + "&seed_genres=" + genre + "&seed_tracks=" + trackId + "&limit=" + limit;

    this.spotifyService
      .getRecommendations(recommendationQueryString)
      .then((result: any) => {
        var recommendedTracks = result.tracks;
        for(var i = 0; i < recommendedTracks.length; i++) {

          var artistName = result.tracks[i].artists[0].name;
          var trackName = result.tracks[i].name;
          this.tracks.push({name: trackName, artist: artistName});
        }
      });
  }

  getRandomSearch() {
    // A list of all characters that can be chosen.
    const characters = 'abcdefghijklmnopqrstuvwxyz';

    // Gets a random character from the characters string.
    const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
    let randomSearch = '';

    // Places the wildcard character at the beginning, or both beginning and end, randomly.
    switch (Math.round(Math.random())) {
      case 0:
        randomSearch = randomCharacter + '*';
        break;
      case 1:
        randomSearch = '*' + randomCharacter + '*';
        break;
    }

    return randomSearch;
  }

}
