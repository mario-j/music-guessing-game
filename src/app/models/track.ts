export interface Track {
  name: string;
  artist: string;
}

interface Tracks extends Array<Track>{}
