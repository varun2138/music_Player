const container = document.querySelector(".container"),
  musicImg = container.querySelector(".img-area img"),
  musicName = container.querySelector(".song-details .name"),
  musicArtist = container.querySelector(".song-details .artist"),
  mainAudio = container.querySelector("#main-audio"),
  playAndPauseBtn = container.querySelector(".play-pause"),
  nextBtn = container.querySelector("#next"),
  prevBtn = container.querySelector("#prev"),
  progressArea = container.querySelector(".progress-area"),
  progressBar = container.querySelector(".progress-bar"),
  musicList = container.querySelector(".music-list"),
  moreMusicBtn = container.querySelector("#more-music"),
  closeMusicBtn = container.querySelector("#close");

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  addPlayingSong();
});

//   load music function

const loadMusic = (indexNo) => {
  musicName.innerText = allMusic[indexNo - 1].name;
  musicArtist.innerText = allMusic[indexNo - 1].artist;
  musicImg.src = `assests/audio_Cover/${allMusic[indexNo - 1].img}.jpg`;
  mainAudio.src = `assests/audio/${allMusic[indexNo - 1].src}.mp3`;
};

// play-Music function

const playMusic = () => {
  container.classList.add("paused");
  playAndPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
};

// pause-music function
const pauseMusic = () => {
  container.classList.remove("paused");
  playAndPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
};

// next-music function

const nextMusic = () => {
  musicIndex++;
  //   if musicIndex is greater than array length then musicIndex will be equal to 1
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  addPlayingSong();
};

// prev-music function

const prevMusic = () => {
  musicIndex--;
  //   if musicIndex is equal to 0, then musicIndex will be the arrayLength
  musicIndex < 1 ? (musicIndex = allMusic.length) : musicIndex;
  loadMusic(musicIndex);
  playMusic();
  addPlayingSong();
};

playAndPauseBtn.addEventListener("click", () => {
  const isMusicPaused = container.classList.contains("paused");

  isMusicPaused ? pauseMusic() : playMusic();
});

// Event Listener on nextBtn

nextBtn.addEventListener("click", () => {
  nextMusic();
});

// Event Listener on prevBtn

prevBtn.addEventListener("click", () => {
  prevMusic();
});

// updating the progress-bar according to the song time
mainAudio.addEventListener("timeupdate", (elem) => {
  const currTime = elem.target.currentTime; //getting the curr time of the song
  const duration = elem.target.duration; //getting the total time of the song
  let progressWidth = (currTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = container.querySelector(".current-time"),
    musicDuration = container.querySelector(".max-duration");

  //   update song current duration
  let currentMin = Math.floor(currTime / 60);
  let currentSec = Math.floor(currTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }

  musicCurrentTime.innerText = ` ${currentMin}:${currentSec} `;

  mainAudio.addEventListener("loadeddata", () => {
    //   update song total duration
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
      // add 0 in front of it
      totalSec = `0${totalSec}`;
    }
    //   gives the total duration of the song
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  //   updating playing song current width according to the progress bar width
  progressArea.addEventListener("click", (el) => {
    let progressWidth = progressArea.clientWidth; //gives the total width of the progress-bar
    let clickOffsetX = el.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; //getting total song duration
    mainAudio.currentTime = (clickOffsetX / progressWidth) * songDuration;
    playMusic();
  });
});

//   change loop,shuffle,repeat icon onclick
const repeatBtn = container.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText; //getting this tag innertext
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", " song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "playlist looped");
      break;
  }
});

// what to do after the song ended

mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic(); //calling the next music
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; //setting audio current time to 0
      loadMusic(musicIndex); //calling load music function with argument where index value is present
      playMusic(); //ccalling the play music function
      break;

    case "shuffle":
      //getting the random song index value
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex === randIndex); //this loop runs until the randIndex value is not equal to music Index
      musicIndex = randIndex; //passing randIndex to musicIndex
      loadMusic(musicIndex);
      playMusic();
      addPlayingSong();
      break;
  }
});

// music -list

moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

closeMusicBtn.addEventListener("click", () => {
  musicList.classList.remove("show");
});

// upading the li tag

const ulTag = container.querySelector("ul");

// creating li tag according to the array length of the music list
for (let i = 0; i < allMusic.length; i++) {
  let liTag = `
  <li li-index="${i + 1}">
  <div class="row">
    <span>${allMusic[i].name} </span>
    <p>${allMusic[i].artist}</p>
  </div>
  <audio class="${allMusic[i].src}" src="assests/audio/${
    allMusic[i].src
  }.mp3"></audio>
  <span id="${allMusic[i].src}" class="audio-duration">1:45 </span>
</li>
  `;

  // for getting the title and the artist
  ulTag.insertAdjacentHTML("beforeend", liTag);

  //for the duration of the song
  let liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].src}`);

  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", () => {
    let Duration = liAudioTag.duration;
    let totalMin = Math.floor(Duration / 60);
    let totalSec = Math.floor(Duration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
    // adding the attribute the value of total song duration
    liAudioDurationTag.setAttribute(
      "total-duration",
      `${totalMin}:${totalSec}`
    );
  });
}

//play a particular song on click from the list i.e; on each li
const allLiTags = container.querySelectorAll("li");
const addPlayingSong = () => {
  for (let k = 0; k < allLiTags.length; k++) {
    // selceting audio-duration class
    let audioTag = allLiTags[k].querySelector(".audio-duration");
    // remove playing class from all other li except the last clicked one
    if (allLiTags[k].classList.contains("playing")) {
      allLiTags[k].classList.remove("playing");
      let tSongDuration = audioTag.getAttribute("total-duration");
      audioTag.innerText = tSongDuration;
    }

    //  If the index in the particular li element is equal to musicInex,
    // then the song will be played
    if (allLiTags[k].getAttribute("li-index") == musicIndex) {
      allLiTags[k].classList.add("playing");
      audioTag.innerText = "Playing...";
    }

    // adding onclick attribute to all the li elements
    allLiTags[k].setAttribute("onclick", "clicked(this)");
  }
};

// play song when li is clicked

const clicked = (elem) => {
  let getLiIndex = elem.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  addPlayingSong();
  musicList.classList.remove("show");
};
