import React, { memo, useEffect, useState } from "react";
import cs from "classnames";
import ApiService from "services/api";
import styles from "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";

const MusicPlayer: React.FC = memo(() => {
  const [music, setMusic] = useState(false);
  const [musicData, setMusicData] = useState([]);
  // const [name, setName] = useState([]);
  // const [musiclength, setMusiclength] = useState(0);

  const { mobile } = useSelector((state: AppState) => state.device);

  const dispatch = useDispatch();
  const [audio] = useState<any>(
    typeof document == "undefined" ? "" : new Audio("")
  );

  const audioPlay = (mode: boolean) => {
    if (musicData.length > 0) {
      if (mode) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  };
  useEffect(() => {
    ApiService.getMusicData(dispatch).then(data => {
      setMusicData(data[0]?.audioList);
      // setName(data[0]?.name);
      const musictemp = data[0]?.audioList;
      let musiclength = 0;
      // setAudio(new Audio(data[0]?.audioList[musiclength]));
      audio.src = data[0]?.audioList[musiclength];
      audio.addEventListener("ended", function() {
        ++musiclength;
        audio.src = musictemp[musiclength];
        audio.pause();
        audio.load();
        audio.play();
        if (musiclength == musictemp.length - 1) {
          musiclength = -1;
        }
      });
    });
  }, []);

  return (
    <div
      className={
        mobile
          ? cs(styles.musicMobile, styles.music)
          : cs(styles.topClose, styles.music)
      }
    >
      <div>
        <div className={music ? cs(styles.openMusic) : cs(styles.closeMusic)}>
          <div className={styles.musicFonts}>GOODEARTH PLAYLIST</div>
          <label className={styles.label1}>
            <input
              type="checkbox"
              className={styles.toggelInput}
              name="toggleMusic"
              id="toggleMusic"
              checked={music}
              onChange={event => {
                setMusic(!music);
                audioPlay(event.target.checked);
              }}
            />
            <label
              htmlFor="toggleMusic"
              className={
                music
                  ? cs(styles.toggelOpen, styles.checked)
                  : cs(styles.toggelClose, styles.notChecked)
              }
            ></label>
          </label>
          {/* {music ? <p className={styles.musicName}>{name}</p> : ""} */}
        </div>
      </div>
    </div>
  );
});

export default MusicPlayer;
