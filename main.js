
const fileInput = document.getElementById('file-uploader')

const audioController = document.getElementById('audio-controller')

// Volume slider and icon
const volumeIcon = document.getElementById('volume-icon')
const volumeController = document.getElementById('volume')

const nowPlaying = document.getElementById('now-playing')
const playingNext = document.getElementById('playing-next')

// Control buttons and indicators
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

const volumeMuteIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-volume-mute size-6" viewBox="0 0 16 16">
    <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06M6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0"/>
</svg>
`

const volumeQuaterIcon = `
<svg class="size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
</svg>
`

const volumeHalfIcon = `
<svg class="size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
</svg>
`

const volumeMaxIcon = `
<svg class="size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor">
    <path d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z"/>
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

var setVolume = 50
var muted = false

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

    for (let i = 0; i < files.length; i++) {
        songs.push(new Song(files[i]))
        if (i >= 1) {
            playingNext.appendChild(SongItem(files[i].name, i))
        }
    }

    nowPlaying.innerHTML = `Now playing: ${songs[0].name}`

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

function setVolumeIcon(value) {
    muted = false
    if (value > 50) {
        volumeIcon.innerHTML = volumeMaxIcon
    } else if (value > 25) {
        volumeIcon.innerHTML = volumeHalfIcon
    } else if (value > 0) {
        volumeIcon.innerHTML = volumeQuaterIcon
    } else {
        volumeIcon.innerHTML = volumeMuteIcon
        muted = true
    }
}

function changeVolume() {
    let value = Number(volumeController.value)
    audioController.volume = value / 100

    setVolumeIcon(value)
}

function mute() {
    let value = Number(volumeController.value)
    setVolume = value

    if (muted) {
        muted = false
        audioController.volume = setVolume / 100
        setVolumeIcon(setVolume)
    } else {
        muted = true
        volumeIcon.innerHTML = volumeMuteIcon
        audioController.volume = 0
    }
}