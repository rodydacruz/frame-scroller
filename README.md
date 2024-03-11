# VideoScroller Component

The `VideoScroller` component is a React component that allows you to create a scrolling effect synchronized with a video. It renders a canvas element on which frames of the provided video are drawn based on the user's scroll position. Additionally, it allows for the placement of custom elements at specific scroll positions.

## Installation

You can install the `VideoScroller` component via npm:

```bash
npm install frame-scroller
```

## Usage

Here's how you can use the `VideoScroller` component in your React application:

```jsx
import React from 'react';
import { VideoScroller } from 'frame-scroller';

const App = () => {
  const videoSrc = 'path/to/your/video.mp4';

  // Define elements to be rendered at specific scroll positions
  const elements = [
    { position: 50, element: <div>Your custom element at 50% scroll</div> },
    { position: 75, element: <div>Another custom element at 75% scroll</div> },
  ];

  return (
    <div>
      <h1>Video Scroller Example</h1>
      <VideoScroller src={videoSrc} elements={elements} />
    </div>
  );
};

export default App;
```

## Props

- `src` (string, required): The URL or path to the video file.
- `width` (number, optional): The width of the canvas element. Default is `1200`.
- `height` (number, optional): The height of the canvas element. Default is `720`.
- `fps` (number, optional): Frames per second to extract from the video. Default is `12`.
- `elements` (array, optional): An array of custom elements to be rendered at specific scroll positions. Each element should be an object with `position` (number) and `element` (React element) properties.


## License

This component is licensed under the MIT License. Feel free to use it in your projects!