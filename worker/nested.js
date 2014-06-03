self.addEventListener('message', function(e) {
  self.postMessage("Online");
}, false);

self.postMessage("Online");