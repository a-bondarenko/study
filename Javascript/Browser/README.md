# Browser

## Critical Render Path

## Reflow/Repaint
// TODO

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