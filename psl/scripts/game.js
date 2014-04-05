window.onload = function(){
    //Have to create canvas with JavaScript for Ludei to work properly
    var canvas = document.createElement("canvas");
    canvas.id = "background";
    canvas.className = "background";
    document.body.appendChild(canvas);
    
    
    psl = com.playstylelabs.Instance();
    psl.Entity.canvas = canvas;
    Game.Init();
    
    
}
Game = {
    Init: function(){
        
        //Set up Entity system to use canvas
        psl.Entity.Initialize({useCanvas: true, canvas: psl.Entity.canvas});
        
        Game.Load.Images();
        Game.Load.Sounds();
        Game.Load.Animations();
        Game.Load.States();
        Game.Load.Entity();
        Game.Load.Physics();
        Game.Load.Memory();
        
        Game.FSM.Transition("MainMenu");
        
        Game.lastUpdate = psl.Get.Time();
        Game.Run();
    },
    Entity: {
        dog: null,
        dogHouse: null,
        bowl: null,
        basket: null,
        dirt: null,
        balls: [],
        MainMenu: {
            dogShow: null,
            petshop: null,
            play: null,
            settings: null,
            training: null
        },
        MissionMap: {
            map: null,
            home: null,
            petshop: null,
            settings: null,
            lockLvl1: null,
            lockLvl2: null,
            lockLvl3: null,
            lockLvl4: null
        },
        Level1: {
            
        },
        PhysicsWorld: {
            left: null,
            right: null,
            floor: null,
            ceiling: null
        }
    },
    Memory: {
        timesPlayed: null
    },
    Assets: {
        Images: {
            MainMenu: {
                background: null,
                Buttons: {
                    dogShow: null,
                    petShop: null,
                    play: null,
                    settings: null,
                    training: null
                }
            },
            MissionMap: {
                background: null,
                map: null,
                Buttons: {
                    home: null,
                    petshop: null,
                    settings: null
                }
            },
            Level1: {
                background: null
            }
        },
        requested: 0,
        loaded: 0
    },
    Load: {
        Memory: function(){
            Game.Memory.timesPlayed = psl.Memory.Local.Get("timesPlayed");
            if(!Game.Memory.timesPlayed){
                Game.Memory.timesPlayed = 0;
            }
            Game.Memory.timesPlayed++;
            
            psl.Memory.Local.Update("timesPlayed", Game.Memory.timesPlayed);
        
        },
        Physics: function(){
            var leftWall, rightWall, floor, ceiling;
        
            var canvasWidth = 1024; //psl.Entity.canvas.width;
            var canvasHeight = 768; //psl.Entity.canvas.height;
            
            Game.Entity.PhysicsWorld.floor = psl.Entity.Create({position: [canvasWidth/2, canvasHeight+50, 0]});
            Game.Entity.PhysicsWorld.floor.AddPhysics();
            Game.Entity.PhysicsWorld.floor.physics.MakeBox(canvasWidth, 55, true);
            
            Game.Entity.PhysicsWorld.ceiling = psl.Entity.Create({position: [canvasWidth/2, -canvasHeight, 0]});
            Game.Entity.PhysicsWorld.ceiling.AddPhysics();
            Game.Entity.PhysicsWorld.ceiling.physics.MakeBox(canvasWidth, 50, true);
            
            Game.Entity.PhysicsWorld.left = psl.Entity.Create({position: [-50, 0, 0]});
            Game.Entity.PhysicsWorld.left.AddPhysics();
            Game.Entity.PhysicsWorld.left.physics.MakeBox(55, canvasHeight*2, true);
            
            Game.Entity.PhysicsWorld.right = psl.Entity.Create({position: [canvasWidth+50, 0, 0]});
            Game.Entity.PhysicsWorld.right.AddPhysics();
            Game.Entity.PhysicsWorld.right.physics.MakeBox(55, canvasHeight*2, true);
        },
        Images: function(){
            //
            //  Load Main Menu (set as default background and draw to canvas)
            //
            Game.Assets.requested++;
            Game.Assets.Images.MainMenu.background = psl.Graphics.LoadImage("images/backgrounds/MainMenu/MainMenu.png", function(a){
                psl.Entity.background = Game.Assets.Images.MainMenu.background;
                psl.Entity.canvas.width = 1024; //"1024px";
                psl.Entity.canvas.height = 768; //"768px";
                psl.Entity.ctx.drawImage(psl.Entity.background.html, 0, 0);
                Game.Assets.loaded++;
            });
                //Buttons
                
            Game.Assets.Images.MainMenu.Buttons.dogShow  =  psl.Graphics.LoadImage("images/backgrounds/MainMenu/DogShowButton.png",  function(){Game.Assets.loaded++});
            Game.Assets.Images.MainMenu.Buttons.petShop  =  psl.Graphics.LoadImage("images/backgrounds/MainMenu/PetShopButton.png",  function(){Game.Assets.loaded++});
            Game.Assets.Images.MainMenu.Buttons.play     =  psl.Graphics.LoadImage("images/backgrounds/MainMenu/PlayButton.png",     function(){Game.Assets.loaded++});
            Game.Assets.Images.MainMenu.Buttons.settings =  psl.Graphics.LoadImage("images/backgrounds/MainMenu/SettingsButton.png", function(){Game.Assets.loaded++});
            Game.Assets.Images.MainMenu.Buttons.training =  psl.Graphics.LoadImage("images/backgrounds/MainMenu/TrainingButton.png", function(){Game.Assets.loaded++});
            Game.Assets.requested += 5;
            
            //
            //  Mission Map
            //
            
            Game.Assets.Images.MissionMap.background       = psl.Graphics.LoadImage("images/backgrounds/MissionMap/MissionMapBackground.png", function(){Game.Assets.loaded++});
            Game.Assets.Images.MissionMap.map              = psl.Graphics.LoadImage("images/backgrounds/MissionMap/MissionMap.png", function(){Game.Assets.loaded++});
            Game.Assets.Images.MissionMap.Buttons.home     = psl.Graphics.LoadImage("images/backgrounds/MissionMap/MissionMapHomeButton.png", function(){Game.Assets.loaded++});
            Game.Assets.Images.MissionMap.Buttons.petshop  = psl.Graphics.LoadImage("images/backgrounds/MissionMap/MissionMapPetshopButton.png", function(){Game.Assets.loaded++});
            Game.Assets.Images.MissionMap.Buttons.settings = psl.Graphics.LoadImage("images/backgrounds/MissionMap/MissionMapSettingsButton.png", function(){Game.Assets.loaded++});
            Game.Assets.requested += 5;
            
            //
            //  Level 1
            //
            Game.Assets.Images.Level1.background = psl.Graphics.LoadImage("images/backgrounds/Level1/Level1.png", function(){Game.Assets.loaded++});
            Game.Assets.requested++;
        },
        Animations: function(){
            psl.Animation.LoadJSON("images/spritesheets/animations.json",
                function(){
                    // transform, edit, or create any animations
                        //Right Sit frames are in reverse order
                    psl.Animation.ReverseFrames(psl.Animation.animations.get("right_sit"));
                    
                    psl.Animation.animations.get("left_dig").loop = true;
                    psl.Animation.animations.get("right_dig").loop = true;
                    
                    psl.Animation.animations.get("sparkle_empty_basket").loop = false;
                    
                });
        },
        Sounds: function(){
            var parameters = {
                urls: ['sounds/button-click.mp3'],
                autoplay: false,
                loop: false,
                volume: 0.5,
                onend: null
            }
            
            psl.Audio.Load("click", parameters);
            
            parameters.urls = ['sounds/cha-ching.mp3'];
            psl.Audio.Load("chaChing", parameters);
            
            parameters.urls = ["sounds/ding-happy.mp3"];
            psl.Audio.Load("happy", parameters);
            
            parameters.urls = ["sounds/ding-sad.mp3"];
            psl.Audio.Load("sad", parameters);
            
            parameters.urls = ["sounds/dog-bark.mp3"];
            psl.Audio.Load("bark", parameters);
            
            parameters.urls = ["sounds/dog-whine.mp3"];
            psl.Audio.Load("whine", parameters);
            
            parameters.urls = ["sounds/yay.mp3"];
            psl.Audio.Load("yay", parameters);
            
            parameters.urls = ["sounds/dog-dig.mp3"];
            parameters.loop = true;
            psl.Audio.Load("dig", parameters);
        },
        Entity: function(){

            //
            //  Mission Map
            //
                //Map
            Game.Entity.MissionMap.map = psl.Entity.Create({width: 0, height: 0, position: [500,300,0], rotation:[0,0,0]});
            Game.Entity.MissionMap.map.AddGraphics();
            Game.Entity.MissionMap.map.graphics.Animation.Add("missionMap");
            Game.Entity.MissionMap.map.graphics.Animation.Set("missionMap");
            Game.Entity.MissionMap.map.graphics.Animation.active = false;
            Game.Entity.MissionMap.map.graphics.Scale([1.0,1.0,1.0]);
            Game.Entity.MissionMap.map.graphics.Disable();
                //Home
            Game.Entity.MissionMap.home = psl.Entity.Create({width: 0, height: 0, position: [175,650,0], rotation:[0,0,0]});
            Game.Entity.MissionMap.home.AddGraphics();
            Game.Entity.MissionMap.home.graphics.Animation.Add("missionMapHome");
            Game.Entity.MissionMap.home.graphics.Animation.Set("missionMapHome");
            Game.Entity.MissionMap.home.graphics.Animation.active = false;
            Game.Entity.MissionMap.home.graphics.Scale([0.75,0.75,0.75]);
            Game.Entity.MissionMap.home.graphics.Disable();
                //Petshop
            Game.Entity.MissionMap.petshop = psl.Entity.Create({width: 0, height: 0, position: [525,653,0], rotation:[0,0,0]});
            Game.Entity.MissionMap.petshop.AddGraphics();
            Game.Entity.MissionMap.petshop.graphics.Animation.Add("missionMapPetshop");
            Game.Entity.MissionMap.petshop.graphics.Animation.Set("missionMapPetshop");
            Game.Entity.MissionMap.petshop.graphics.Animation.active = false;
            Game.Entity.MissionMap.petshop.graphics.Scale([0.75,0.75,0.75]);
            Game.Entity.MissionMap.petshop.graphics.Disable();
                //Settings
            Game.Entity.MissionMap.settings = psl.Entity.Create({width: 0, height: 0, position: [850,650,0], rotation:[0,0,0]});
            Game.Entity.MissionMap.settings.AddGraphics();
            Game.Entity.MissionMap.settings.graphics.Animation.Add("missionMapSettings");
            Game.Entity.MissionMap.settings.graphics.Animation.Set("missionMapSettings");
            Game.Entity.MissionMap.settings.graphics.Animation.active = false;
            Game.Entity.MissionMap.settings.graphics.Scale([0.75,0.75,0.75]);
            Game.Entity.MissionMap.settings.graphics.Disable();
                //Level 1 Lock
            Game.Entity.MissionMap.lockLvl1 = psl.Entity.Create({width: 0, height: 0, position: [440,125,0], rotation:[0,0,0]});
            Game.Entity.MissionMap.lockLvl1.AddGraphics();
            Game.Entity.MissionMap.lockLvl1.graphics.Animation.Add("open_lock");
            Game.Entity.MissionMap.lockLvl1.graphics.Animation.Set("open_lock");
            Game.Entity.MissionMap.lockLvl1.graphics.Animation.active = false;
            Game.Entity.MissionMap.lockLvl1.graphics.Scale([0.75,0.75,0.75]);
            Game.Entity.MissionMap.lockLvl1.graphics.Disable();
                //Level 2 Lock
            Game.Entity.MissionMap.lockLvl2 = psl.Entity.Create({width: 0, height: 0, position: [815,175,0], rotation:[0,0,0]});
            Game.Entity.MissionMap.lockLvl2.AddGraphics();
            Game.Entity.MissionMap.lockLvl2.graphics.Animation.Add("open_lock");
            Game.Entity.MissionMap.lockLvl2.graphics.Animation.Set("open_lock");
            Game.Entity.MissionMap.lockLvl2.graphics.Animation.active = false;
            Game.Entity.MissionMap.lockLvl2.graphics.Scale([0.75,0.75,0.75]);
            Game.Entity.MissionMap.lockLvl2.graphics.Disable();
                //Level 3 Lock
            Game.Entity.MissionMap.lockLvl3 = psl.Entity.Create({width: 0, height: 0, position: [690,350,0], rotation:[0,0,0]});
            Game.Entity.MissionMap.lockLvl3.AddGraphics();
            Game.Entity.MissionMap.lockLvl3.graphics.Animation.Add("open_lock");
            Game.Entity.MissionMap.lockLvl3.graphics.Animation.Set("open_lock");
            Game.Entity.MissionMap.lockLvl3.graphics.Animation.active = false;
            Game.Entity.MissionMap.lockLvl3.graphics.Scale([0.75,0.75,0.75]);
            Game.Entity.MissionMap.lockLvl3.graphics.Disable();
                //Level 4 Lock
            Game.Entity.MissionMap.lockLvl4 = psl.Entity.Create({width: 0, height: 0, position: [405,425,0], rotation:[0,0,0]});
            Game.Entity.MissionMap.lockLvl4.AddGraphics();
            Game.Entity.MissionMap.lockLvl4.graphics.Animation.Add("open_lock");
            Game.Entity.MissionMap.lockLvl4.graphics.Animation.Set("open_lock");
            Game.Entity.MissionMap.lockLvl4.graphics.Animation.active = false;
            Game.Entity.MissionMap.lockLvl4.graphics.Scale([0.75,0.75,0.75]);
            Game.Entity.MissionMap.lockLvl4.graphics.Disable();
            
            //
            //  Main Menu
            //
                //Dog Show
            Game.Entity.MainMenu.dogShow = psl.Entity.Create({width: 0, height: 0, position: [300,250,0], rotation:[0,0,0]});
            Game.Entity.MainMenu.dogShow.AddGraphics();
            Game.Entity.MainMenu.dogShow.graphics.Animation.Add("dogShowButton");
            Game.Entity.MainMenu.dogShow.graphics.Animation.Set("dogShowButton");
            Game.Entity.MainMenu.dogShow.graphics.Animation.active = false;
            Game.Entity.MainMenu.dogShow.graphics.Scale([0.75,0.75,0.75]);
            Game.Entity.MainMenu.dogShow.graphics.Disable();
                //Petshop
            Game.Entity.MainMenu.petshop = psl.Entity.Create({width: 0, height: 0, position: [300,375,0], rotation:[0,0,0]});
            Game.Entity.MainMenu.petshop.AddGraphics();
            Game.Entity.MainMenu.petshop.graphics.Animation.Add("petshopButton");
            Game.Entity.MainMenu.petshop.graphics.Animation.Set("petshopButton");
            Game.Entity.MainMenu.petshop.graphics.Animation.active = false;
            Game.Entity.MainMenu.petshop.graphics.Scale([0.75,0.75,0.75]);
            Game.Entity.MainMenu.petshop.graphics.Disable();
                //Play
            Game.Entity.MainMenu.play = psl.Entity.Create({width: 0, height: 0, position: [300,125,0], rotation:[0,0,0]});
            Game.Entity.MainMenu.play.AddGraphics();
            Game.Entity.MainMenu.play.graphics.Animation.Add("playButton");
            Game.Entity.MainMenu.play.graphics.Animation.Set("playButton");
            Game.Entity.MainMenu.play.graphics.Animation.active = false;
            Game.Entity.MainMenu.play.graphics.Scale([0.75,0.75,0.75]);
            Game.Entity.MainMenu.play.graphics.Disable();
                //Settings
            Game.Entity.MainMenu.settings = psl.Entity.Create({width: 0, height: 0, position: [300,625,0], rotation:[0,0,0]});
            Game.Entity.MainMenu.settings.AddGraphics();
            Game.Entity.MainMenu.settings.graphics.Animation.Add("settingsButton");
            Game.Entity.MainMenu.settings.graphics.Animation.Set("settingsButton");
            Game.Entity.MainMenu.settings.graphics.Animation.active = false;
            Game.Entity.MainMenu.settings.graphics.Scale([0.75,0.75,0.75]);
            Game.Entity.MainMenu.settings.graphics.Disable();
                //Training
            Game.Entity.MainMenu.training = psl.Entity.Create({width: 0, height: 0, position: [300,500,0], rotation:[0,0,0]});
            Game.Entity.MainMenu.training.AddGraphics();
            Game.Entity.MainMenu.training.graphics.Animation.Add("trainingButton");
            Game.Entity.MainMenu.training.graphics.Animation.Set("trainingButton");
            Game.Entity.MainMenu.training.graphics.Animation.active = false;
            Game.Entity.MainMenu.training.graphics.Scale([0.75,0.75,0.75]);
            Game.Entity.MainMenu.training.graphics.Disable();
            
            
            //
            //  Dog
            //
            Game.Entity.dog = psl.Entity.Create({width: 100, height: 100, position: [0,0,0], rotation:[0,0,0]});
            Game.Entity.dog.AddGraphics();
            
            //Add Animation to dog
            Game.Entity.dog.graphics.Animation.Add("right_sad");
            Game.Entity.dog.graphics.Animation.Add("left_sad");
            Game.Entity.dog.graphics.Animation.Add("right_sit");
            Game.Entity.dog.graphics.Animation.Add("left_sit");
            Game.Entity.dog.graphics.Animation.Add("right_dig");
            Game.Entity.dog.graphics.Animation.Add("left_dig");
            Game.Entity.dog.graphics.Animation.Add("right_run");
            Game.Entity.dog.graphics.Animation.Add("left_run");
            Game.Entity.dog.graphics.Animation.Add("right_flip");
            Game.Entity.dog.graphics.Animation.Add("left_flip");
            Game.Entity.dog.graphics.Animation.Set("right_flip");
            Game.Entity.dog.graphics.Disable();
            
            //
            // Props
            //
            Game.Entity.dogHouse = psl.Entity.Create({width: 100, height: 100, position: [950,300,0], rotation:[0,0,0]});
            Game.Entity.dogHouse.AddGraphics();
                //Add Animation
            Game.Entity.dogHouse.graphics.Animation.Add("dogHouse");
            Game.Entity.dogHouse.graphics.Animation.Set("dogHouse");
            Game.Entity.dogHouse.graphics.Animation.active = false;
            Game.Entity.dogHouse.graphics.Scale([0.75,0.75,0.75]);
            Game.Entity.dogHouse.graphics.Disable();
                //Bowl
            Game.Entity.bowl = psl.Entity.Create({width: 100, height: 100, position: [100,100,0], rotation:[20,0,0]});
            Game.Entity.bowl.AddGraphics();
            Game.Entity.bowl.graphics.Animation.Add("bowl");
            Game.Entity.bowl.graphics.Animation.Set("bowl");
            Game.Entity.bowl.graphics.Animation.active = false;
            //Game.Entity.dogHouse.graphics.Scale([0.75,0.75,0.75]);
            Game.Entity.bowl.graphics.Disable();
            Game.Entity.bowl.AddPhysics();
            Game.Entity.bowl.physics.MakeBox(Game.Entity.bowl.graphics.Animation.currentAnimation.sheet.cellWidth/2 * Game.Entity.bowl.graphics.scale[0], Game.Entity.bowl.graphics.scale[1] * Game.Entity.bowl.graphics.Animation.currentAnimation.sheet.cellHeight/2, false);
            Game.Entity.bowl.physics.Pause();
            var fontOptions = {
                text: "Treats: " + psl.Memory.Local.Get("timesPlayed"),
                fontFamily: "Calibri",
                size: "32px",
                fontWeight: "bold",
                alignment: "center",
                fontColor: "#000000",//"#ffffff"
                strokeColor: "#ffffff",
                offset: [0,-50,0],
                drawStroke: true
            }
            Game.Entity.bowl.AddText(fontOptions);
            Game.Entity.bowl.font.enabled = false;
            
                //Balls
            for(var i = 0; i <= 10; i++){
                Game.Entity.balls[i] = psl.Entity.Create({width: 0, height: 0, position: [650,200,0], rotation:[0,0,0]});
                Game.Entity.balls[i].AddGraphics();
                Game.Entity.balls[i].graphics.Animation.Add(i.toString());
                Game.Entity.balls[i].graphics.Animation.Set(i.toString());
                Game.Entity.balls[i].graphics.Animation.active = false;
                Game.Entity.balls[i].graphics.Scale([0.5,0.5,0.5]);
                Game.Entity.balls[i].graphics.Disable();
                Game.Entity.balls[i].AddPhysics();
                Game.Entity.balls[i].physics.MakeCircle(16);
                Game.Entity.balls[i].physics.Pause();
            }
                //Basket
            Game.Entity.basket = psl.Entity.Create({width: 0, height: 0, position: [440,125,0], rotation:[0,0,0]});
            Game.Entity.basket.AddGraphics();
            Game.Entity.basket.graphics.Animation.Add("sparkle_empty_basket");
            Game.Entity.basket.graphics.Animation.Set("sparkle_empty_basket");
            Game.Entity.basket.graphics.Animation.active = false;
            Game.Entity.basket.graphics.Scale([2,2,2]);
            Game.Entity.basket.graphics.Disable();
            Game.Entity.basket.AddPhysics();
            Game.Entity.basket.physics.MakeBox(Game.Entity.basket.graphics.Animation.currentAnimation.sheet.cellWidth/2 * Game.Entity.basket.graphics.scale[0], Game.Entity.basket.graphics.scale[1] * Game.Entity.basket.graphics.Animation.currentAnimation.sheet.cellHeight/2, true);
            Game.Entity.basket.physics.Pause();
                //Dirt
            Game.Entity.dirt = psl.Entity.Create({width: 0, height: 0, position: [440,125,0], rotation:[0,0,0]});
            Game.Entity.dirt.AddGraphics();
            Game.Entity.dirt.graphics.Animation.Add("dirt_left");
            Game.Entity.dirt.graphics.Animation.Set("dirt_left");
            Game.Entity.dirt.graphics.Animation.currentAnimation.loop = true;
            Game.Entity.dirt.graphics.Scale([2,2,2]);
            Game.Entity.dirt.graphics.Disable();
            
            
        },
        States: function(){
            //Create FSM for Game
            Game.FSM = psl.AI.FSM.Create(null);
            
            //
            //  Main Menu
            //
            Game.States.MainMenu = psl.AI.State.Create("MainMenu");
            Game.States.MainMenu.Enter = function(){
                //Set background image
                psl.Entity.background = Game.Assets.Images.MainMenu.background;
                
                //Enable Button Images
                Game.Entity.MainMenu.dogShow.graphics.Enable();
                Game.Entity.MainMenu.petshop.graphics.Enable();
                Game.Entity.MainMenu.play.graphics.Enable();
                Game.Entity.MainMenu.settings.graphics.Enable();
                Game.Entity.MainMenu.training.graphics.Enable();
                
                //Enable Dog
                Game.Entity.dog.graphics.Animation.Set("right_flip");
                Game.Entity.dog.graphics.Scale([0.75,0.75,0.75]);
                Game.Entity.dog.position[0] = 800;
                Game.Entity.dog.position[1] = 500;
                Game.Entity.dog.graphics.Animation.currentAnimation.active = true;
                Game.Entity.dog.graphics.Animation.onStop = function(){Game.Entity.dog.graphics.Animation.Set("right_flip");};
                Game.Entity.dog.graphics.Enable();
                
                //Add Touch Event
                Game.States.MainMenu.callbackObject = psl.Input.Register.Touch.Event.End(Game.States.MainMenu.Touch);
                
                
            }
            Game.States.MainMenu.Exit = function(){
                
                //Disable Button Images
                Game.Entity.MainMenu.dogShow.graphics.Disable();
                Game.Entity.MainMenu.petshop.graphics.Disable();
                Game.Entity.MainMenu.play.graphics.Disable();
                Game.Entity.MainMenu.settings.graphics.Disable();
                Game.Entity.MainMenu.training.graphics.Disable();
                
                //Enable Dog
                Game.Entity.dog.graphics.Animation.onStop = null;
                Game.Entity.dog.graphics.Disable();
                
                //Remove Touch Event
                psl.Input.Remove.Touch.Event.End(Game.States.MainMenu.callbackObject.id);
            }
            Game.States.MainMenu.Execute = function(owner, dt){
                if(dt){
                    Game.Entity.dog.graphics.Update(dt);
                    Game.Entity.MainMenu.dogShow.graphics.Update(dt);
                    Game.Entity.MainMenu.petshop.graphics.Update(dt);
                    Game.Entity.MainMenu.play.graphics.Update(dt);
                    Game.Entity.MainMenu.settings.graphics.Update(dt);
                    Game.Entity.MainMenu.training.graphics.Update(dt);
                }
                
                //Draw Background
                psl.Graphics.DrawBackground();
                
                //Draw Buttons
                Game.Entity.MainMenu.dogShow.graphics.Draw();
                Game.Entity.MainMenu.petshop.graphics.Draw();
                Game.Entity.MainMenu.play.graphics.Draw();
                Game.Entity.MainMenu.settings.graphics.Draw();
                Game.Entity.MainMenu.training.graphics.Draw();
                
                //Draw dog
                Game.Entity.dog.graphics.Draw();
            }
            Game.States.MainMenu.callbackObject;
            Game.States.MainMenu.Touch = function(e){
                var st  = psl.Input.Get.State.Touch();
                
                var halfWidth = Game.Entity.MainMenu.play.graphics.scale[0] * 532/2;
                var halfHeight = Game.Entity.MainMenu.play.graphics.scale[0] * 166/2;
                if(( (Game.Entity.MainMenu.play.position[0] + halfWidth) > st.lastX) && ( (Game.Entity.MainMenu.play.position[0]  - halfWidth) < st.lastX) ){
                    
                    //Play Menu Button - Mission Map
                    if(((Game.Entity.MainMenu.play.position[1] + halfHeight) > st.lastY) && ((Game.Entity.MainMenu.play.position[1] - halfHeight) < st.lastY)){
                        psl.Audio.Play("click");
                        Game.FSM.Transition("MissionMap");
                    }
                }
            }
            
            //
            //  Mission Map
            //
            Game.States.MissionMap = psl.AI.State.Create("MissionMap");
            Game.States.MissionMap.Enter = function(){
                //Set Background
                psl.Entity.background = Game.Assets.Images.MissionMap.background;
                
                //Enable Buttons
                Game.Entity.MissionMap.home.graphics.Enable();
                Game.Entity.MissionMap.map.graphics.Enable();
                Game.Entity.MissionMap.petshop.graphics.Enable();
                Game.Entity.MissionMap.settings.graphics.Enable();
                
                //Enable Locks
                Game.Entity.MissionMap.lockLvl1.graphics.Enable();
                Game.Entity.MissionMap.lockLvl2.graphics.Enable();
                Game.Entity.MissionMap.lockLvl3.graphics.Enable();
                Game.Entity.MissionMap.lockLvl4.graphics.Enable();
                
                //Dog
                Game.Entity.dog.graphics.Animation.Set("right_sit");
                //Game.Entity.dog.graphics.Animation.active = false;
                Game.Entity.dog.graphics.Scale([0.75,0.75,0.75]);
                Game.Entity.dog.position[0] = 175;
                Game.Entity.dog.position[1] = 250;
                Game.Entity.dog.graphics.Enable();
                
                //Add Touch Event
                Game.States.MissionMap.callbackObject = psl.Input.Register.Touch.Event.End(Game.States.MissionMap.Touch);
                
            }
            Game.States.MissionMap.Exit = function(){
                
                //Disable Buttons
                Game.Entity.MissionMap.home.graphics.Disable();
                Game.Entity.MissionMap.map.graphics.Disable();
                Game.Entity.MissionMap.petshop.graphics.Disable();
                Game.Entity.MissionMap.settings.graphics.Disable();
                
                //Disable Locks
                Game.Entity.MissionMap.lockLvl1.graphics.Disable();
                Game.Entity.MissionMap.lockLvl2.graphics.Disable();
                Game.Entity.MissionMap.lockLvl3.graphics.Disable();
                Game.Entity.MissionMap.lockLvl4.graphics.Disable();
                
                //Disable Dog
                Game.Entity.dog.graphics.Animation.currentAnimation.loop = false;
                Game.Entity.dog.graphics.Disable();
                
                //Remove Touch Event
                psl.Input.Remove.Touch.Event.End(Game.States.MissionMap.callbackObject.id);
            }
            Game.States.MissionMap.Execute = function(owner, dt){
                //Update
                if(dt){
                    //Update Buttons
                    Game.Entity.MissionMap.home.graphics.Update(dt);
                    Game.Entity.MissionMap.map.graphics.Update(dt);
                    Game.Entity.MissionMap.petshop.graphics.Update(dt);
                    Game.Entity.MissionMap.settings.graphics.Update(dt);
                    
                    //Update Locks
                    Game.Entity.MissionMap.lockLvl1.graphics.Update(dt);
                    Game.Entity.MissionMap.lockLvl2.graphics.Update(dt);
                    Game.Entity.MissionMap.lockLvl3.graphics.Update(dt);
                    Game.Entity.MissionMap.lockLvl4.graphics.Update(dt);
                    
                    //Upate Dog
                    Game.Entity.dog.graphics.Update(dt);
                }
                
                
                //Draw Background
                psl.Graphics.DrawBackground();
                
                //Draw Buttons
                Game.Entity.MissionMap.home.graphics.Draw();
                Game.Entity.MissionMap.map.graphics.Draw();
                Game.Entity.MissionMap.petshop.graphics.Draw();
                Game.Entity.MissionMap.settings.graphics.Draw();
                
                //Draw Locks
                Game.Entity.MissionMap.lockLvl1.graphics.Draw();
                Game.Entity.MissionMap.lockLvl2.graphics.Draw();
                Game.Entity.MissionMap.lockLvl3.graphics.Draw();
                Game.Entity.MissionMap.lockLvl4.graphics.Draw();
                
                //Draw Dog
                Game.Entity.dog.graphics.Draw();
            }
            Game.States.MissionMap.callbackObject;
            Game.States.MissionMap.Touch = function(e){
                var st  = psl.Input.Get.State.Touch();
                
                var halfWidth = Game.Entity.MissionMap.home.graphics.scale[0] * 328/2;
                var halfHeight = Game.Entity.MissionMap.home.graphics.scale[0] * 210/2;
                
                var lockHalfWidth = Game.Entity.MissionMap.lockLvl1.graphics.scale[0] * 227/2;
                var lockHalfHeight = Game.Entity.MissionMap.lockLvl1.graphics.scale[0] * 194/2;
                
                //Home Button
                if(( (Game.Entity.MissionMap.home.position[0] + halfWidth) > st.lastX) && ( (Game.Entity.MissionMap.home.position[0]  - halfWidth) < st.lastX) ){
                    
                    //Play Menu Button - Mission Map
                    if(((Game.Entity.MissionMap.home.position[1] + halfHeight) > st.lastY) && ((Game.Entity.MissionMap.home.position[1] - halfHeight) < st.lastY)){
                        psl.Audio.Play("click");
                        Game.FSM.Transition("MainMenu");
                        
                        
                        
                    }
                }
                //Level 1 Lock
                else if( ((Game.Entity.MissionMap.lockLvl1.position[0] + lockHalfWidth) > st.lastX) && ( (Game.Entity.MissionMap.lockLvl1.position[0]  - lockHalfWidth) < st.lastX)){
                    //Level 1 Lock - Move to Level 1
                    if(((Game.Entity.MissionMap.lockLvl1.position[1] + lockHalfHeight) > st.lastY) && ((Game.Entity.MissionMap.lockLvl1.position[1] - lockHalfHeight) < st.lastY)){
                        psl.Audio.Play("happy");
                        Game.Entity.MissionMap.lockLvl1.graphics.Animation.active = true;
                        
                        Game.Entity.MissionMap.lockLvl1.graphics.Animation.onStop = function(){
                            Game.Entity.MissionMap.lockLvl1.graphics.Disable();
                            Game.Entity.dog.graphics.Animation.Set("right_run");
                            Game.Entity.dog.graphics.Animation.currentAnimation.loop = true;
                            
                            psl.Tween.Create(Game.Entity.dog.position[0],
                                             Game.Entity.MissionMap.lockLvl1.position[0],
                                             2000,
                                             function(dx){
                                                Game.Entity.dog.position[0] = dx;
                                            },
                                            function(){
                                                Game.Entity.dog.graphics.Animation.active = false;
                                                Game.FSM.Transition("Level1");
                                            })
                            psl.Tween.Create(Game.Entity.dog.position[1],
                                             Game.Entity.MissionMap.lockLvl1.position[1],
                                             2000,
                                             function(dy){
                                                if(Game.FSM.GetState() == "MissionMap")
                                                    Game.Entity.dog.position[1] = dy;
                                            })
                            
                        }
                    }
                }
            }
            
            //
            //  Level 1
            //
            Game.States.Level1 = psl.AI.State.Create("Level1");
            Game.States.Level1.Enter = function(){
                psl.Entity.background = Game.Assets.Images.Level1.background;
                
                //Enable Dog
                //Game.Entity.dog.graphics.Animation.Set("right_dig");
                Game.Entity.dog.graphics.Animation.Set("left_flip");
                Game.Entity.dog.graphics.Animation.active = false;
                Game.Entity.dog.position[0] = 865;
                Game.Entity.dog.position[1] = 675;
                Game.Entity.dog.graphics.Enable();
                
                //Enable Props
                    //Dog House
                Game.Entity.dogHouse.graphics.Enable();
                    //Bowl
                Game.Entity.bowl.position[0] = 100;
                Game.Entity.bowl.position[1] = 100;
                Game.Entity.bowl.physics.SetRotation(30 * Math.PI / 180);
                Game.Entity.bowl.physics.SetPosition([100,100]);
                //Game.Entity.bowl.physics.WakeUp();
                Game.Entity.bowl.physics.UnPause();
                Game.Entity.bowl.graphics.Enable();
                Game.Entity.bowl.font.enabled = true;
                    //Basket
                Game.Entity.basket.position[0] = 500;
                Game.Entity.basket.position[1] = 675;
                Game.Entity.basket.physics.SetPosition([513,714]);
                Game.Entity.basket.physics.UnPause();
                //Game.Entity.basket.physics.WakeUp();
                Game.Entity.basket.graphics.Enable();
                
                
                //Add Touch Event
                Game.States.Level1.callbackTouchEndObject = psl.Input.Register.Touch.Event.End(Game.States.Level1.TouchEnd);
                Game.States.Level1.callbackTouchMoveObject = psl.Input.Register.Touch.Event.Move(Game.States.Level1.TouchMove)
                
                //Enable Physics
                Game.physicsEnabled = true;
                
                Game.States.Level1.Instructions();
                //Game.States.Level1.ThrowBalls();
            }
            Game.States.Level1.Exit = function(){
                //Clear Event Q
                psl.Event.Clear();
                
                //Disable Physics
                Game.physicsEnabled = false;
                
                //Disable Dog
                Game.Entity.dog.graphics.Disable();
                
                //Disable Props
                    //Dog House
                Game.Entity.dogHouse.graphics.Disable();
                    //Dirt
                Game.Entity.dirt.graphics.Disable();
                    //Bowl
                Game.Entity.bowl.graphics.Disable();
                Game.Entity.bowl.physics.Pause();
                Game.Entity.bowl.font.enabled = false;
                    //Basket
                Game.Entity.basket.graphics.Disable();
                Game.Entity.basket.physics.Pause();
                    //Balls
                for(var i = 0; i <= 10; i++){
                    Game.Entity.balls[i].graphics.Disable();
                    Game.Entity.balls[i].physics.Pause();
                } 
                //Delete Font
                psl.Font.Remove(Game.States.Level1.font.parent.id);
                
                //Remove Touch Event
                psl.Input.Remove.Touch.Event.End(Game.States.Level1.callbackTouchEndObject.id);
                psl.Input.Remove.Touch.Event.End(Game.States.Level1.callbackTouchMoveObject.id);
                
                //Make sure no sounds are playing
                psl.Audio.Stop("whine");
                psl.Audio.Stop("dig");
                
                //Stop any remaining Tweens
                Game.States.Level1.tween ? psl.Tween.Remove(Game.States.Level1.tween.id): null;
            }
            Game.States.Level1.Execute = function(owner, dt){
                if(dt){
                    Game.Entity.dog.graphics.Update(dt);
                    Game.Entity.dogHouse.graphics.Update(dt);
                    Game.Entity.bowl.graphics.Update(dt);
                    Game.Entity.basket.graphics.Update(dt);
                    Game.Entity.dirt.graphics.Update(dt);
                    for(var i = 0; i <= 10; i++){
                        Game.Entity.balls[i].graphics.Update(dt);
                    }
                    
                    //Draw
                    psl.Graphics.DrawBackground();
                    Game.Entity.dogHouse.graphics.Draw();
                    Game.Entity.bowl.graphics.Draw();
                    Game.Entity.basket.graphics.Draw();
                    Game.Entity.dirt.graphics.Draw();
                    for(var i = 0; i <= 10; i++){
                        Game.Entity.balls[i].graphics.Draw();
                    }
                    Game.Entity.dog.graphics.Draw();
                    Game.Entity.dirt.graphics.Draw();
                }
            }
            Game.States.Level1.callbackTouchEndObject;
            Game.States.Level1.callbackTouchMoveObject;
            Game.States.Level1.tween = null;
            Game.States.Level1.Instructions = function(){
                    //Font
                var fontOptions = {
                        fontFamily: "Calibri",
                        size: "32px",
                        fontWeight: "bold",
                        alignment: "center",
                        fontColor: "#000000",//"#ffffff"
                        strokeColor: "#ffffff",
                        offset: [0,-50,0],
                        drawStroke: true
                    }
                Game.States.Level1.font = psl.Font.Write("Catch all of the 5's", 525, 450,fontOptions);
                Game.States.Level1.tween = psl.Tween.Create(32,100,5000,
                                function(size){
                                    size = size|0;
                                    Game.States.Level1.font.size = size + "px";
                                },
                                function(){
                                    psl.Font.Remove(Game.States.Level1.font.parent.id);
                                    Game.States.Level1.ThrowBalls();
                                })
                
            }
            Game.States.Level1.ThrowBalls = function(){
                Game.Entity.PhysicsWorld.ceiling.physics.onCollision = function(contactList){
                    
                    for(var i = contactList.length - 1; i >= 0; i--){
                        contactList[i].physics.Pause();
                    }

                }
                Game.Entity.dog.graphics.Animation.Set("right_dig");
                    //Dirt
                Game.Entity.dirt.position[0] = 885;//805;
                Game.Entity.dirt.position[1] = 715;//675;
                Game.Entity.dirt.graphics.Enable();
                    //Balls
                psl.Audio.Play("dig");
                for(var i = 0; i <= 10; i++){
                    psl.Event.Add(i.toString(),i * 500, i, function(ev){
                        Game.Entity.balls[ev.input|0].position[0] = 900;
                        Game.Entity.balls[ev.input|0].position[1] = 745;
                        Game.Entity.balls[ev.input|0].physics.SetPosition([900,745]);
                        Game.Entity.balls[ev.input|0].physics.SetLinearVelocity([-1500,-2500])
                        Game.Entity.balls[ev.input|0].physics.UnPause();
                        //Game.Entity.balls[ev.input|0].physics.WakeUp();
                        Game.Entity.balls[ev.input|0].graphics.Enable(); 
                    })            
                }
                psl.Event.Add("stand", 11 * 500, null, function(ev){
                    psl.Audio.Stop("dig");
                    Game.Entity.dirt.graphics.Disable();
                    Game.Entity.dog.graphics.Animation.Set("left_flip");
                    Game.Entity.dog.graphics.Animation.active = false;
                    
                    Game.States.Level1.DropBalls();
                })
            }
            Game.States.Level1.DropBalls = function(){
                Game.Entity.basket.physics.onCollision = function(contactList){
                    for(var i = contactList.length -1; i >= 0; i--){
                        if(contactList[i].graphics && (contactList[i].physics.type == "circle")){
                           
                           if(contactList[i].graphics.Animation.currentAnimation.name == "5"){
                                psl.Audio.Play("happy");
                                contactList[i].physics.Pause();
                                contactList[i].graphics.Disable();
                                Game.Entity.basket.graphics.Animation.active = true;
                                Game.Entity.dog.graphics.Animation.Set("left_flip");
                                Game.Entity.dog.graphics.Animation.onStop = function(){
                                    Game.Entity.dog.graphics.Animation.Set("left_flip");
                                    Game.Entity.dog.graphics.Animation.active = false;
                                    Game.Entity.dog.graphics.Animation.onStop = null;
                                }
                            }
                            else{
                                psl.Audio.Play("whine");
                                contactList[i].physics.Pause();
                                contactList[i].graphics.Disable();
                                Game.Entity.dog.graphics.Animation.Set("left_sad");
                                Game.Entity.dog.graphics.Animation.onStop = function(){
                                    Game.Entity.dog.graphics.Animation.Set("left_flip");
                                    Game.Entity.dog.graphics.Animation.active = false;
                                    Game.Entity.dog.graphics.Animation.onStop = null;
                                }
                            }
                            
                        }
                        
                    }

                }
                for(var i = 0; i <= 10; i++){
                    psl.Event.Add(i.toString(),i * 500, i, function(ev){
                        //Game.Entity.balls[ev.input|0].position[0] = 900;
                        //Game.Entity.balls[ev.input|0].position[1] = 745;
                        //Game.Entity.balls[ev.input|0].physics.SetPosition([900,745]);
                        Game.Entity.balls[ev.input|0].physics.SetLinearVelocity([0,0])
                        Game.Entity.balls[ev.input|0].physics.UnPause();
                        //Game.Entity.balls[ev.input|0].physics.WakeUp();
                        Game.Entity.balls[ev.input|0].graphics.Enable(); 
                    })            
                }
            }
            Game.States.Level1.TouchMove = function(e){
                var st  = psl.Input.Get.State.Touch();
                Game.Entity.basket.physics.SetPosition([st.lastX, st.lastY]);
            }
            Game.States.Level1.TouchEnd = function(e){
                var st  = psl.Input.Get.State.Touch();
                
                var halfWidth = Game.Entity.dogHouse.graphics.scale[0] * 512/2;
                var halfHeight = Game.Entity.dogHouse.graphics.scale[0] * 512/2;
                
                //Home Button
                if(( (Game.Entity.dogHouse.position[0] + halfWidth) > st.lastX) && ( (Game.Entity.dogHouse.position[0]  - halfWidth) < st.lastX) ){
                    
                    //Play Menu Button - Mission Map
                    if(((Game.Entity.dogHouse.position[1] + halfHeight) > st.lastY) && ((Game.Entity.dogHouse.position[1] - halfHeight) < st.lastY)){
                        psl.Audio.Play("click");
                        Game.FSM.Transition("MainMenu");
                        
                        
                        
                    }
                }
            }
            
        }
    },
    States: {
        MainMenu: null,
        MissionMap: null,
        Level1: null
    },
    physicsEnabled: false,
    lastUpdate: null,
    Run: function(){
        time = psl.Get.Time()
        dt = time - Game.lastUpdate;
    
        Game.lastUpdate = time;
        
        psl.Event.Update(dt);
        if(Game.physicsEnabled)
            psl.Physics.Update(dt);
        psl.Tween.Update(dt);
        
        Game.FSM.Update(dt);
        //psl.Graphics.Update(dt);
        //psl.Graphics.Draw();
        psl.Font.Draw();
        //psl.Physics.Draw();

        window.requestAnimFrame(Game.Run);
    }
}