# Browser

## Browser environment
A platform may be a browser, or a web-server or another host, or even a “smart” coffee machine if it can run JavaScript. Each of these provides platform-specific functionality. The JavaScript specification calls that a host environment.

A host environment provides its own objects and functions in addition to the language core. Web browsers give a means to control web pages. Node.js provides server-side features, and so on. 

![image](https://github.com/user-attachments/assets/9e88e207-d3d6-4c4a-97a7-3c0d920b08ce)


### DOM
The DOM represents a document with a logical tree. Each branch of the tree ends in a node, and each node contains objects. DOM methods allow programmatic access to the tree. With them, you can change the document's structure, style, or content.

### DOM node types
1. Document
2. Element
3. Text
4. Comment
5. Attribute
6. DocumentType

[See all](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType)

### Walking the DOM
All operations on the DOM start with the document object. That’s the main “entry point” to DOM. From it we can access any node.

![image](https://github.com/user-attachments/assets/7b8d1f88-14b2-4d20-9fce-8a305c2f2d69)

#### Methods
1. `document.getElementById('id');` - returns an element by id
2. `elem.querySelector(css)` - returns the first element for the given CSS selector
3. `elem.querySelectorAll('selector')` - returns all elements inside elem matching the given CSS selector
4. `elem.matches(css)` -  does not look for anything, it merely checks if elem matches the given CSS-selector. It returns true or false.
5. `elem.closest(css)` - returns the closest ancestor that matches the CSS-selector
6. `elem.getElementsByTagName(tag)` - looks for elements with the given tag and returns the collection of them. The tag parameter can also be a star "*" for “any tags”.
7. `elem.getElementsByClassName(className)` - returns elements that have the given CSS class.
8. `document.getElementsByName(name)` - returns elements with the given name attribute, document-wide. Very rarely used.

![image](https://github.com/user-attachments/assets/f1adf83e-4212-4848-a380-52a0c682ac6a)

#### Live collections
Such collections always reflect the current state of the document and “auto-update” when it changes.

### CCSOM
The CSS Object Model is a set of APIs allowing the manipulation of CSS from JavaScript. It is much like the DOM, but for the CSS rather than the HTML. It allows users to read and modify CSS style dynamically.
![image](https://github.com/user-attachments/assets/94b9670a-b9c4-4911-8dce-5308981541af)

### BOM
There are no official standards for the Browser Object Model (BOM). Since modern browsers have implemented (almost) the same methods and properties for JavaScript interactivity, it is often referred to, as methods and properties of the BOM.

1. The Window Object
2. Window Size
3. window.open() - open a new window
4. window.close() - close the current window
5. window.moveTo() - move the current window
6. window.resizeTo() - resize the current window

## Critical rendering path
A request for a web page or app starts with an HTTP request. The server sends a response containing the HTML. The browser then begins parsing the HTML, converting the received bytes to the DOM tree. The browser initiates requests every time it finds links to external resources, be it stylesheets, scripts, or embedded image references. Some requests are blocking, which means the parsing of the rest of the HTML is halted until the imported asset is handled. The browser continues to parse the HTML making requests and building the DOM, until it gets to the end, at which point it constructs the CSS object model. With the DOM and CSSOM complete, the browser builds the render tree, computing the styles for all the visible content. After the render tree is complete, layout occurs, defining the location and size of all the render tree elements. Once complete, the page is rendered, or 'painted' on the screen.

1. **Parsing HTML**  
Parsing HTML is the first step in the rendering process. When the browser receives an HTML document, it parses the HTML code to create a tree-like structure called the Document Object Model (DOM). The DOM represents the web page's structure and includes all of the elements and attributes defined in the HTML code.

2. **Parsing CSS**  
The second step in the rendering process is parsing CSS. The browser takes the CSS code associated with the page and creates a separate tree-like structure known as the CSS Object Model (CSSOM). The CSSOM contains all of the style rules defined in the CSS code.

3. **Constructing the Rendering Tree**  
After the browser has created the DOM and CSSOM, it combines the two to create the Rendering Tree. The Rendering Tree combines the DOM and CSSOM, representing the elements on the page and their associated styles.

4. **Layout**  
The Layout step is where the browser calculates the position and size of each element in the Rendering Tree. This is based on the styles defined in the CSS code and the content of the DOM. The Layout step is important for determining the placement of each element on the screen and ensuring that the page displays correctly.

5. **Painting**  
Once the Layout has been calculated, the browser moves on to the Painting step. Painting involves filling in each element with color and creating an image of the page to be displayed on the screen. The browser uses the styles and layout information to paint each element in the Rendering Tree.

6. **Compositing**  
Finally, in the Compositing step, the browser combines all of the painted elements into a final image. This image is then displayed on the screen, completing the rendering process.

![image](https://github.com/user-attachments/assets/f16d80fa-3b0b-4931-ae8d-09e79a9373fb)

### Blocking parsing proccess
| Resource / Tag                   | Blocks Parsing | Blocks Rendering | Notes                                                                 |
|----------------------------------|----------------|------------------|-----------------------------------------------------------------------|
| `<script>` (without async/defer) | ✅ Yes         | ✅ Yes           | Halts parsing until script is downloaded and executed                |
| `<script async>`                 | ❌ No          | ✅ Yes (if runs early) | Parses HTML in parallel; script runs immediately when ready         |
| `<script defer>`                | ❌ No          | ❌ No            | Parses HTML in parallel; script runs after HTML is fully parsed      |
| `<link rel="stylesheet">`       | ❌ No          | ✅ Yes           | Parsing continues, but rendering is blocked until CSS is ready       |
| `<style>` (inline CSS)          | ❌ No          | ✅ Yes           | Immediate application; rendering blocked until CSSOM is ready        |
| `<img>`                         | ❌ No          | ❌ No            | Loaded asynchronously; doesn't block parsing or rendering            |
| Fonts (`@font-face`)            | ❌ No          | ⚠️ Sometimes     | May delay text rendering depending on browser behavior (FOIT/FOUT)   |
| `<video>`, `<audio>`            | ❌ No          | ❌ No            | Loaded asynchronously                                                 |
| JavaScript that modifies DOM/CSS| ⚠️ Sometimes   | ✅ Yes           | If the browser suspects layout changes, it may delay rendering        |


### Hooks
| Event            | When It Fires                                                | Waits For Resources? | Common Use Cases                                 | Can Prevent Navigation? |
|------------------|--------------------------------------------------------------|-----------------------|--------------------------------------------------|--------------------------|
| `DOMContentLoaded` | After HTML is fully parsed and DOM is ready                 | ❌ No                 | Initialize UI, attach event listeners            | ❌ No                    |
| `load`           | After all resources (images, styles, fonts) are fully loaded | ✅ Yes                | Start animations, remove loading indicators      | ❌ No                    |
| `beforeunload`   | Just before user leaves or reloads the page                  | ✅ Yes (briefly)      | Warn user about unsaved changes                  | ✅ Yes                   |
| `unload`         | When the page is unloading (after `beforeunload`)            | ❌ No                 | Send analytics, clean up (use `navigator.sendBeacon`) | ❌ No                    |



### Sources
https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work  
https://medium.com/@regondaakhil/the-anatomy-of-browser-rendering-how-web-pages-come-to-life-6fa9e801a3f  
https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path

## Reflow/Repaint
**Reflow** (also known as layout) is the process where the browser calculates the position and size of elements in the DOM.

Reflow is triggered when changes affect the document’s structure or geometry. Examples:
- Adding or removing elements from the DOM
- Changing element dimensions (width, height, padding, margin, etc.)
- Changing font size
- Changing the window size (resize event)
- Changing display properties (like from none to block)
- Changing position properties (like position, top, left, etc.)


**Repaint** is when the browser redraws elements on the screen, usually because of a visual style change that does not affect layout.  
Triggers include:

- Changing color, background-color, visibility, border-color
- Applying a shadow or outline
- Changing opacity
- Changing transform or box-shadow

### Animation and transitions
Reflow-triggering animations/transitions
If you animate layout-affecting properties, it will trigger reflow on every frame.

Examples (cause reflow):
- width, height
- padding, margin
- top, left, right, bottom
- line-height
- font-size
- border-width
- display (though it's not animatable, changes can cause reflow)

> Animating these causes the browser to recalculate the layout repeatedly → bad for performance.

Repaint-only animations/transitions
If you animate visual-only properties, it will trigger repaint, but not reflow.

Examples (cause repaint only):
- color, background-color, visibility
- border-color
- box-shadow
- text-decoration

> Less expensive than reflow, but still not free.

**GPU-accelerated (compositor-only) animations**  
Some CSS properties are handled by the GPU, meaning they don’t trigger reflow or repaint, and are very performance-friendly.

Examples (compositor only):
- transform (e.g., translate, scale, rotate)
- opacity

> These are the best to animate when performance matters. Smooth and offloaded to the GPU.

| Property Type             | Triggers Reflow | Triggers Repaint | GPU Accelerated |
|--------------------------|-----------------|------------------|-----------------|
| `width`, `height`, `top` | ✅              | ✅               | ❌              |
| `color`, `box-shadow`    | ❌              | ✅               | ❌              |
| `opacity`, `transform`   | ❌              | ❌               | ✅              |


## Request Animation Frame
`requestAnimationFrame` is a method in JavaScript that tells the browser to execute a callback function before the next repaint. 

Use Cases:
1. Smooth animations: Moving elements on the screen (e.g., a bouncing ball, progress bars).
2. Game loops: Continuously updating game objects and rendering frames.
3. Scrolling animations: Parallax effects or lazy loading based on scroll position.
4. Performance optimizations: Batch updates for UI elements to avoid layout thrashing.


```
function animateBox(timestamp) {
  box.style.transform = `translateX(${Math.sin(timestamp / 500) * 100}px)`;
  requestAnimationFrame(animateBox);
}

requestAnimationFrame(animateBox);
```

### What's the difference with `transition`
- Use `rAF` when you need real-time control or need to animate complex interactions that involve continuous updates or state changes.
- Use `transition` for simple animations triggered by CSS changes, such as hover effects or changes in layout properties.

## Request Idle callback
The `window.requestIdleCallback()` method queues a function to be called during a browser's idle periods. This enables developers to perform background and low priority work on the main event loop, without impacting latency-critical events such as animation and input response

Use Cases:
1. Non-urgent tasks: It’s great for tasks that can be deferred, like lazy loading content, preloading resources, or doing background calculations.
2. Performance optimization: It helps to avoid blocking the main thread, ensuring that the page remains responsive even when doing background work.
3. Low-priority work: Tasks like analytics logging, saving data to local storage, or sending analytics requests after user interaction.

```
requestIdleCallback(() => {
  console.log('Doing some background work');
}, { timeout: 1000 }); // The specify the maximum amount of time you're willing to wait for the idle period

```
