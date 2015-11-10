self.addEventListener('message', function(e) {
  self.postMessage("Nested Worker Online");
}, false);

self.postMessage("Online");