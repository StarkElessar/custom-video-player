function vPlayerInit() {
  const player = document.querySelector('[data-v-player]')

  if (player) {
    const video = player.querySelector('video')
    const timeline = player.querySelector('.v-player-timeline')
    const progressBar = player.querySelector('[data-progres-bar]')
    const muteVideoButton = player.querySelector('[data-mute]')
    const volumeSlider = player.querySelector('[data-volume]')
    const currentTimePlaceholder = player.querySelector('[data-current-time]')
    const durationPlaceholder = player.querySelector('[data-duration]')
    const playPauseButton = player.querySelector('[data-play]')
    const skipBackwardButton = player.querySelector('[data-skip-backward]')
    const skipForwardButton = player.querySelector('[data-skip-forward]')
    const playbackSpeedButton = player.querySelector('[data-speed-button]')
    const speedOptionsContent = player.querySelector('.v-player-controls__speed-options')
    const inWindowButton = player.querySelector('[data-in-window]')
    const fullscreenButton = player.querySelector('[data-fullscreen]')

    document.addEventListener('click', handleDocumentClick)
    document.addEventListener('mouseup', handleDocumentMouseUp)
    player.addEventListener('keydown', handlePlayerKeyDown)
    player.addEventListener('dblclick', handlePlayerDoubleClick)
    timeline.addEventListener('click', handleTimelineClick)
    timeline.addEventListener('mousedown', handleTimelineMouseDown)
    timeline.addEventListener('mousemove', handleTimelineMove)
    muteVideoButton.addEventListener('click', handleMuteButtonClick)
    volumeSlider.addEventListener('input', handleVolumeSliderInput)
    volumeSlider.addEventListener('mouseover', handleVolumeSliderMouseOver)
    volumeSlider.addEventListener('mouseout', handleVolumeSliderMouseOut)
    skipBackwardButton.addEventListener('click', handleSkipBackwardButtonClick)
    playPauseButton.addEventListener('click', handlePlayPauseButtonClick)
    skipForwardButton.addEventListener('click', handleSkipForwardButtonClick)
    playbackSpeedButton.addEventListener('click', handlePlaybackSpeedButtonClick)
    speedOptionsContent.addEventListener('click', handleSpeedOptionsClick)
    speedOptionsContent.addEventListener('mouseout', handleSpeedOptionsMouseOut)
    inWindowButton.addEventListener('click', handleInWindowButtonClick)
    fullscreenButton.addEventListener('click', handleFullscreenButtonClick)
    video.addEventListener('click', handleVideoClick)
    video.addEventListener('play', handleVideoPlay)
    video.addEventListener('pause', handleVideoPause)
    video.addEventListener('timeupdate', handleVideoTimeUpdate)
    video.addEventListener('loadeddata', handleVideoLoadedData)

    const formatTime = (seconds) => {
      const isoTime = new Date(seconds * 1000).toISOString()
      const withHours = isoTime.substring(11, 13) !== '00'
      const [from, to] = withHours ? [11, 19] : [14, 19]

      return isoTime.substring(from, to)
    }

    const setPlayPause = () => (video.paused ? video.play() : video.pause())

    const setRewindVideo = (direction, stepSeconds = 10) => {
      if (direction === 'next') video.currentTime += stepSeconds
      else video.currentTime -= stepSeconds
    }

    const draggableProgressBar = ({ offsetX }) => {
      const timelineWidth = timeline.clientWidth

      player.classList.add('_draggable')
      progressBar.style.width = `${offsetX}px`
      video.currentTime = (offsetX / timelineWidth) * video.duration
      currentTimePlaceholder.innerText = formatTime(video.currentTime)
    }

    const changeVolumeOnScroll = (event) => {
      event.preventDefault()
      const { target, deltaY } = event

      if (deltaY < 0) {
        if (video.volume <= 0.9) {
          video.volume += 0.1
          target.value = video.volume
          target.style.setProperty('--value', target.value)
        } else {
          video.volume = 1
          target.value = video.volume
          target.style.setProperty('--value', target.value)
        }
      } else {
        if (video.volume >= 0.1) {
          video.volume -= 0.1
          target.value = video.volume
          target.style.setProperty('--value', target.value)
        } else {
          video.volume = 0
          target.value = video.volume
          target.style.setProperty('--value', target.value)
        }
      }

      if (video.volume) {
        player.classList.replace('_v-sound-off', '_v-sound-on')
      } else {
        player.classList.replace('_v-sound-on', '_v-sound-off')
      }
    }

    volumeSlider.value = video.volume = 0.8
    volumeSlider.style.setProperty('--value', volumeSlider.value)
    volumeSlider.style.setProperty('--min', volumeSlider.min == '' ? '0' : volumeSlider.min)
    volumeSlider.style.setProperty('--max', volumeSlider.max == '' ? '1' : volumeSlider.max)

    let lastVolumeValue = video.volume

    function handlePlayerKeyDown({ code }) {
      const keyDownMapping = {
        'Space': () => setPlayPause(),
        'KeyK': () => setPlayPause(),
        'KeyJ': () => setRewindVideo('back'),
        'KeyL': () => setRewindVideo('next'),
        'KeyL': () => setRewindVideo('next'),
        'ArrowUp': () => {
          if (video.volume <= 0.9) {
            video.volume += 0.1
            volumeSlider.value = video.volume
            volumeSlider.style.setProperty('--value', volumeSlider.value)
          } else {
            video.volume = 1
            volumeSlider.value = video.volume
            volumeSlider.style.setProperty('--value', volumeSlider.value)
          }
          
          if (video.volume) {
            player.classList.replace('_v-sound-off', '_v-sound-on')
          } else {
            player.classList.replace('_v-sound-on', '_v-sound-off')
          }
        },
        'ArrowDown': () => {
          if (video.volume >= 0.1) {
            video.volume -= 0.1
            volumeSlider.value = video.volume
            volumeSlider.style.setProperty('--value', volumeSlider.value)
          } else {
            video.volume = 0
            volumeSlider.value = video.volume
            volumeSlider.style.setProperty('--value', volumeSlider.value)
          }

          if (video.volume) {
            player.classList.replace('_v-sound-off', '_v-sound-on')
          } else {
            player.classList.replace('_v-sound-on', '_v-sound-off')
          }
        }
      }
      
      return keyDownMapping[code] ? keyDownMapping[code]() : null
    }

    function handlePlayerDoubleClick({ target }) {
      if (target.closest('.v-player__bottom')) return
      
      handleFullscreenButtonClick()
    }

    function handleDocumentClick({ target }) {
      if (
        !target.closest('.v-player-controls__speed-options') &&
        !target.closest('[data-speed-button]')
      ) {
        playbackSpeedButton.classList.remove('_show')
      }
    }

    function handleDocumentMouseUp() {
      document.removeEventListener('mousemove', draggableProgressBar)
      player.classList.remove('_draggable')
    }

    function handleTimelineClick({ offsetX }) {
      const timelineWidth = timeline.clientWidth

      video.currentTime = (offsetX / timelineWidth) * video.duration
    }

    function handleTimelineMouseDown() {
      document.addEventListener('mousemove', draggableProgressBar)
    }

    function handleTimelineMove({ offsetX }) {
      const progressTime = timeline.querySelector('.v-player-timeline__time')
      const timelineWidth = timeline.clientWidth
      const percentDuration = (offsetX / timelineWidth) * video.duration

      progressTime.innerText = formatTime(percentDuration)
      progressTime.style.left = `${offsetX}px`

      const { right: playerRight, left: playerLeft } = player.getBoundingClientRect()
      const { right: progressTimeRight, left: progressTimeLeft } = progressTime.getBoundingClientRect()

      if (playerRight - progressTimeRight <= 10) {
        progressTime.style.left = `${timelineWidth - 40}px`
      }

      if (progressTimeLeft - playerLeft <= 10) {
        progressTime.style.left = `${40}px`
      }
    }

    function handleMuteButtonClick() {
      if (player.classList.contains('_v-sound-on')) {
        player.classList.replace('_v-sound-on', '_v-sound-off')
        lastVolumeValue = video.volume
        volumeSlider.value = video.volume = 0
        volumeSlider.style.setProperty('--value', 0)
      } else {
        player.classList.replace('_v-sound-off', '_v-sound-on')
        volumeSlider.value = video.volume = lastVolumeValue
        volumeSlider.style.setProperty('--value', lastVolumeValue);
      }
    }

    function handleVolumeSliderInput({ target: { value } }) {
      video.volume = value

      this.style.setProperty('--value', value);

      if (video.volume) {
        player.classList.replace('_v-sound-off', '_v-sound-on')
      } else {
        player.classList.replace('_v-sound-on', '_v-sound-off')
      }
    }

    function handleVolumeSliderMouseOver() {
      document.addEventListener('wheel', changeVolumeOnScroll, { passive: false })
    }

    function handleVolumeSliderMouseOut() {
      document.removeEventListener('wheel', changeVolumeOnScroll)
    }

    function handlePlayPauseButtonClick() {
      setPlayPause()
    }

    function handleSkipBackwardButtonClick() {
      setRewindVideo('back')
    }

    function handleSkipForwardButtonClick() {
      setRewindVideo('next')
    }

    function handleVideoClick() {
      setPlayPause()
    }

    function handleVideoPlay() {
      player.classList.replace('_v-pause', '_v-play')
    }

    function handleVideoPause() {
      player.classList.replace('_v-play', '_v-pause')
    }

    function handleVideoTimeUpdate({ target }) {
      const { currentTime, duration } = target
      const percentDuration = (currentTime / duration) * 100

      progressBar.style.width = `${percentDuration}%`
      currentTimePlaceholder.innerText = formatTime(currentTime)
    }

    function handleVideoLoadedData({ target: { duration } }) {
      durationPlaceholder.innerText = formatTime(duration)
    }

    function handlePlaybackSpeedButtonClick() {
      playbackSpeedButton.classList.toggle('_show')
    }

    function handleSpeedOptionsClick({ target }) {
      if (target.hasAttribute('data-speed')) {
        this.querySelector('._active').classList.remove('_active')
        video.playbackRate = target.dataset.speed
        target.classList.add('_active')
      }
    }

    function handleSpeedOptionsMouseOut({ toElement }) {
      if (!toElement.closest('[data-speed]')) {
        setTimeout(() => {
          playbackSpeedButton.classList.remove('_show')
        }, 500)
      }
    }

    function handleInWindowButtonClick() {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture()
      } else {
        video.requestPictureInPicture()
      }
      player.classList.remove('_fullscreen')
    }

    function handleFullscreenButtonClick() {
      if (!document.fullscreenElement) {
        player.classList.add('_fullscreen')
        player.requestFullscreen();

        if (document.pictureInPictureElement) {
          document.exitPictureInPicture()
        }
      } else if (document.exitFullscreen) {
        player.classList.remove('_fullscreen')
        document.exitFullscreen();
      }
    }
  }
}

vPlayerInit()
