#!/usr/bin/env node
// @ts-check
import { generateM3uPlaylist } from "../lib/m3u.mjs";
import {
  getWeeklyJam,
  searchTracksFromListenBrainzPlaylist,
} from "../lib/listenbrain.mjs";
import process from "node:process";

const path = process.argv.at(2);
const user = process.argv.at(3);

function help() {
  console.log(`listenbrainz-m3u-jam [path] [user]`);
}

if (path === undefined) {
  console.error("You must specify the path");
  help();
  process.exit(1);
}
if (user === undefined) {
  console.error("You must specify the user");
  help();
  process.exit(1);
}

const weeklyJam = await getWeeklyJam(user);
const playlistId = weeklyJam.identifier.replace(
  "https://listenbrainz.org/playlist/",
  "",
);

const localTracks = await searchTracksFromListenBrainzPlaylist(
  path,
  playlistId,
);

const m3u = generateM3uPlaylist(
  localTracks.filter(Boolean),
  weeklyJam.title,
  path,
);

console.log(m3u);
