import React, { memo, useEffect, useState } from "react";
import cs from "classnames";
import ApiService from "services/api";
import styles from "./styles.scss";
import { useDispatch } from "react-redux";

const MusicPlayer: React.FC = memo(() => {
  const [music, setMusic] = useState(false);
  const [musicData, setMusicData] = useState([]);
  const [name, setName] = useState([]);
  const [musiclength, setMusiclength] = useState(0);

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
      setName(data[0]?.name);
      // setAudio(new Audio(data[0]?.audioList[musiclength]));
      audio.src = data[0]?.audioList[musiclength];
      audio.addEventListener("ended", function() {
        setMusiclength(musiclength + 1);
        audio.src = musicData[musiclength + 1];
        audio.pause();
        audio.load();
        audio.play();
      });
    });
  }, []);

  return (
    <div className={cs(styles.topClose, styles.music)}>
      <div>
        <div className={music ? cs(styles.openMusic) : cs(styles.closeMusic)}>
          <span className={styles.musicFonts}>MUSIC</span>
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
          {music ? <p className={styles.musicName}>{name}</p> : ""}
        </div>
      </div>
    </div>
  );
});

export default MusicPlayer;
