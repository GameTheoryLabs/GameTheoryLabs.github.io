self.addEventListener('message', function(e) {
  self.postMessage("Worker Says: " + e.data);
}, false);

var worker = new Worker('nested.js');
    
worker.addEventListener('message', function(e) {
    self.postMessage('Nested Worker said: '+ e.data);
  }, false);