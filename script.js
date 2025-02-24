const tracks = [
  {
    title: "Summer Vibes",
    artist: "Jane Doe",
    source: "audio/summer-vibes.mp3",
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500",
  },
  {
    title: "Ocean Waves",
    artist: "John Smith",
    source: "audio/ocean-waves.mp3",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500",
  },
  {
    title: "Mountain High",
    artist: "Nature Sounds",
    source: "audio/mountain-high.mp3",
    cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500",
  },
];

class MusicPlayer {
  constructor() {
    this.audio = document.getElementById("audio-player");
    this.playBtn = document.getElementById("play");
    this.prevBtn = document.getElementById("prev");
    this.nextBtn = document.getElementById("next");
    this.shuffleBtn = document.getElementById("shuffle");
    this.repeatBtn = document.getElementById("repeat");
    this.seekSlider = document.getElementById("seek-slider");
    this.volumeSlider = document.getElementById("volume-slider");
    this.muteBtn = document.getElementById("mute");
    this.currentTimeEl = document.getElementById("current-time");
    this.durationEl = document.getElementById("duration");
    this.cover = document.getElementById("cover");
    this.title = document.getElementById("title");
    this.artist = document.getElementById("artist");
    this.tracksContainer = document.getElementById("tracks-container");

    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.repeatMode = "none"; // none, all, one
    this.isShuffled = false;

    this.initializePlayer();
    this.setupEventListeners();
    this.loadPlaylist();
    this.setupTouchEvents();
  }

  initializePlayer() {
    this.loadTrack(this.currentTrackIndex);
    this.volumeSlider.value = localStorage.getItem("volume") || 100;
    this.audio.volume = this.volumeSlider.value / 100;
  }

  setupEventListeners() {
    // Playback controls
    this.playBtn.addEventListener("click", () => this.togglePlay());
    this.prevBtn.addEventListener("click", () => this.playPrevious());
    this.nextBtn.addEventListener("click", () => this.playNext());
    this.shuffleBtn.addEventListener("click", () => this.toggleShuffle());
    this.repeatBtn.addEventListener("click", () => this.toggleRepeat());

    // Audio events
    this.audio.addEventListener("timeupdate", () => this.updateProgress());
    this.audio.addEventListener("ended", () => this.handleTrackEnd());
    this.audio.addEventListener("loadedmetadata", () => this.updateDuration());

    // Volume controls
    this.volumeSlider.addEventListener("input", (e) => {
      this.audio.volume = e.target.value / 100;
      localStorage.setItem("volume", e.target.value);
      this.updateVolumeIcon();
    });

    this.muteBtn.addEventListener("click", () => this.toggleMute());

    // Seek functionality
    this.seekSlider.addEventListener("input", (e) => {
      const time = (this.audio.duration * e.target.value) / 100;
      this.audio.currentTime = time;
    });

    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === "ArrowLeft") {
        this.playPrevious();
      } else if (e.code === "ArrowRight") {
        this.playNext();
      }
    });
  }

  setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;

    this.cover.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      false
    );

    this.cover.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        this.handleSwipeGesture(touchStartX, touchEndX);
      },
      false
    );
  }

  handleSwipeGesture(startX, endX) {
    const threshold = 50;
    if (startX - endX > threshold) {
      // Swipe left - next track
      this.playNext();
    } else if (endX - startX > threshold) {
      // Swipe right - previous track
      this.playPrevious();
    }
  }

  loadPlaylist() {
    this.tracksContainer.innerHTML = tracks
      .map(
        (track, index) => `
            <div class="track-item ${
              index === this.currentTrackIndex ? "active" : ""
            }" data-index="${index}">
                <img src="${track.cover}" alt="${track.title}">
                <div class="track-info">
                    <h3>${track.title}</h3>
                    <p>${track.artist}</p>
                </div>
            </div>
        `
      )
      .join("");

    this.tracksContainer.querySelectorAll(".track-item").forEach((item) => {
      item.addEventListener("click", () => {
        const index = parseInt(item.dataset.index);
        if (index !== this.currentTrackIndex) {
          this.currentTrackIndex = index;
          this.loadTrack(index);
          this.togglePlay(true);
        }
      });

      let touchStartY = 0;

      item.addEventListener(
        "touchstart",
        (e) => {
          touchStartY = e.touches[0].clientY;
        },
        { passive: true }
      );

      item.addEventListener(
        "touchmove",
        (e) => {
          const touchY = e.touches[0].clientY;
          const deltaY = touchY - touchStartY;

          // If vertical scroll is detected, allow default behavior
          if (Math.abs(deltaY) > 10) {
            e.stopPropagation();
          }
        },
        { passive: true }
      );
    });
  }

  loadTrack(index) {
    const track = tracks[index];
    this.audio.src = track.source;
    this.cover.src = track.cover;
    this.title.textContent = track.title;
    this.artist.textContent = track.artist;
    this.updatePlaylistState();
  }

  togglePlay(forcedPlay = false) {
    if (!this.isPlaying || forcedPlay) {
      this.audio.play();
      this.isPlaying = true;
      this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
      this.cover.classList.add("playing");
    } else {
      this.audio.pause();
      this.isPlaying = false;
      this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
      this.cover.classList.remove("playing");
    }
  }

  updateProgress() {
    const percent = (this.audio.currentTime / this.audio.duration) * 100;
    this.seekSlider.value = percent;
    this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  updateDuration() {
    this.durationEl.textContent = this.formatTime(this.audio.duration);
  }

  playNext() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % tracks.length;
    this.loadTrack(this.currentTrackIndex);
    this.togglePlay(true);
  }

  playPrevious() {
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + tracks.length) % tracks.length;
    this.loadTrack(this.currentTrackIndex);
    this.togglePlay(true);
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted;
    this.updateVolumeIcon();
  }

  updateVolumeIcon() {
    const icon = this.audio.muted
      ? "fa-volume-mute"
      : this.audio.volume === 0
      ? "fa-volume-off"
      : this.audio.volume < 0.5
      ? "fa-volume-down"
      : "fa-volume-up";

    this.muteBtn.innerHTML = `<i class="fas ${icon}"></i>`;
  }

  toggleShuffle() {
    this.isShuffled = !this.isShuffled;
    this.shuffleBtn.classList.toggle("active");
  }

  toggleRepeat() {
    const modes = ["none", "all", "one"];
    const currentIndex = modes.indexOf(this.repeatMode);
    this.repeatMode = modes[(currentIndex + 1) % modes.length];

    this.repeatBtn.className = "control-btn";
    if (this.repeatMode === "one") {
      this.repeatBtn.classList.add("active");
      this.audio.loop = true;
    } else {
      this.audio.loop = false;
    }
  }

  handleTrackEnd() {
    if (this.repeatMode === "one") return;
    if (
      this.repeatMode === "all" ||
      this.currentTrackIndex < tracks.length - 1
    ) {
      this.playNext();
    } else {
      this.isPlaying = false;
      this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
      this.cover.classList.remove("playing");
    }
  }

  updatePlaylistState() {
    document.querySelectorAll(".track-item").forEach((item, index) => {
      item.classList.toggle("active", index === this.currentTrackIndex);
    });
  }
}

// Add device type detection
document.addEventListener("DOMContentLoaded", () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  document.body.classList.toggle("mobile-device", isMobile);
  new MusicPlayer();
});
