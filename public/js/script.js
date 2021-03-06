
import * as Time from './time.js';


// defining variables
let videoContainer = document.querySelector('.player')
let video = document.querySelector('video')

let controls = document.querySelector('.controls')
let speedControls = document.querySelector('.speed-controls')
let currVolume //which will be used to return the volume to the previous state upon unmuting



/** ------ Mouse events which will be respinsible for handling the visibility of the controls/ progress bar upon mouse enter and mouse leave ------ */
let mouseMoveTimeout; //variable used to clear the timeout in case the mouseover event is triggered while the timeout is active

videoContainer.addEventListener('mouseenter',function(){
    clearTimeout(mouseMoveTimeout)
    controls.classList.add('visible')
})


videoContainer.addEventListener('mouseleave',function(){

    // a delay before the controls are hidden
    mouseMoveTimeout = setTimeout(function(){
        controls.classList.remove('visible')
    },1000)

})





// loading meta data to be shown (video duration) once loaded
video.addEventListener('loadedmetadata',function(){
    setVideoTime()
})

// eventListener 'loadedmetadata' does not fire when there is network throttle, but this line fixes that
if(video.readyState >=2) setVideoTime();

function setVideoTime(){
    document.querySelector('#current-time').innerText = Time.getTotalTime(Math.round(video.currentTime)) //need to include the 00 for hours if we have hours
    document.querySelector('#video-duration').innerText = '/ ' + Time.getTotalTime(Math.round(video.duration))
}




// uppdate when the time of the video changes (either manually or automatically while the video is playing)
video.addEventListener('timeupdate',function(){
    document.querySelector('#current-time').innerText = Time.getTotalTime(Math.round(video.currentTime))
    document.querySelector('#progress-bar').value =  video.currentTime * 100 / video.duration
    document.querySelector('.progress-curr').style.width =  Math.ceil(video.currentTime * 100 / video.duration) + '%'
})

document.querySelector('#progress-bar').addEventListener('input',function(){
    video.currentTime = this.value * video.duration / 100
})





// Playing and pausing the video
document.querySelector('button.play-pause').addEventListener('click',function(){
    if(this.classList.contains('playing')){
        video.pause()
        this.firstChild.classList = 'fas fa-play'
    } else {
        video.play()
        this.firstChild.classList = 'fas fa-pause'
    }
    this.classList.toggle('playing')
})

// listener for when video ends playback
video.addEventListener('ended',function(){
    document.querySelector('button.play-pause').firstChild.classList = 'fas fa-redo'
    document.querySelector('button.play-pause').classList.remove('playing')
})





// handling the volume amd muting
document.querySelector('button.mute').addEventListener('click',function(){
    if(video.volume === 0){
        changeVolume(video,currVolume * 100)
        
    } else {
        currVolume = video.volume
        changeVolume(video,0)
    }
})

// handling the toggle of the volume range bar
document.querySelector('#volume-bar').addEventListener('input', function(){
    if(this.value < 1){
        currVolume = 1 //the video is muted with the volume bar, so we want the volume to be 100% upon clicking unmute button
        changeVolume(video,this.value)
    } else {
        currVolume = this.value
        changeVolume(video,this.value)

    }

})


function changeVolume(video, volume){
    document.querySelector('.volume-curr').style.width = volume +'%';
    document.querySelector('#volume-bar').value = volume;
    video.volume = volume / 100

    if(volume == 0){
        document.querySelector('button.mute').firstChild.classList = 'fas fa-volume-mute'
        
    } else {
        document.querySelector('button.mute').firstChild.classList = 'fas fa-volume-up'
        
    }
}






//video speed playback listeners
let speeds = [
    {
        identifyer:'050',
        speed:0.5
    },
    {
        identifyer:'075',
        speed:0.75
    },
    {
        identifyer:'100',
        speed:1.0
    },
    {
        identifyer:'150',
        speed:1.5
    },
    {
        identifyer:'200',
        speed:2
    },
]

speeds.forEach(speed=>{
    document.querySelector(`button.speed-${speed.identifyer}`).addEventListener('click',function(){
        video.playbackRate = speed.speed
        speedControls.classList.remove('visible')
    })
})



// Speed toggler
// document.querySelector('.speed-toggler').addEventListener('click',function(){
//     speedControls.classList.toggle('visible')
// })


// fullscreen button
document.querySelector('button.fullscreen').addEventListener('click',function(){
    if(document.fullscreenElement){
        document.exitFullscreen()
        this.firstChild.classList = 'fas fa-expand'
    } else {
        openFullScreen(videoContainer)
        this.firstChild.classList = 'fas fa-compress'
    }
})

function openFullScreen(item){
    if (item.requestFullscreen) {
        item.requestFullscreen();
    } else if (item.webkitRequestFullscreen) { /* Safari */
        item.webkitRequestFullscreen();
    } else if (item.msRequestFullscreen) { /* IE11 */
        item.msRequestFullscreen();
    }
}


