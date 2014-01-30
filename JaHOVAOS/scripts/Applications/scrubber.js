
var Scrubber = function(){
    Input = {
        Mouse: {
            startX: 0,
            startY: 0,
            pressed: false,
            startTime: 0,
            deg: 0
        }
    }
    //container = document.createElement("div");
    //container.id = "container";
    //container.style.webkitTransform = "perspective( 600px )";
    //document.appendChild(container);
    
    video =  document.createElement("video");
    video.style.webkitTransform = "perspective( 600px )";// rotateY( 45deg );
    video.id = "video";
    video.src = "images/splash.m4v";
    video.setAttribute('preload', 'auto');
    video.setAttribute('autoplay', 'autoplay');
    video.setAttribute('loop', 'loop');
    video.style.width = "600px";
    video.style.height = "360px";
    video.style.display = "block";
    video.style.position = "absolute";
    video.style.left = ((window.innerWidth / 2) - 300).toFixed(0) + "px";
    video.style.top =  ((window.innerHeight / 2) - 180).toFixed(0)  + "px";
    window.ontouchstart = function(e){
        video.play();
        window.ontouchstart = function(e){
            e.preventDefault();
    
            video.pause();
            timeOfStart = (new Date().getTime());
            timeOfEnd = timeOfStart;
    
            Input.Mouse.startX = e.touches[0].pageX;
            Input.Mouse.startY = e.touches[0].pageY;
            Input.Mouse.startTime = video.currentTime;
        }


    }
    
    window.ontouchmove = function(e){
        e.preventDefault();
            
        //finalXPosition[0] = e.touches[0].pageX;
        var rot = (e.touches[0].pageX - Input.Mouse.startX) * 0.05;// < 0 ? Input.Mouse.deg-- : Input.Mouse.deg++;
        //Input.Mouse.startX = e.touches[0].pageX;
        document.getElementById("video").style.webkitTransform = "perspective(600px) rotateY("+ rot +"deg)";//"perspective(600px) rotateZ("+ ((e.touches[0].pageX - Input.Mouse.startX) * 0.1) +")"
        //var dt = ((e.touches[0].pageY - Input.Mouse.startY)* 0.1);
        //dt = dt < 0 ? 0 : dt;
        //var current  = video.currentTime;
        //var time = (dt + current) < 0 ? 0 : dt + current;
        //time  = time > video.duration ? video.duration : time;
        document.getElementById("video").currentTime = Input.Mouse.startTime + ((e.touches[0].pageY - Input.Mouse.startY)* 0.001);//dt < 0 ? video.currentTime - 0.01 : video.currentTime + 0.01;
    }
    
    window.ontouchend = function(e){
        //dx[0] = finalXPosition[0] - initalXPosition[0];
        //dx[1] = finalXPosition[1] - initalXPosition[1];
        //
        //dy[0] = finalYPosition[0] - initalYPosition[0];
        //dy[1] = finalYPosition[1] - initalYPosition[1];
        video.play();

        
        
    }


    //os.splash.addEventListener("mousedown", onMouseDown, false);
    //document.addEventListener("mouseup", onMouseUp, false);
    //document.addEventListener("mousemove", onMouseMove, false);
    
     //video.addEventListener('ended', function(e) {
     //   video.play()
     //   }, false);
     
    
    document.body.appendChild(video);
    
    //os.splash.currentTime = 2.0
}