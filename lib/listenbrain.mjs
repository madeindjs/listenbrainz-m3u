// @ts-check
import { search } from "music-metadata-search";

/**
 * @typedef {Record<'title' | 'album' | 'author' | 'title' | 'recordId', string>} LbTrack
 */

export async function getWeeklyJam(user = "madeindjs") {
  const res = await fetch(
    `https://api.listenbrainz.org/1/user/${user}/playlists/createdfor`,
  );
  if (!res.ok) throw Error();
  const { playlists } = await res.json();
  return playlists
    .map((p) => p.playlist)
    .find((playlist) => {
      return (
        playlist.extension["https://musicbrainz.org/doc/jspf#playlist"]
          .additional_metadata.algorithm_metadata.source_patch === "weekly-jams"
      );
    });
}

/**
 * @param {string} id
 */
export async function getPlaylist(id) {
  const res = await fetch(`https://api.listenbrainz.org/1/playlist/${id}`);
  if (!res.ok) throw Error();
  const data = await res.json();
  return data.playlist;
}

/**
 * @returns {LbTrack[]}
 */
export function extractPlaylistTracks(playlist) {
  return playlist.track.map((t) => {
    const recordId = t.identifier
      .at(0)
      .replace("https://musicbrainz.org/recording/", "");

    return { recordId, album: t.album, author: t.creator, title: t.title };
  });
}

/**
 * @returns {Promise<LbTrack[]>}
 */
export async function getPlaylistTracks(id) {
  const playlist = await getPlaylist(id);
  return extractPlaylistTracks(playlist);
}

/**
 * @param {string} path
 * @param {string | LbTrack[]} playlistIdOrTracks
 */
export async function searchTracksFromListenBrainzPlaylist(
  path,
  playlistIdOrTracks,
) {
  const tracks =
    typeof playlistIdOrTracks === "string"
      ? await getPlaylistTracks(playlistIdOrTracks)
      : playlistIdOrTracks;

  const localTracks = [];
  for await (const track of search(path, {})) {
    if (!track.musicbrainzRecordingId) continue;
    const index = tracks.findIndex(
      (t) => t.recordId === track.musicbrainzRecordingId,
    );
    if (index === -1) continue;
    localTracks[index] = track;
  }

  for (let i = 0; i < tracks.length; i++) {
    if (localTracks[i] === undefined) {
      const track = tracks[i];
      console.warn(
        `Cannot find ${track.author} - ${track.title} (${track.recordId})`,
      );
    }
  }

  return localTracks;
}
