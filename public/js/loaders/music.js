import { loadJSON } from "../loaders.js";
import MusicPlayer from "../MusicPlayer.js";

function loadMusicSheet(musicSheet) {
  return loadJSON(`/music/${musicSheet}.json`).then((musicSheet) => {
    const musicPlayer = new MusicPlayer();
    for (const [name, track] of Object.entries(musicSheet)) {
      musicPlayer.addTrack(name, track.url);
    }
    return musicPlayer;
  });
}

export { loadMusicSheet };
