var net = require('net');
var io  = require('socket.io').listen(8080, { log: false });

var view = null; // All change request are sent to this browser

var rConsole = {
    log: function(value){
        console.log(value);
        
        try{
            for(var i = rConsole.consoles.length - 1; i >= 0; i--){
                rConsole.consoles[i].send(value);
            }
        }
        catch(e){
            consoles.log("Error writing to remotes: " + e.toString());
        }
        
        
    },
    add: function(ws){
        ws.rconsoleID = rConsole.next++;
        ws.rConsole = true;
        rConsole.consoles.push(ws);
    },
    remove: function(ws){
        
        for(var i = rConsole.length - 1; i >= 0; i--){
            if(rConsole.consoles[i].rconsoleID == ws.rconsoleID){
                rConsole.consoles.splice(i, 1);
                break;
            }
        }
    },
    next: 0,
    consoles: []
}

var server = net.createServer(function(socket){
    socket.name = socket.remoteAddress + ":" + socket.remotePort
    socket.write("Connected, Send Color\n");
    rConsole.log("TCP Connection from: " + socket.name);
    
    socket.on('data', function(data){
        rConsole.log("Got TCP Data: " + data);
        
        try{
            
            if(view != null){
                view.send({type: "SETCOLOR", data: data.toString()});
            }
        }
        catch(e){
            rConsole.log("TCP Error Sending To View");
            rConsole.log(e.toString());
        }
        

    });
    
    socket.on('end', function(){
        rConsole.log("End TCP Connection from: " + socket.name);
    });
    
    socket.on('close', function(){
        rConsole.log("Closed TCP Connection from: " + socket.name);
    });
    
    socket.on('error', function(){
        rConsole.log("TCP Error on Socket from: " + socket.name);
    });
});
io.sockets.on('connection', function(webSocket){

    rConsole.log("Got a WebSocket Connection");
    
    webSocket.on('message', function(msg){
        rConsole.log("WebSocket: " + msg);
        
        if(msg == "REGISTER"){
            view = this;
        }
        else if(msg == "CONSOLE"){
            
            rConsole.add(this);
        }
        else{
            try{
                
                if(view != null){
                    view.send({type: "SETCOLOR", data: msg});
                }
            }
            catch(e){
                rConsole.log("WebSocket Broadcast Error");
                rConsole.log(e.toString());
            }
        }
        
        
    });
    webSocket.on('disconnect', function(){
        if(this.rConsole){
            rConsole.remove(this);
        }
        rConsole.log("WebSocket Disconnected");
    });
    webSocket.on('error', function(e){
        rConsole.log("WebSocket Error" + e.toString())
    });
});


server.listen(8000);
rConsole.log("WebSocket Server listening on port 8080");
rConsole.log("TCP Server listening on port 8000");