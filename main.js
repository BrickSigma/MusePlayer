const body = document.getElementById('body')
const fileInput = document.getElementById('file-uploader')
const controls = document.getElementById('controls')
const audioController = document.getElementById('audio-controller')
const nowPlaying = document.getElementById('now-playing')
const playingNext = document.getElementById('playing-next')
const player = document.getElementById('player')
const time = document.getElementById('time')
const slider = document.getElementById('slider')
const duration = document.getElementById('duration')

const playIcon = `
<svg class="size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
    <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/>
</svg>
`

const pauseIcon = `
<svg class="size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
    <path d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"/>
</svg>
`

class Song {
    constructor(file) {
        this.name = file.name
        this.url = URL.createObjectURL(file)
    }
}

var songs = []
var songNo = 0
var playing = false
var repeat = 0

function loadUI() {
    nowPlaying.innerHTML = `Now playing: ${songs[songNo].name}`
    playingNext.innerHTML = ""
    for (let song = songNo + 1; song < songs.length; song++) {
        playingNext.appendChild(SongItem(songs[song].name, song))
    }
}

function SongItem(name, number) {
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

    for (let i = 0; i < files.length; i++) {
        songs.push(new Song(files[i]))
        if (i >= 1) {
            playingNext.appendChild(SongItem(files[i].name, i))
        }
    }

    nowPlaying.innerHTML = `Now playing: ${songs[0].name}`

    controls.style.display = "block"

    audioController.setAttribute('src', songs[0].url);
    songNo = 0
}

function play() {
    if (playing) {
        audioController.pause()
    } else {
        audioController.play()
    }

    playing = !playing
    player.innerHTML = playing ? pauseIcon : playIcon
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
    for (const song in songs) {
        playingNext.appendChild(SongItem(songs[song].name, song))
    }

    songs.unshift(currentSong)

    nowPlaying.innerHTML = `Now playing: ${songs[0].name}`
}

function seekBack() {
    if (audioController.currentTime < 3) {
        songNo = (--songNo) % songs.length
        audioController.setAttribute('src', songs[songNo].url);
        audioController.play()
        loadUI()
    } else {
        audioController.currentTime = 0;
    }
}

function seekForward() {
    songNo = (++songNo) % songs.length
    audioController.setAttribute('src', songs[songNo].url);
    audioController.play()
    loadUI()
}

function handleMetaData() {
    console.log(audioController.duration)
    slider.max = audioController.duration
    slider.value = 0
    duration.innerHTML = `${Math.trunc(slider.max / 60).toString().padStart(2, '0')}:${Math.trunc(slider.max % 60).toString().padStart(2, '0')}`
}

function updateTime() {
    slider.value = audioController.currentTime
    time.innerHTML = `${Math.trunc(slider.value / 60).toString().padStart(2, '0')}:${Math.trunc(slider.value % 60).toString().padStart(2, '0')}`
}

function seek() {
    audioController.currentTime = slider.value
}

function nextSong() {
    seekForward()
}