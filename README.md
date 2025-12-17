# listenbrainz-m3u

[![npm version](https://badge.fury.io/js/listenbrainz-m3u.svg)](https://badge.fury.io/js/listenbrainz-m3u)
[![jsr version](https://jsr-badge.deno.dev/@madeindjs/listenbrainz-m3u/stable.svg)](https://jsr.io/@madeindjs/listenbrainz-m3u)

Generate M3u playlists from Listenbrainz and your available local files

This script relies on my library [`music-metadata-search`](https://www.npmjs.com/package/music-metadata-search). It'll scan all audio files and extract their metadata (ID3v1, ID3v2, APE, Vorbis, and iTunes/MP4 tags). Then it tries to get matching recordings from ListenBrainz metadata.

## Usage

```sh
npm install -g listenbrainz-m3u

listenbrainz-m3u ~/Music 4291d09d-2088-4397-8f63-9cab2ec59217 > ~/Music/lb-focus.m3u

listenbrainz-m3u-weekly-jam ~/Music madeindjs > ~/Music/lb-weekly-jam.m3u
```
