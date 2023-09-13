// JavaScript code
const dropArea = document.getElementById('dropArea');
const playlist = document.getElementById('music');
const audioPlayer = document.getElementById('audioPlayer');
let updateTimer = setInterval(seekUpdate, 500)
let currentSongIndex = 0;
let songs = [{ name: "a", url: '../../a.mp3' }, { name: "a", url: '../../a.mp3' }];

// Function to handle the drag and drop event
function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFiles(files);
}

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.type === 'audio/mpeg' || file.type === 'audio/ogg') {
            const song = {
                name: file.name.replace(".mp3", " ").slice(0, 35),
                url: URL.createObjectURL(file)
            };
            songs.push(song);
            createPlaylistItem();
        } else {
            alert('File "' + file.name + '" tidak di dukung');
        }
    }
}

function createPlaylistItem() {
    playlist.innerHTML = "";
    songs.forEach(song => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = song.name;
        listItem.classList.add("song");
        listItem.addEventListener('click', function () {
            playSong(songs.indexOf(song));
        });
        listItem.appendChild(link);
        playlist.appendChild(listItem);
    });
    checked();
}

const playerVolumeRange = document.querySelector("[data-volume]");
const playerVolumeBtn = document.querySelector("[data-volume-btn]")

function changeVolume() {
    audioPlayer.volume = playerVolumeRange.value;
    audioPlayer.muted = false;
    if (audioPlayer.volume <= 0.1) {
        playerVolumeBtn.children[0].textContent = "volume_mute";
    } else if (audioPlayer.volume <= 0.5) {
        playerVolumeBtn.children[0].textContent = "volume_down";
    } else {
        playerVolumeBtn.children[0].textContent = "volume_up";
    }
}

changeVolume();

function muteVolume() {
    if (!audioPlayer.muted) {
        audioPlayer.muted = true;
        playerVolumeBtn.children[0].textContent = "volume_off";
    } else {
        changeVolume();
    }
}

function playSong(index) {
    currentSongIndex = index;
    audioPlayer.src = songs[currentSongIndex].url;
    audioPlayer.play();
    document.getElementById("title").innerHTML = songs[currentSongIndex].name;
    checked();
}

function playPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
    checked();
}

let seek_slider = document.querySelector(".seek_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

// Function to reset all values to their default
function resetValues() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

document.addEventListener("mousedown", (event) => {
    clearInterval(updateTimer);
});

document.addEventListener("mouseup", (event) => {
    updateTimer = setInterval(seekUpdate, 500);
});

function seekTo() {
    seekto = audioPlayer.duration * (seek_slider.value / 100);
    audioPlayer.currentTime = seekto;
}

function seekUpdate() {
    let seekPosition = 0;

    // Check if the current track duration is a legible number
    if (!isNaN(audioPlayer.duration)) {
        seekPosition = audioPlayer.currentTime * (100 / audioPlayer.duration);
        seek_slider.value = seekPosition;

        // Calculate the time left and the total duration
        let currentMinutes = Math.floor(audioPlayer.currentTime / 60);
        let currentSeconds = Math.floor(audioPlayer.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(audioPlayer.duration / 60);
        let durationSeconds = Math.floor(audioPlayer.duration - durationMinutes * 60);

        // Add a zero to the single digit time values
        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        // Display the updated duration
        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }

    if (audioPlayer.currentTime == audioPlayer.duration) {
        fle('next');
    }
}

function checked() {
    if (audioPlayer.paused) {
        document.querySelector(".play").style.display = "block";
        document.querySelector(".pause").style.display = "none";
    } else {
        document.querySelector(".play").style.display = "none";
        document.querySelector(".pause").style.display = "block";
    }
    var sad = document.querySelectorAll(".song");
    for (let i = 0; i < sad.length; i++) {
        sad[i].style.backgroundColor = "white";
    }
    sad[currentSongIndex].style.backgroundColor = "rgba(4, 19, 79, 0.938)";
    if (!audioPlayer.loop) {
        document.querySelector(".repeat").style.display = "block";
        document.querySelector(".no-repeat").style.display = "none";
        document.querySelector(".repeat").classList.remove('active');
    } else {
        document.querySelector(".repeat").style.display = "none";
        document.querySelector(".no-repeat").style.display = "block";
        document.querySelector(".no-repeat").classList.add('active');
    }
}

function repeat() {
    if (!audioPlayer.loop) {
        audioPlayer.loop = true;
        checked();
    } else {
        audioPlayer.loop = false;
        checked();
    }
}

const shuf = document.querySelector('.shuffle');
function shuffle() {
    shuf.classList.toggle("active");
}

function fle(p) {
    var x = 1;
    var leng = songs.length;
    if (shuf.classList.contains('active')) {
        x = Math.floor(Math.random() * leng);
        
    } else {
        x = 1;
    }
    if (p == 'prev') {
        currentSongIndex -= x;
        if (currentSongIndex >= 0) {
            currentSongIndex = currentSongIndex;
        } else {
            currentSongIndex = leng + currentSongIndex;
        }
    } else {
        currentSongIndex += x;
        if (currentSongIndex <= leng) {
            currentSongIndex = currentSongIndex;
        } else {
            currentSongIndex = leng - currentSongIndex;
        }
    }
    playSong(currentSongIndex);
}

// Event listeners for drag and drop
dropArea.addEventListener('dragenter', function (event) {
    event.preventDefault();
    dropArea.style.borderColor = '#aaa';
});

dropArea.addEventListener('dragover', function (event) {
    event.preventDefault();
});

dropArea.addEventListener('dragleave', function () {
    dropArea.style.borderColor = '#ccc';
});

dropArea.addEventListener('drop', handleDrop);

// Event listener for audio player to update current song index
audioPlayer.addEventListener('ended', function () {
    playNext();
});

createPlaylistItem(); playSong(currentSongIndex); audioPlayer.pause(); checked();
