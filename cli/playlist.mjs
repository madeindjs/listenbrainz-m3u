#!/usr/bin/env node
// @ts-check
import { generateM3uPlaylist } from "../lib/m3u.mjs";
import {
  extractPlaylistTracks,
  getPlaylist,
  getWeeklyJam,
  searchTracksFromListenBrainzPlaylist,
} from "../lib/listenbrain.mjs";
import process from "node:process";

const path = process.argv.at(2);
const playlistId = process.argv.at(3);

function help() {
  console.log(`listenbrainz-m3u-jam [path] [user]`);
}

if (path === undefined) {
  console.error("You must specify the path");
  help();
  process.exit(1);
}
if (playlistId === undefined) {
  console.error("You must specify the user");
  help();
  process.exit(1);
}

const playlist = await getPlaylist(playlistId);
// console.log(playlist);

// const playlistId = weeklyJam.identifier.replace(
//   "https://listenbrainz.org/playlist/",
//   "",
// );
const tracks = extractPlaylistTracks(playlist);

const localTracks = await searchTracksFromListenBrainzPlaylist(path, tracks);

const m3u = generateM3uPlaylist(
  localTracks.filter(Boolean),
  playlist.title,
  path,
);

console.log(m3u);
