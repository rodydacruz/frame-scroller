/**
 * 
 * @param {*} videoUrl
 * @param {*} fps
 * @returns 
 */
export function extractFramesFromVideo(videoUrl,fps) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.crossOrigin = 'anonymous'
      video.src = videoUrl
      video.muted = true
      video.autoplay = true

      const frames = []

      video.onloadeddata = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const captureFrame = () => {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          const imageDataURL = canvas.toDataURL('image/png')
          frames.push(imageDataURL)

          if (video.currentTime < video.duration) {
            video.currentTime += 1 / video.framesPerSecond // Skip to the next frame
            setTimeout(captureFrame, 0)
          } else {
            resolve(frames)
          }
        }

        video.framesPerSecond = fps // Adjust frames per second as needed
        captureFrame()
      }

      video.onerror = (error) => {
        reject(error)
      }
    })
  }