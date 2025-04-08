# Storing data in the browser
## Cookies
Cookies are usually set by a web server using the response Set-Cookie HTTP header. Then, the browser automatically adds them to (almost) every request to the same domain using the Cookie HTTP header.

Limitations:
1. You can only set/update a single cookie at a time using document.cookie.
2. The name=value pair, after encodeURIComponent, should not exceed 4KB. So we can’t store anything huge in a cookie.
3. The total number of cookies per domain is limited to around 20+, the exact limit depends on the browser.

### Attributes of cookies
1. **domain**
A domain defines where the cookie is accessible. In practice though, there are limitations. We can’t set any domain. By default, a cookie is accessible only at the domain that set it.  
`domain=site.com`

> Historically, domain=.site.com (with a dot before site.com) used to work the same way, allowing access to the cookie from subdomains. Leading dots in domain names are now ignored, but some browsers may decline to set the cookie containing such dots.

To summarize, the `domain` attribute allows to make a cookie accessible at subdomains.

2. **path**
`path=/mypath`  

The URL path prefix must be absolute. It makes the cookie accessible for pages under that path. By default, it’s the current path.  

If a cookie is set with path=/admin, it’s visible on pages /admin and /admin/something, but not at /home, /home/admin or /.

3. **expires, max-age**
By default, if a cookie doesn’t have one of these attributes, it disappears when the browser/tab is closed. Such cookies are called “session cookies”  
The cookie expiration date defines the time when the browser will automatically delete it (according to the browser’s time zone).
```
expires=Tue, 19 Jan 2038 03:14:07 GMT
```

If we set expires to a date in the past, the cookie is deleted.
```
max-age=3600
```

4. **secure**
By default, if we set a cookie at http://site.com, then it also appears at https://site.com and vice versa.

That is, cookies are domain-based, they do not distinguish between the protocols.

With this attribute, if a cookie is set by https://site.com, then it doesn’t appear when the same site is accessed by HTTP, as http://site.com. So if a cookie has sensitive content that should never be sent over unencrypted HTTP, the secure flag is the right thing.


5. **samesite**
Controls whether or not a cookie is sent with cross-site requests: that is, requests originating from a different site, including the scheme, from the site that set the cookie. This provides some protection against certain cross-site attacks, including cross-site request forgery (CSRF) attacks.

- `Strict` - Send the cookie only for requests originating from the same site that set the cookie.
- `Lax` - Send the cookie only for requests originating from the same site that set the cookie, and for cross-site requests that meet both of the following criteria:  
   1. The request is a top-level navigation: this essentially means that the request causes the URL shown in the browser's address bar to change.  
       - This would exclude, for example, requests made using the fetch() API, or requests for subresources from `<img>` or `<script>` elements, or navigations inside `<iframe>` elements.  
      - It would include requests made when the user clicks a link in the top-level browsing context from one site to another, or an assignment to document.location, or a `<form>` submission.  
  2. The request uses a safe method: in particular, this excludes POST, PUT, and DELETE.
- `None` - Send the cookie with both cross-site and same-site requests. The Secure attribute must also be set when using this value.

6. **httpOnly**
Forbids JavaScript from accessing the cookie, for example, through the Document.cookie property. Note that a cookie that has been created with HttpOnly will still be sent with JavaScript-initiated requests, for example, when calling XMLHttpRequest.send() or fetch(). This mitigates attacks against cross-site scripting (XSS).


## LocalStorage, sessionStorage
Web storage objects localStorage and sessionStorage allow to save key/value pairs in the browser.

- Unlike cookies, web storage objects are not sent to server with each request. Because of that, we can store much more. Most modern browsers allow at least 5 megabytes of data (or more) and have settings to configure that.
- Also unlike cookies, the server can’t manipulate storage objects via HTTP headers. Everything’s done in JavaScript.
- The storage is bound to the origin (domain/protocol/port triplet). That is, different protocols or subdomains infer different storage objects, they can’t access data from each other.
- Both key and value must be strings.
- The limit is 5mb+, depends on the browser.
- They do not expire.
- The data is bound to the origin (domain/port/protocol).

### Local storage
- Shared between all tabs and windows from the same origin.
- The data does not expire. It remains after the browser restart and even OS reboot.

### Session storage
- The sessionStorage exists only within **the current browser** tab.
  - Another tab with the same page will have a different storage.
  - But it is shared between iframes in the same tab (assuming they come from the same origin).
- The data survives page refresh, but not closing/opening the tab.

### Storage event
When the data gets updated in localStorage or sessionStorage, storage event triggers, with properties:

- key – the key that was changed (null if .clear() is called).
- oldValue – the old value (null if the key is newly added).
- newValue – the new value (null if the key is removed).
- url – the url of the document where the update happened.
- storageArea – either localStorage or sessionStorage object where the update happened.

```
// triggers on updates made to the same storage from other documents
window.onstorage = event => { // can also use window.addEventListener('storage', event => {
  if (event.key != 'now') return;
  alert(event.key + ':' + event.newValue + " at " + event.url);
};

localStorage.setItem('now', Date.now());
```

## IndexDB
IndexedDB is a database that is built into a browser.  It's particularly useful for web applications that need to work offline, store data locally, or cache large datasets (like documents, images, or even entire apps).

It’s an asynchronous, transactional database system that stores data in key-value pairs. Unlike localStorage or sessionStorage, which are limited in size and only store strings, IndexedDB can store complex objects like arrays, blobs, files, and JavaScript objects.

### When to Use IndexedDB
- Offline-first web apps (e.g., PWAs)
- Caching API responses
- Storing user-generated data
- Saving state/data for later sync with the server
- Applications like notes, to-do lists, games, or document editors

### Examples
#### To-do list app (Offline mode)
```
const request = indexedDB.open("todoApp", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  const store = db.createObjectStore("tasks", { keyPath: "id" });
  store.createIndex("by_status", "status", { unique: false });
};

request.onsuccess = function (event) {
  const db = event.target.result;

  const transaction = db.transaction("tasks", "readwrite");
  const store = transaction.objectStore("tasks");

  store.add({ id: 1, title: "Buy milk", status: "pending" });
};

```
#### Cache API responses (for offline use)
```
async function fetchAndStoreWeather(city) {
  const response = await fetch(`https://api.weather.com/${city}`);
  const data = await response.json();

  const dbReq = indexedDB.open("weatherDB", 1);

  dbReq.onsuccess = function (event) {
    const db = event.target.result;
    const tx = db.transaction("weather", "readwrite");
    const store = tx.objectStore("weather");
    store.put({ city, data, timestamp: Date.now() });
  };
}

```

#### Store files or blobs
```
store.add({ id: 101, image: blob, name: "avatar.png" });
```

### Things to Keep in Mind
- IndexedDB is async — all operations are event-based
- You need to handle versioning carefully (onupgradeneeded)
- Browser support is very good, but there are small differences in APIs
- It's verbose — consider using wrappers like:
  - idb (a tiny IndexedDB wrapper by Jake Archibald)
  - Dexie.js (a more feature-rich wrapper)


