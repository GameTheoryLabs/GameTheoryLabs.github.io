window.onload = function(){
    //Have to create canvas with JavaScript for Ludei to work properly
    var canvas = document.createElement("canvas");
    canvas.id = "background";
    canvas.className = "background";
    document.body.appendChild(canvas);
    
    
    psl = com.playstylelabs.Instance();
    
    psl.Demo = function(){
        //
        //  Load Image       
        //
        bkgrnd = psl.Graphics.LoadImage("images/backgrounds/Level_1.png", function(){
                psl.Entity.canvas.width = 1024; //"1024px";
                psl.Entity.canvas.height = 768; //"768px";
                psl.Entity.ctx.drawImage(bkgrnd.html, 0, 0);
                
                psl.Entity.canvas.width = 1024; //"1024px";
                psl.Entity.canvas.height = 768; //"768px";
                
            });    
        
        //
        //  Audio
        //
        var parameters = {
            urls: ['sounds/dog-bark.mp3'],
            autoplay: true,
            loop: false,
            volume: 0.5,
            onend: function() {
              //alert('Finished!');
            }
        }
        psl.Audio.Load("bark", parameters);
        parameters.autoplay = false;
        parameters.urls = ['sounds/button-click.wav'];
        psl.Audio.Load("click", parameters);
        //psl.Audio.Play("click");
        
        //
        //  Create Entity Enviroment and set with default background
        //
        //Initialize Entity Manager, identify if it is a canvas or div enviroment
            //options: {canvas: html element}
        psl.Entity.Initialize({useCanvas: true, canvas: document.getElementById("background"),background: bkgrnd});
        
        //
        //  Creating Custom Animations
        //
        
        //Create custom animation from sequence from base animations
        var right_run_turn = psl.Create.Animation("right_run_turn");
        var left_run_turn = psl.Create.Animation("left_run_turn");
        
        var right_run = psl.Animation.animations.get("right_run");
        var left_run  = psl.Animation.animations.get("left_run");
        var right_flip = psl.Animation.animations.get("right_flip");
        var left_flip = psl.Animation.animations.get("left_flip");
        
        var turn_left = psl.Animation.animations.get("turn_left");
        var turn_right = psl.Animation.animations.get("turn_right");
        
        //Testing reverse frame techinques

        //psl.Animation.ReverseFrames(turn_right);
        psl.Animation.AddFrames(right_run_turn, turn_right);
        //psl.Animation.AddFramesReverse(right_run_turn, turn_right);
        
        psl.Animation.AddFrames(right_run_turn, right_run);
        psl.Animation.AddFrames(right_run_turn, right_run);
        psl.Animation.AddFrames(right_run_turn, right_run);
        psl.Animation.AddFrames(right_run_turn, right_run);
        psl.Animation.AddFrames(right_run_turn, right_run);
        psl.Animation.AddFrames(right_run_turn, right_run);
        psl.Animation.AddFrames(right_run_turn, right_run);
        psl.Animation.AddFrames(right_run_turn, right_run);
        
        right_run_turn.numOfFrames = right_run_turn.frames.length;
        right_run_turn.sheet = right_run.sheet;
        right_run_turn.speed = right_run.speed;
        

        psl.Animation.AddFrames(left_run_turn, turn_left);
        psl.Animation.AddFrames(left_run_turn, left_run);
        psl.Animation.AddFrames(left_run_turn, left_run);
        psl.Animation.AddFrames(left_run_turn, left_run);
        psl.Animation.AddFrames(left_run_turn, left_run);
        psl.Animation.AddFrames(left_run_turn, left_run);
        psl.Animation.AddFrames(left_run_turn, left_run);
        psl.Animation.AddFrames(left_run_turn, left_run);
        psl.Animation.AddFrames(left_run_turn, left_run);
        left_run_turn.numOfFrames = left_run_turn.frames.length;
        left_run_turn.sheet = left_run.sheet;
        left_run_turn.speed = left_run.speed;
        
        //
        //  Entity Creation 
        //
        
        //Create an Entity and extend with Graphics object
        dog = psl.Entity.Create({width: 100, height: 100, position: [0,0,0], rotation:[0,0,0]});
        dog.AddGraphics();
        
        //Add Animation to dog
        dog.graphics.Animation.Add("right_run_turn");
        dog.graphics.Animation.Add("right_flip");
        dog.graphics.Animation.Add("left_run_turn");
        dog.graphics.Animation.Add("left_flip");
        
        var SetRightRun = function(){
            dog.graphics.Animation.Set("right_run_turn");
            dog.graphics.Animation.onStop = SetRightFlip;
            //dog.graphics.Animation.onStop = SetLeftRun;
        }
        var SetLeftRun = function(){
            dog.graphics.Animation.Set("left_run_turn");
            dog.graphics.Animation.onStop = SetLeftFlip;
            //dog.graphics.Animation.onStop = SetRightRun;
        }
        var SetLeftFlip = function(){
            dog.graphics.Animation.Set("left_flip");
            dog.graphics.Animation.onStop = SetRightRun;
        }
        var SetRightFlip = function(){
            dog.graphics.Animation.Set("right_flip");
            dog.graphics.Animation.onStop = SetLeftRun;
        }
        
        SetRightRun();
        //dog.graphics.Scale([0.25,0.25,1]);
        dog.position[0] = 150;
        dog.position[1] = 150;
        dog.rotation[0] = 30 * Math.PI / 180;
        dog.graphics.Scale([0.5,0.5,0.5]);
        //dog.graphics.Scale([1,1,1]);
        
        //
        //  Create Physics world
        //
        var leftWall, rightWall, floor, ceiling;
        
        var canvasWidth = 1024; //psl.Entity.canvas.width;
        var canvasHeight = 768; //psl.Entity.canvas.height;
        
        floor = psl.Entity.Create({position: [canvasWidth/2, canvasHeight+50, 0]});
        floor.AddPhysics();
        floor.physics.MakeBox(canvasWidth, 55, true);
        
        ceiling = psl.Entity.Create({position: [canvasWidth/2, -canvasHeight, 0]});
        ceiling.AddPhysics();
        ceiling.physics.MakeBox(canvasWidth, 50, true);
        
        leftWall = psl.Entity.Create({position: [-50, 0, 0]});
        leftWall.AddPhysics();
        leftWall.physics.MakeBox(55, canvasHeight*2, true);
        
        rightWall = psl.Entity.Create({position: [canvasWidth+50, 0, 0]});
        rightWall.AddPhysics();
        rightWall.physics.MakeBox(55, canvasHeight*2, true);
        
        
        
        //
        //  Physcis objects with static animations
        //
        
        dog.AddPhysics();
        dog.physics.MakeBox(dog.graphics.Animation.currentAnimation.sheet.cellWidth/2 * dog.graphics.scale[0], dog.graphics.scale[1] * dog.graphics.Animation.currentAnimation.sheet.cellHeight/2, false);
        
        //Ball 1
        ball1 = psl.Entity.Create({width: 0, height: 0, position: [50,0,0], rotation:[0,0,0]});
        ball1.AddGraphics();
        ball1.graphics.Animation.Add("1");
        ball1.graphics.Animation.Set("1");
        ball1.graphics.Animation.active = false;
        
        ball1.graphics.Scale([0.5,0.5,0.5]);
        
        ball1.AddPhysics();
        ball1.physics.MakeCircle(16);
        
        //Ball 2
        ball2 = psl.Entity.Create({width: 0, height: 0, position: [65,0,0], rotation:[0,0,0]});
        ball2.AddGraphics();
        ball2.graphics.Animation.Add("2");
        ball2.graphics.Animation.Set("2");
        ball2.graphics.Animation.active = false;
        
        ball2.graphics.Scale([0.5,0.5,0.5]);
        
        ball2.AddPhysics();
        ball2.physics.MakeCircle(16);
        
        //Ball 3
        ball3 = psl.Entity.Create({width: 0, height: 0, position: [100,0,0], rotation:[0,0,0]});
        ball3.AddGraphics();
        ball3.graphics.Animation.Add("3");
        ball3.graphics.Animation.Set("3");
        ball3.graphics.Animation.active = false;
        
        //ball3.graphics.Scale([0.5,0.5,0.5]);
        
        ball3.AddPhysics();
        ball3.physics.MakeCircle(32);
        

        //
        //  TEXT / FONTS
        //
        
        dog.AddText({
            text: "Dog",
            fontFamily: "Calibri",
            size: "52px",
            fontWeight: "bold",
            alignment: "center",
            fontColor: "#000000",//"#ffffff"
            strokeColor: "#ffffff",
            offset: [0,-50,0],
            drawStroke: true
        });
        
        var fontOptions = {
            text: "Dog",
            fontFamily: "Calibri",
            size: "52px",
            fontWeight: "bold",
            alignment: "center",
            fontColor: "#000000",//"#ffffff"
            strokeColor: "#ffffff",
            offset: [0,-50,0],
            drawStroke: true
        }
        var myTextObject = psl.Font.Write("A Message", 250, 250, fontOptions);
        myTextObject.text = "Updated Message";
        //myTextObject.Delete();
        //dog.font.Delete();
        
        
        //
        //  MEMORY
        //
        var gameData = psl.Memory.Local.Get("game");
        if(!gameData){
            gameData = {
                count: 0,
                time: (new Date()).getTime()
            }
        }
        gameData.count++;
        myTextObject.text = "Game Loaded: " + gameData.count;
        
        psl.Memory.Local.Update("game", gameData);
        
        //
        //  Tween
        //
        
            //Tween position of object
                //start, stop, time, fn, onEnd
            psl.Tween.Create(250, 600, 3000,
            function(val){
                myTextObject.parent.position[0] = val;
            },
            function(tween){
                myTextObject.parent.position[0] = 250;
            });
            
            //Tween alpha of object
            psl.Tween.Create(0,255,3000,
            function(val){
                var color = val|0;
                var alpha = 1 - (color/255);
                myTextObject.fontColor = "rgba("+ color +","+ color + ","+ color +", "+ alpha +")";
            });
        //
        //  INPUT
        //
        var physicsEnabled = true;
        //TODO: Need to consider removing event listener when switching animations manually
            //Keybaord
        psl.Input.Register.Keyboard.Event.Keydown("S", function(){
            physicsEnabled = physicsEnabled ? false : true;
        });
            //Mouse
        psl.Input.Register.Mouse.Event.Down(function(){psl.Audio.Play("click")});
            //Touch
        psl.Input.Register.Touch.Event.End(function(){psl.Audio.Play("click")});
       
       //
       //   Event Manager
       //
                //tag, delay, input, fn, scope
       psl.Event.Add("play sound", 4000, psl, function(e, input){
            psl.Audio.Play("bark");
       })
       
       //
       //   Game Loop
       //
        var lastUpdate = psl.Get.Time();
        var time,dt;
        
        //Start Game Loop
        (Loop = function(){
    
            time = psl.Get.Time()
            dt = time - lastUpdate;
    
            lastUpdate = time;
            
            psl.Event.Update(dt);
            if(physicsEnabled)
                psl.Physics.Update(dt);
            psl.Tween.Update(dt);
            psl.Graphics.Update(dt);
            psl.Graphics.Draw();
            psl.Font.Draw();
            //psl.Physics.Draw();
    
            window.requestAnimFrame(Loop);
    
        })();        
    }
    
    //Load animaation json.. url, callback, scope
    psl.Animation.LoadJSON("images/spritesheets/animations.json", psl.Demo);
    
}

//http://phrogz.net/tmp/image_move_sprites_css.html
function rotateDog(deg){
    dog.rotation[0] = deg * Math.PI/ 180;
}
function scaleDog(val){
    dog.graphics.Scale([val,val,val]);
}