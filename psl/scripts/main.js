window.onload = function(){
    psl = com.playstylelabs.Instance();
    
    psl.Demo = function(){
        bkgrnd = psl.Graphics.LoadImage("images/backgrounds/Level_1.png", function(){
                psl.Entity.canvas.width = 1024; //"1024px";
                psl.Entity.canvas.height = 768; //"768px";
                psl.Entity.ctx.drawImage(bkgrnd.html, 0, 0);
            });    
            
        //Initialize Entity Manager, identify if it is a canvas or div enviroment
            //options: {canvas: html element}
        psl.Entity.Initialize({useCanvas: true, canvas: document.getElementById("background"),background: bkgrnd});
        
        //Create an Entity and extend with Graphics object
        dog = psl.Entity.Create({width: 100, height: 100, position: [0,0,0], rotation:[0,0,0]});
        dog.AddGraphics();
        
        //Create custom animation from sequence from base animations
        var right_run_turn = psl.Create.Animation("right_run_turn");
        var left_run_turn = psl.Create.Animation("left_run_turn");
        
        var right_run = psl.Animation.animations.get("right_run");
        var left_run  = psl.Animation.animations.get("left_run");
        var right_flip = psl.Animation.animations.get("right_flip");
        var left_flip = psl.Animation.animations.get("left_flip");
        
        var turn_left = psl.Animation.animations.get("turn_left");
        var turn_right = psl.Animation.animations.get("turn_right");
        
    
        
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
        
    
        
        //Add Animation to dog
        dog.graphics.Animation.Add("right_run_turn");
        dog.graphics.Animation.Add("right_flip");
        dog.graphics.Animation.Add("left_run_turn");
        dog.graphics.Animation.Add("left_flip");
        
        SetRightRun();
        //dog.graphics.Scale([0.25,0.25,1]);
        dog.position[0] = 550;
        dog.position[1] = 150;
        dog.rotation[0] = 30 * Math.PI / 180;
        dog.graphics.Scale([0.5,0.5,0.5]);
        //dog.graphics.Scale([1,1,1]);
        
        
        //Need to consider removing event listener when switching animations manually
        psl.Input.Register.Keyboard.Event.Keydown("S", function(){
            dog.graphics.Animation.list.next();
            dog.graphics.Animation.Set(dog.graphics.Animation.list.key())
        });
       
        var lastUpdate = psl.Get.Time();
        var time,dt;
        
        //Start Game Loop
        (Loop = function(){
    
            time = psl.Get.Time()
            dt = time - lastUpdate;
    
            lastUpdate = time;
            psl.Graphics.Update(dt);
            psl.Graphics.Draw();    
    
    
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