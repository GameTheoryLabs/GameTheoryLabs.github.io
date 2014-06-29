self.addEventListener('message', function(e) {
  self.postMessage("Worker Says: " + e.data);
}, false);

try{
  var worker = new Worker('nested.js');
  worker.addEventListener('message', function(e) {
    self.postMessage('Nested Worker said: '+ e.data);
  }, false);
  
}
catch(e){
  self.postMessage('Worker Says: Nested Worker NOT Supported');
}

    


self.postMessage('Worker Says: Online');