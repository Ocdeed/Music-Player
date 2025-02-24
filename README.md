# Modern Music Player

A sleek and responsive music player built with vanilla JavaScript, featuring a modern UI and touch-friendly controls.

## Features

- 🎵 Full audio playback controls
- 📱 Responsive design for all devices
- 🎨 Modern and intuitive user interface
- 📃 Dynamic playlist management
- 🔊 Volume control with memory
- 🔄 Shuffle and repeat modes
- ⌨️ Keyboard controls
- 📱 Touch gestures support
- 🖼️ Rotating album art animation

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Ocdeed/music-player.git
cd music-player
```

2. Add your audio files to the `/audio` directory:
- summer-vibes.mp3
- ocean-waves.mp3
- mountain-high.mp3

3. Open `index.html` in your web browser

## Usage

- **Play/Pause**: Click play button or press Space
- **Next/Previous**: Click arrows or use keyboard arrow keys
- **Volume**: Use slider or click mute button
- **Seek**: Click anywhere on the progress bar
- **Playlist**: Click any track to play
- **Mobile**: Swipe album art left/right to change tracks

## Keyboard Shortcuts

- `Space` - Play/Pause
- `←` - Previous track
- `→` - Next track

## Customization

Edit the tracks array in `script.js` to add your own music:

```javascript
const tracks = [
    {
        title: "Your Song",
        artist: "Artist Name",
        source: "audio/your-song.mp3",
        cover: "your-cover-image-url"
    }
];
```

## Credits

Created by [ocdeedcodes](https://github.com/Ocdeed)

