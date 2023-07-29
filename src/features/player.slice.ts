import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import data from "../data";

interface ISong {
  id: number;
  title: string;
  singer: string;
  cover: string;
  src: string;
  img: string;
}

type SongID = ISong["id"];

interface IPlayerState {
  songs: ISong[];
  currentSong: ISong | null;
  isPlaying: boolean;
  volume: number;
  loop: "no" | "list" | "one";
  suffle: boolean;
}

const initialState: IPlayerState = {
  songs: data,
  currentSong: null,
  isPlaying: false,
  volume: 100,
  loop: "no",
  suffle: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    togglePlay(state) {
      if (!state.currentSong) {
        state.currentSong = state.songs[0];
      }

      state.isPlaying = !state.isPlaying;
    },
    setSong(state, action: PayloadAction<SongID>) {
      const song = state.songs.find((song) => song.id == action.payload);

      if (song) {
        state.currentSong = song;
      }
    },
    next(state) {
      if (!state.currentSong) {
        state.currentSong = state.songs[0];
      } else {
        const currentSong = state.currentSong;

        const currentSongIndex = state.songs.findIndex(
          (song) => song.id == currentSong.id
        );

        if (state.loop == "no" || state.loop == "one") {
          state.currentSong = state.songs[currentSongIndex + 1] || currentSong;
        } else {
          state.currentSong =
            state.songs[currentSongIndex + 1] || state.songs[0];
        }
      }
    },
    prev(state) {
      if (!state.currentSong) {
        state.currentSong = state.songs[state.songs.length - 1];
      } else {
        const currentSong = state.currentSong;

        const currentSongIndex = state.songs.findIndex(
          (song) => song.id == currentSong.id
        );

        if (state.loop == "no" || state.loop == "one") {
          state.currentSong = state.songs[currentSongIndex - 1] || currentSong;
        } else {
          state.currentSong =
            state.songs[currentSongIndex - 1] ||
            state.songs[state.songs.length - 1];
        }
      }
    },
    setVolume(state, action: PayloadAction<number>) {},
    toggleLoop(state) {
      if (state.loop === "no") {
        state.loop = "list";
      } else if (state.loop === "list") {
        state.loop = "one";
      } else {
        state.loop = "no";
      }
    },
    toggleSuffle(state) {
      state.suffle = !state.suffle;
    },
  },
});

export default playerSlice;
