import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "./features/hooks";
import playerSlice from "./features/player.slice";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

function App() {
  const dispatch = useAppDispatch();
  const { songs, currentSong, isPlaying, loop, suffle } = useAppSelector(
    (state) => state.player
  );
  const playerRef = useRef<HTMLAudioElement>(new Audio());
  const currentTimeRef = useRef<HTMLSpanElement | null>(null);
  const durationRef = useRef<HTMLSpanElement | null>(null);
  const timeRef = useRef<HTMLInputElement | null>(null);
  const volumeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (currentSong) {
      playerRef.current.src = currentSong.src;
      playerRef.current.load();
    }
  }, [currentSong]);

  useEffect(() => {
    if (!currentSong) return;

    if (isPlaying) {
      playerRef.current.paused && playerRef.current.play();
    } else {
      playerRef.current.played && playerRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // Hàm để chuyển đổi giây thành chuỗi giờ:phút:giây
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const onDurationChange = () => {
      durationRef.current &&
        (durationRef.current.textContent = formatTime(
          playerRef.current.duration
        ));

      timeRef.current &&
        (timeRef.current.max = String(playerRef.current.duration));
    };

    const onTimeUpdate = () => {
      currentTimeRef.current &&
        (currentTimeRef.current.textContent = formatTime(
          playerRef.current.currentTime
        ));

      timeRef.current &&
        (timeRef.current.value = String(playerRef.current.currentTime));
    };

    const onEnded = () => {
      dispatch(playerSlice.actions.next());
    };

    const onVolumeChange = () => {
      if (volumeRef.current) {
        volumeRef.current.value = String(playerRef.current.volume);
      }
    };

    playerRef.current.addEventListener("durationchange", onDurationChange);
    playerRef.current.addEventListener("timeupdate", onTimeUpdate);
    playerRef.current.addEventListener("ended", onEnded);
    playerRef.current.addEventListener("volumechange", onVolumeChange);

    return () => {
      playerRef.current.removeEventListener("durationchange", onDurationChange);
      playerRef.current.removeEventListener("timeupdate", onTimeUpdate);
      playerRef.current.removeEventListener("ended", onEnded);
      playerRef.current.removeEventListener("volumechange", onVolumeChange);
    };
  }, []);

  return (
    <div className="App">
      <div className="col-3 song-list">
        <h3 className="text-center text-light mb-5 mt-5">Danh sách bài hát</h3>
        {songs.map((song) => (
          <div
            className="song text-light fs-5 ms-3 py-2"
            key={song.id}
            onClick={() => dispatch(playerSlice.actions.setSong(song.id))}
          >
            {song.title} - {song.singer}
            {currentSong?.id == song.id && "(Đang phát)"}
          </div>
        ))}
      </div>
      <div className="col-9 song-info text-light">
        {songs.map(
          (item) =>
            currentSong?.id == item.id && (
              <div
                key={item.id}
                className="wrap-items  gap-2 h-100 d-flex flex-column justify-content-center align-items-center"
              >
                <div className="wrap-img img-info d-flex justify-content-center align-items-center">
                  <img src={item.img} className="img-fluid rounded-3 " alt="" />
                </div>
                <div className="singer">{item.singer}</div>
                <div className="title fs-4">{item.title}</div>
              </div>
            )
        )}
      </div>

      <div className="player">
        <div className="container-fluid">
          <div className="row">
            <div className="d-xs-none col-sm-4 col-md-3 col-lg-3 d-sm-flex justify-xs-center">
              {currentSong && (
                <div className="info d-flex align-items-center">
                  <div className="thumbnail">
                    <img src={currentSong.img} />
                  </div>
                  <div className="content">
                    <div className="title">{currentSong.title}</div>
                    <div className="singer">{currentSong.singer}</div>
                  </div>
                  <div className="actions">
                    <button className="btn">
                      <svg
                        style={{ color: "#fff" }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-suit-heart"
                        viewBox="0 0 16 16"
                      >
                        <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="col-12 sol-sm-8 col-md-6 col-lg-6">
              <div className="controllers d-flex align-items-center justify-content-center justify-content-sm-end justify-content-md-center">
                <button
                  className="btn"
                  onClick={() => dispatch(playerSlice.actions.toggleSuffle())}
                >
                  {suffle ? (
                    <svg
                      style={{ color: "#fff" }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      fill="currentColor"
                      className="bi bi-shuffle"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z"
                      />
                      <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z" />
                    </svg>
                  ) : (
                    <svg
                      style={{ color: "#aa63d1" }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      fill="currentColor"
                      className="bi bi-shuffle"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z"
                      />
                      <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z" />
                    </svg>
                  )}
                </button>
                <button
                  className="btn"
                  onClick={() => dispatch(playerSlice.actions.prev())}
                >
                  <svg
                    style={{ color: "#fff" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    fill="currentColor"
                    className="bi bi-skip-start-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L5 8.753V12a.5.5 0 0 1-1 0V4z" />
                  </svg>
                </button>
                <button
                  className="btn"
                  onClick={() => dispatch(playerSlice.actions.togglePlay())}
                >
                  {isPlaying ? (
                    <svg
                      style={{ color: "#fff" }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      fill="currentColor"
                      className="bi bi-pause"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
                    </svg>
                  ) : (
                    <svg
                      style={{ color: "#fff" }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      fill="currentColor"
                      className="bi bi-play-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                    </svg>
                  )}
                </button>
                <button
                  className="btn"
                  onClick={() => dispatch(playerSlice.actions.next())}
                >
                  <svg
                    style={{ color: "#fff" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    fill="currentColor"
                    className="bi bi-skip-end-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0V4z" />
                  </svg>
                </button>
                <button
                  className="btn"
                  onClick={() => dispatch(playerSlice.actions.toggleLoop())}
                >
                  {loop ? (
                    <svg
                      style={{ color: "#fff" }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      fill="currentColor"
                      className="bi bi-repeat"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
                    </svg>
                  ) : (
                    <svg
                      style={{ color: "#aa63d1" }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      fill="currentColor"
                      className="bi bi-repeat"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="timer d-flex align-items-center justify-content-sm-end justify-content-center justify-content-md-center">
                <span ref={currentTimeRef}>{formatTime(currentTimeRef)}</span>
                <input
                  ref={timeRef}
                  type="range"
                  onChange={(e) => {
                    playerRef.current.currentTime = +e.target.value;
                  }}
                />
                <span ref={durationRef}>{formatTime(durationRef)}</span>
              </div>
            </div>
            <div className="col-md-3 col-lg-3 d-none d-md-bloc d-lg-block">
              <div className="extra-controllers d-flex justify-content-end align-items-center">
                <button className="btn">
                  <svg
                    style={{ color: "#fff", width: "26px", height: "26px" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-volume-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
                    <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z" />
                    <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z" />
                  </svg>
                </button>
                <input
                  ref={volumeRef}
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={(e) => {
                    playerRef.current.volume = +e.target.value;
                  }}
                />
                <button className="btn">
                  <svg
                    style={{ color: "#fff", width: "26px", height: "26px" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-music-note-beamed"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z" />
                    <path
                      fill-rule="evenodd"
                      d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"
                    />
                    <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
