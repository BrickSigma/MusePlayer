const fileInput = document.getElementById('file-uploader')
const controls = document.getElementById('controls')
const audioController = document.getElementById('audio-controller')
const nowPlaying = document.getElementById('now-playing')
const playingNext = document.getElementById('playing-next')
const player = document.getElementById('player')

class Song {
    constructor(file) {
        this.name = file.name
        this.url = URL.createObjectURL(file)
    }
}

var songs = []
var songNo = 0

function SongItem(name) {
    li = document.createElement('li')
    li.innerHTML = name

    return li
}

function filesChanged() {
    files = fileInput.files

    songs = []
    playingNext.innerHTML = ""

    if (files.length === 0) {
        controls.style.display = "none"
        return;
    }

    let skip = true
    for (const file of files) {
        songs.push(new Song(file))
        if (!skip) {
            playingNext.appendChild(SongItem(file.name))
        }
        skip = false
    }

    nowPlaying.innerHTML = `Now playing: ${songs[0].name}`

    controls.style.display = "block"

    audioController.setAttribute('src', songs[0].url);
    songNo = 0
}

function play() {
    audioController.play()
}

function shuffleHelper(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements using array destructuring
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function shuffle() {
    let currentSong = songs.splice(songNo, 1)[0]

    songs = shuffleHelper(songs)
    
    songNo = 0
    
    playingNext.innerHTML = ""
    for (const song of songs) {
        playingNext.appendChild(SongItem(song.name))
    }

    songs.unshift(currentSong)
    
    nowPlaying.innerHTML = `Now playing: ${songs[0].name}`
}
