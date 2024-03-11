const React = require('react');
import { extractFramesFromVideo } from './ExtractFrames';

/**
 * 
 * @returns React.Component 
 */
function Loading() {
    return <div style={{
        marginLeft: '50%',
        transform: "translate(-50%, 0)"
    }}><svg style={{ margin: 'auto', display: 'block', shapeRendering: 'auto' }} width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="50" cy="50" r="32" strokeDidth="8" stroke="#0a0a0a" strokeDasharray="50.26548245743669 50.26548245743669" fill="none" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
            </circle>
            <circle cx="50" cy="50" r="23" stroke-width="8" stroke="#28292f" strokeDasharray="36.12831551628262 36.12831551628262" strokeDashoffset="36.12831551628262" fill="none" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 50;-360 50 50"></animateTransform>
            </circle>
        </svg></div>
}

/**
 * 
 * @param {
 * width,
 * height,
 * velocity,
 * fps,
 * elements,
 * src
 * } param0 
 * @returns 
 */
export function VideoScroller({
    src = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    width = 1200, height = 720, fps = 12,
    elements = [],
    customLoading}) {
    const ref = React.useRef(null)
    const [loading,setLoading] = React.useState(false);
    const [prevScrollY, setPrevScrollY] = React.useState(0)
    const [videoFrames, setVideoFrames] = React.useState([])
    const [fixedCanvas, setFixedCanvas] = React.useState(false); // State to track if the canvas should be fixed
    const [initCanvaTop, setInitCanvaTop] = React.useState(0)
    if (!src) {
        return null; // Don't render anything if src prop doesn't exist
      }
    React.useEffect(() => {
        // Extract Video Frames
        setLoading(true)
        extractFramesFromVideo(src, fps)
            .then((frames) => {
                // Seting Stracted Video Frames
                setVideoFrames(frames)
                setLoading(false)
                console.log('Frames extracted successfully:')
            })
            .catch((error) => {
                console.error('Error extracting frames:', error)
                setLoading(false)
            })
    }, []);

    React.useEffect(() => {
        const canvas = ref.current
        const ctx = canvas.getContext('2d')
        const image = new Image()
        image.src =
            videoFrames[0]
        image.onload = () => {
            ctx.drawImage(image, 0, 0, width, height)
        }
    }, [videoFrames]);

    React.useEffect(() => {
        const canvas = ref.current
        const ctx = canvas.getContext('2d')
        let requestId

        // Event listener for scroll
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            const canvasTop = canvas.getBoundingClientRect().top; // Get canvas top position relative to viewport
            //Init the canva top
            if (initCanvaTop < canvas.getBoundingClientRect().top)
                setInitCanvaTop(canvasTop)

            const contentHeight = videoFrames.length * 100;

            // Check if the scroll position has significantly changed
            if (Math.abs(currentScrollY - prevScrollY) > 2) {
                // Clear previous requestAnimationFrame
                cancelAnimationFrame(requestId)

                // Check if the canvas should be fixed
                const shouldFixCanvas = currentScrollY - initCanvaTop > 0 && canvasTop < 50 && currentScrollY < contentHeight;

                // Request a new animation frame for drawing
                requestId = requestAnimationFrame(() => {
                    if (shouldFixCanvas) {
                        // Clear previous drawings
                        //ctx.clearRect(0, 0, canvas.width, canvas.height)
                        
                        // Draw new image based on scroll position
                        const image = new Image()
                        image.src =
                            videoFrames[Math.floor((currentScrollY - initCanvaTop) / 100) % videoFrames.length]
                        image.onload = () => {
                            ctx.drawImage(image, 0, 0, width, height)
                        }
                    }
                    // Update previous scroll position
                    setPrevScrollY(currentScrollY)
                    // Update state to fix/unfix the canvas
                    setFixedCanvas(shouldFixCanvas);
                })
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            cancelAnimationFrame(requestId)
        }
    }, [prevScrollY])

    return (loading? (customLoading || <Loading />):
        <div style={{ height: videoFrames.length * 100 }}>
            <canvas
                style={{
                    position: fixedCanvas ? 'fixed' : 'absolute', top: fixedCanvas ? 0 : 'auto', left: '50%',
                    transform: "translate(-50%, 0)",
                }}
                ref={ref}
                width={width}
                height={height}
            ></canvas>
            {
                elements.map(element => <div
                    style={{
                        width: '100%',
                        position: 'absolute', zIndex: 999,
                        top: (element.position / 100) * (videoFrames.length * 100)
                    }}
                >{element.element}</div>)
            }
        </div>
    )
}
