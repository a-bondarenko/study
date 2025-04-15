# Frames and widnows

## Popups and window methods
A popup window is one of the oldest methods to show additional document to user.

### Method window.open
```
window.open(url, name, params);
```

- `url`:  
  The URL to open in the new window. Can be absolute or relative.

- `name`:  
  The name of the new window. If a window with the same name already exists, the URL is loaded into it.  
  Special values:
  - `_blank`: Opens in a new window/tab.
  - `_self`: Opens in the same frame as it was clicked.
  - `_parent`, `_top`: Open in parent/top frame.

- `params`:  
  A comma-separated list of configuration options that define the appearance and behavior of the popup window.

#### Common `params` options:

- `width` and `height`:  
  Width and height of the popup window (in pixels).

- `left` and `top`:  
  Position of the window on the screen (in pixels).

- `resizable` (yes|no):  
  Whether the user can resize the window.

- `scrollbars` (yes|no):  
  Whether scrollbars should appear if the content overflows.

- `menubar` (yes|no):  
  Whether the browser's menu bar should be shown.

- `toolbar` (yes|no):  
  Whether the browser's toolbar (back/forward/reload/etc.) should be visible.

- `location` (yes|no):  
  Whether to display the address field.

- `status` (yes|no):  
  Whether to display the status bar at the bottom.

- `fullscreen` (yes|no):  
  If allowed by the browser, opens the window in fullscreen mode.



### Popup Blocking
Historically, malicious websites exploited popups to display numerous unwanted ads, leading modern browsers to implement popup blocking mechanisms. Most browsers now restrict popups initiated outside of user-triggered event handlers like onclick.

```
// Popup blocked
window.open('https://javascript.info');

// Popup allowed
button.onclick = () => {
  window.open('https://javascript.info');
};

```

### Accessing the Opener Window
A popup can reference its parent window using the window.opener property. This allows for interaction between the popup and the window that opened it. For example:
```
let newWin = window.open('about:blank', 'hello', 'width=200,height=200');

newWin.document.write(
  "<script>window.opener.document.body.innerHTML = 'Test'<\/script>"
);

```
However, such interactions are subject to the same-origin policy, meaning both windows must share the same protocol, domain, and port to access each other's content freely.

### Closing a Popup
```
let newWindow = window.open('https://javascript.info/', 'example', 'width=300,height=300');

// Close the new window
newWindow.close();
```


## Cross-window communication
The “Same Origin” (same site) policy limits access of windows and frames to each other.  

The “Same Origin” policy states that:

- if we have a reference to another window, e.g. a popup created by window.open or a window inside `<iframe>`, and that window comes from the same origin, then we have full access to that window.
- otherwise, if it comes from another origin, then we can’t access the content of that window: variables, document, anything. The only exception is location: we can change it (thus redirecting the user). But we cannot read location (so we can’t see where the user is now, no information leak).


There are several ways to communicate between two browser tabs or windows in a web application.

### LocalStorage Events
Tab A
```
localStorage.setItem('message', 'Hello from Tab A');
```
Tab B
```
window.addEventListener('storage', (event) => {
  if (event.key === 'message') {
    console.log('Received:', event.newValue);
  }
});

```

### BroadcastChannel API
```
const channel = new BroadcastChannel('my_channel');

channel.onmessage = (event) => {
  console.log('Received:', event.data);
};

// Send a message
channel.postMessage('Hello from another tab!');
```

### SharedWorker
```
onconnect = function (e) {
  const port = e.ports[0];
  port.onmessage = function (event) {
    // Echo message to all connected ports
    port.postMessage('From SharedWorker: ' + event.data);
  };
};


const worker = new SharedWorker('shared-worker.js');
worker.port.start();

worker.port.onmessage = (e) => {
  console.log(e.data);
};

worker.port.postMessage('Hello from a tab');

```


### Service Workers + PostMessage
```
navigator.serviceWorker.controller.postMessage('Hello from tab');

self.addEventListener('message', async (event) => {
  const allClients = await clients.matchAll();
  for (const client of allClients) {
    client.postMessage('Received: ' + event.data);
  }
});
```

### Window.open + window.postMessage
If one tab opens another using window.open, you can use postMessage for direct communication.

Tab A
```
const child = window.open('child.html');

child.onload = () => {
  child.postMessage('Hello from parent', '*');
};

window.addEventListener('message', (event) => {
  console.log('From child:', event.data);
});
```

Tab B
```
window.addEventListener('message', (event) => {
  console.log('From parent:', event.data);
  event.source.postMessage('Hello back from child', event.origin);
});

```

| Method                   | Same Origin | Multi-tab | Simplicity | Browser Support     |
|--------------------------|-------------|-----------|------------|----------------------|
| LocalStorage             | ✅          | ✅        | ✅ Easy    | ✅ Wide              |
| BroadcastChannel         | ✅          | ✅        | ✅ Easy    | ⚠️ Modern only       |
| SharedWorker             | ✅          | ✅        | ⚠️ Medium  | ⚠️ Partial           |
| Service Worker           | ✅          | ✅        | ⚠️ Advanced| ✅ Wide              |
| postMessage (window.open)| ✅          | ⚠️ Only opened tabs | ⚠️ Medium | ✅ Wide    |






