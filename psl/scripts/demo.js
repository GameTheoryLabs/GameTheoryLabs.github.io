window.onload = function(){
    
    Demo.StartUp();
    
    //Demo.Audio();
    //Demo.Images();
    //Demo.Animations();
    //Demo.Entity();
    //Demo.Graphics();
    Demo.Physics();
    //Demo.AI();
    //Demo.Font();
    //Demo.Events();
    //Demo.Tween()
    //Demo.Memory();
    //Demo.Input();

}
Demo = {
    currentDemo: null,
    BaseClasses: function(){
        /**
         *  These are classes used inside of the engine
         *  They are exposed via the Classes interface, so you
         *  can create objects of these types in game, or use them
         *  as base classes and inherit from them
         */
        
        /**
         *      Priority Queue
         *  Constructor:
         *      Input:
         *          low: bool true, sorts with lowest number first
         *  Methods:
         *      pop: Removes and returns next element in queue
         *      top: Returns,without removing, next element in queue
         *      includes: returns true if object is in queue
         *          input:
         *              object: obj to test
         *      size: returns number of elements in queue
         *      empty: returns true if queue is empty
         *      push: Adds object to queue with priority
         *          input:
         *              object: item to push into queue
         *              priority: number to use for sorting
         *      clear: removes all elements from queue
         */
        psl.Classes.PriorityQueue;

        /**
         *      HTML Element
         *  A wrapper around html element to allow for easier
         *      manipulation of classes parent/child appending
         *  Constructor:
         *      Input:
         *          tag: string representing HTML element
         *  Properties:
         *      html: native html element
         *  Methods:
         *      AppendClass: class name to append to html object
         *          Input:
         *              sClass: string class name
         *      AppendChild: Append html element to object
         *          Input:
         *              childHTML: native html object to be appended
         *      AppendToID: Append object to HTML element with given ID
         *          Input:
         *              parentID: ID of HTML element to append too
         *      AppendToHTML:Append object to HTML element
         *          Input:
         *              parentHTML: HTML object to append too
         *      RemoveClass:Remove CSS class from object
         *          Input:
         *              sClass: string of class Name to remove from html object
         *      RemoveChild: Remove html child element with given ID
         *          Input:
         *              id: id of html element to remove
         *      RemoveAllClasses: Remove all CSS classes from object
         *      RemoveAllChildren: Remove all html child elements from object
         *      SetHTML: set html property to html element object passed in
         *          Input:
         *              oHTML: native html object 
         *      CreateHTML: create HTML element from give tag and initalize html property
         *          Input:
         *              tag: string tag of HTML element to create
         *          
         *      
         */
        psl.Classes.HTMLElement;
        psl.Create.HTML("div");
        
        /**
         *      Map
         *  key/value hash table (associative array)
         *
         *  Properties:
         *      current: pointer to current object in map
         *      size: number of objects in map
         *      isLinked: bool if entrires in map are linked together
         *  Methods:
         *      get: returns object in map with supplied key
         *          Input:
         *              key: key value for object
         *      put: stores object in map with given key
         *          Input:
         *              key: id for value to store in map
         *              value: object to store in map
         *      remove: removes object from map
         *          Input:
         *              key: key of object to remove
         *      removeAll: Removes all objects from map
         *      next: moves current pointer to point to next item in map
         *      key: returns key of current object
         *      value: returns value of current object
         *      listValues: returns array of all values in map
         *      listKeys: returns array of all keys in map
         *      toString: returns string of key, values of map
         */
        psl.Classes.Map;
        psl.Create.Map();
    },
    StartUp: function(){
        //First step is to get a copy of engine
        psl = com.playstylelabs.Instance();
        
        /**
         *  For Ludei,  you need to create a canvas
         *  element using JavaScript
         */
        var canvas = document.createElement("canvas");
        canvas.id = "background";
        canvas.className = "background";
        document.body.appendChild(canvas);
        
        /**
         * The engine is capable of using HTML Div
         * elements, or using canvas, so you must identify
         * which system you are using for rendering on startup
         */
        
        //Save canvas to engine
        psl.Entity.canvas = canvas;
        
        //Options: useCanvas, canvas, and background
        psl.Entity.Initialize({useCanvas: true, canvas: psl.Entity.canvas});
    },
    Audio: function(){
        Demo.currentDemo = "AUDIO";
        
        /**
         *Audio API
         *
         *The Audio Manager handles loading and playing sounds
         *  --At this point, only a single filename can be used for
         *  a given sound, this prevents the engine from picking the
         *  right format (mp3/4, ogg, wav) based upon the platform
         */
        
        /**
         *      Audio Manager
         *
         *Properties:
         *  map: a key/value map that stores all Sound objects
         *Methods:
         *  Load: Loads a sound in Audio Manager
         *  Play: Plays a sound in Audio Manager
         *  Stop: Stops a sound in Audio Manager
         *  Volume: Adjust volume for all sounds in Audio Manager
         */
        
        var parameters = {
            urls:       ['sounds/button-click.mp3'],    //Array of urls
            autoplay:   false,
            loop:       false,
            volume:     1.0,
            onload:     function(){
                console.log("Song Loaded");
                //Play
                psl.Audio.Play("click");

                //Play Again 1 sec later, at new volume level
                setTimeout(function(){
                    /**
                    *Volume
                    *  This is master volume for all sound, it will
                    *  adjust all sounds to this leve
                    * Input
                    * volume: a nubmer between 0 - 1
                    */
                    psl.Audio.Volume(0.1);
               
                    psl.Audio.Play("click");
                }, 1500);
            },
            onend:      function(){
                console.log("Song ended");
            }
        }
        
        /**
         *Load Audio file
         *  Inputs:
         *  ID: a string used to store and retireve audio file
         *  parameters: object that defines the audio file
         */
        psl.Audio.Load("click", parameters);
        
        
        /**
         *Pause
         *  This will pause the sound, and upon playing
         *  the sound will resume at the point it was stopped
         */
        psl.Audio.Pause("click");
        
        /**
        * Stop
        * This will stop the sound, and upon playing the
        * sound will start from beginning
        */
       psl.Audio.Stop("click");
        
        
        
        /**
         * map
         *
         * This is map that stores all sounds created
         * Using the key/ID defined, you can get access
         * to the native sound object and have access to all
         * native HTML properties
         */
        var snd =  psl.Audio.map.get("click");
    },
    Images: function(){
        Demo.currentDemo = "IMAGES";
        /**
         *      Image Loading
         *Images can be loaded piecemail via the LoadImage call
         *      or
         *The can be loaded via the Animations interface as a spritesheet
         *
         *Any image can be stored as a sprite sheet, its properties just
         *need to reflect it is a single cell, with width and height equal
         *to size of image
         *
         *Any image that will be used on an entity needs to be loaded using
         *the Animation JSON file.  This allows it to be placed in the system
         *and accessed by the graphcis portion of an entity
         */
        
        /**
         *  Load Image
         *  This will create an HTML img object, but not attach to boy
         *  Inputs:
         *  sURL: a string for the image URL
         *  callback: A callback function executed upon image loading
         */
        var background = psl.Graphics.LoadImage("images/backgrounds/MainMenu/MainMenu.png",
                                                function(a){
                                                    psl.Entity.background = background;
                                                    psl.Entity.canvas.width = 1024; 
                                                    psl.Entity.canvas.height = 768; 
                                                    psl.Entity.ctx.drawImage(psl.Entity.background.html, 0, 0);
                                    
                                                });
        

    },
    Animations: function(){
        Demo.currentDemo = "ANIMATIONS";
        
        /**
         *  SpriteSheet Object
         *  Properties:
         *      img:        HTML img object
         *      width:      number width of sprite sheet
         *      height:     number height of sprite sheet
         *      cellWidth:  number width of animation cell
         *      cellHeight: number height of animation cell
         *      rows:       number of rows in sprite sheet
         *      columns:    number of columns in sprite sheet
         *      path:       string url of sprite sheet
         *      id:         number id of sprite sheet
         *      name:       string name of sprite sheet, during
         *                  constructor, will create a dynamic CSS
         *                  class using name
         *  Methods:
         *      BuldClass:
         *          Will generate a dynamic CSS class describing
         *              sprite sheet, and append to css file
         *          input: sClassName
         *      GetClass:
         *          Returns CSS class name
         */

        
        /**
         *  AnimationFrame Object
         *  Properteis:
         *      x: position
         *      y: position
         *      width: frame width
         *      height: frame height
         *      frame: frame number
         *      row: spritesheet row
         *      column: spritesheet column
         *      sheet: sprite sheet object
         */
        
        
        
        /**
         *      Animation Manager
         *  Properties:
         *      spritesheets: key/value map that stores all CSpriteSheet Objects
         *      animations: key/value map that stores all CAnimation Objects
         *  Methods:
         *      LoadJSON: loads animations/spritesheets/images in json file
         *      AddFrames: add frames from one animation to another
         *      AddFramesReverse: reverse and add frames from source to target animation
         *      ReverseFrames:  Reverse frames in an animation
         */ 
        
        /** LoadJSON
         *
         * This will load the JSON file that list all animations/images
         * to be used in game.  Upon loading it will create all the required
         * SpriteSheet, Animation, and AnimationFrame objects and store in
         * grpahics systems.  Upon completion the graphics system will have access
         * to all animation objects and information.
         *
         * Input:
         * URL: sting representing the url for json
         * callback: a Callback function that will executed upon completeion
         */
        psl.Animation.LoadJSON("images/spritesheets/animations.json",
            function(){
                //All Animations/Images listed in JSON have been loaded
                //  At this point you can manipulate or modify in any way
                console.log(psl.Animation.animations.size + ": Animations Loaded\n" + psl.Animation.spritesheets.size + ": SpriteSheets loaded");
                
                /**
                *  Animation Object
                *  Constructor:
                *      ID: string that represents name/ID of animation
                *      options:
                *          name: string ID
                *          numOfFrames:  number of frames in animation
                *          startRow: starting row in sprite sheet
                *          startColumn: starting column in sprite sheet
                *          spriteSheet: CSpriteSheet object
                *          speed: number, miliseconds per frame
                *  Properties:
                *      frames:         Array holding AnimationFrame objecdts
                *      name:           string ID of animation object
                *      sheet:          CSpriteSheet Object that animation frames are pulled from
                *      numOfFrames:    Number of animaiton frames
                *      speed:          miliseconds per frame
                *      loop:           bool value
                */
               var options = {
                           name: "right_run_extended",
                           spriteSheet: psl.Animation.animations.get("right_run").sheet,
                           speed: 80
                       }
               var right_run_extended = psl.Create.Animation("right_run_extended", options);
            
        
        
                /**
                 *  Get a loaded animation using Animation Manager animation map
                 */
                var right_run = psl.Animation.animations.get("right_run");
                
                
                /**
                 * AnimationManager: AddFrames
                 * This method will take the animation frames from a source animaton and
                 *  adds them to the animation frames of a target.  This allows you to
                 *  create/custiomize animations using the loaded animation objects
                 *  Inputs:
                 *      target: Animation ID frames are being added too
                 *      source: Animation ID frames are being taken from
                 */
                
                psl.Animation.AddFrames("right_run_extended", "right_run");
                psl.Animation.AddFrames("right_run_extended", "right_run");
                psl.Animation.AddFrames("right_run_extended", "right_run");
                psl.Animation.AddFrames("right_run_extended", "right_run");
                psl.Animation.AddFrames("right_run_extended", "right_run");
                psl.Animation.AddFrames("right_run_extended", "right_run");
                
                /**
                 *  Animation Manager:  ReverseFrames
                 *  This method will reverse the animation frames stored in
                 *      animation object
                 *  Input:
                 *      source: Animation ID for animation object
                 */
                psl.Animation.ReverseFrames("right_sit");
                
                /**
                 *  AnimationManager: AddFramesReversed
                 *  This method will reverse the frames of source object,
                 *  then add them to target animation
                 *  Inputs:
                 *      target: Animation ID frames are begin added too
                 *      source: Animation ID frames are being taken from
                 */
                psl.Animation.AddFramesReverse("right_sit", "left_sit");
                
            });        
    },
    Entity: function(){
        Demo.currentDemo = "ENTITY";
        /**
         *      Entity System
         *
         * The engine uses a composition entity system.  A base
         * entity object is created, and stores common properties
         * to be used/shared between other subsytems (graphics, physics)
         *
         * Once an entity object is created, it can be extended with physyics
         * or graphics
         *
         */
        
        /**
         *      Entity Manager
         *      
         *  Properties:
         *      useCanvas: bool that states which render system is being used
         *      canvas: HTML canvas object used for rendering
         *      ctx: 2D drawing contex of canvas
         *      container: HTML container div for entities, when using Div rendering
         *      background: CHTMLElement object of an image for background
         *      map:  key/value map that stores all entities created
         *  Method:
         *      Initizlize: Sets up Entity systm for given rendering system
         *          Input:
         *              options: An object that describes system
         *                  useCanvas: bool, that defines rendering system
         *                  canvas: HTML canvas object
         *                  background: image to be used in backgrounc
         *      Create: Generates and register an Entity object
         *          Input:
         *              options: Object with entity options
         *                  width:  width of object, animation cell will be used in canvas system
         *                  height: height of object, animation cell will be sued in canvas system
         *                  position: Array [x,y,z]
         *                  rotation: Array [yaw, pitch, roll] (in 2D only yaw is used)
         */
        
        psl.Entity;
        
        /**
         *      Entity Object
         *  Properties:
         *      id: number ID assigned by engine
         *      width:  number width of entity, animation cell will be used in graphics
         *      height: number width of entity, animation cell will be used in graphics
         *      position: Array [x,y,z] for position of object
         *      rotation: Array [yaw, pitch, roll] for object rotation, in 2D only yaw used
         *      container: Div container for entity, only used in Div based rendering
         *      canvas: Entity Manager canvas object
         *      ctx:    Entity Manager 2D context
         *      physics: Physics Object
         *      graphics: Graphics Object
         *      font: Font Object
         *  Methods:
         *      AddGraphics: Adds graphics to entity
         *      AddPhysics:  Adds physics to entity
         *      AddText:     Adds a font to entity
         *          Input:
         *              options: object
         *                  text: string to be drawn
         *                  enabled: bool, will not draw text if false
         *                  size: defaults to "24px"
         *                  fontFamily: defaults to "Courier"
         *                  baseline: defaults to "alphabetic"
         *                  alignment: defaults to "start"
         *                  drawFill: bool
         *                  drawStroke: bool
         *                  fontColor: defaults to "#000000"
         *                  strokeColor:defautls to "#000000"
         *                  offset: Array defaults to [0,0,0]
         *      Update
         *          Input: Update entity, calls graphics update if enabled
         *              dt: time elapsed in miliseconds since last frame
         *  
         */
        var options = {
            width: 50,
            height: 50,
            position: [50,100,0],
            rotation: [0,0,0]
        }
        var ent = psl.Entity.Create(options);
    },
    Graphics: function(){
        
        //Need to setup Demo
        Demo.Animations();  //Loads Animations for characters
        Demo.currentDemo = "GRAPHICS";
        /**
         *      Graphics Manager
         *  Properties:
         *      map: Map holding all created graphcis objects
         *      images: Map holding all image objects
         *  Methods:
         *      LoadImage: Creates an html img object and returns it
         *          Input:
         *              sURL: string holding url of image
         *              callback: function called upon loading image
         *      Create.SpriteSheet: Creates and stores SpriteSheet object
         *          Input:
         *              sName: sprite sheet name
         *      Create.Animation: Creates and stores Animation object
         *          Input:
         *              sName: string name for animation
         *              options: object hodling options
         *                  name: string ID
         *                  numOfFrames:  number of frames in animation
         *                  startRow: starting row in sprite sheet
         *                  startColumn: starting column in sprite sheet
         *                  spriteSheet: CSpriteSheet object
         *                  speed: number, miliseconds per frame   
         *      Extend: Adds graphics to Entity object
         *          Input:
         *              oEntity: Entity object acting as parent to graphics
         *      Update: Updates all registerd graphics objects in map
         *          Input:
         *              dt: number of miliseconds since last update
         *      DrawBackground: Draws registered background to canvas
         *      Draw: Draw all registerd objects to canvas or updates HTML object
         *      
         */
        
        /**
         *      Graphics Object
         *
         *  Properties:
         *     enabled: bool, is graphcis on (drawing)
         *     scale: array storing scale [Sx,Sy,Sz]
         *     offset:array offset from parent [x,y,z]
         *     matrix: tranformation matrix
         *     parent: Entity object graphics is attached too
         *     canvas: Entity managers canvas object
         *     container: div container used for graphics is html rendering mode
         *     Animation. Object storing animation properties for graphcis object
         *          list:  Map object storing all loaded animations
         *          currentFrame: current frame in current animation
         *          lastUpdate: miliseconds since last update
         *          active: bool, if active, object animates
         *          onStop: callback for when animation stops
         *          onStopScope: scope object for onStop callback
         *          onStart: callback for when animation starts
         *          onStartScope: scope object for onStart callback
         *          Add: Add animation
         *              Input:
         *                  sName: key for animation in map
         *          Remove: Remove animation
         *              Input:
         *                  sName: key for animation in map
         *          Set: Set active animation
         *              Input:
         *                  sName: key for animation in map
         *          Update: update animation
         *              Input:
         *                  dt: miliseconds since last update
         *          Start: Starts animation
         *          Stop: Stops animation
         *  Methods:
         *      Disable: disable graphics (stops drawing of object)
         *      Enable: enables graphcis (starts drawing of object)
         *      UpdateMatrix: method is set based upon rendering
         *          updates transformation matrix
         *      Draw: method is set based upon rendering, draws object
         *      Udpate: Updates object, set based upon rendering system
         *      Scale: method is set based upon rendering, sets scale of object
         *          Input:
         *              scale: array [Sx,Sy,Sz]
         */
        
        //Load Background -- See Images demo
        var background = psl.Graphics.LoadImage("images/backgrounds/MainMenu/MainMenu.png",
            function(a){
                psl.Entity.background = background;
                psl.Entity.canvas.width = 1024; 
                psl.Entity.canvas.height = 768; 
                psl.Entity.ctx.drawImage(psl.Entity.background.html, 0, 0);
                
                
                
                //Create an Entity
                var options = {
                    width: 50,
                    height: 50,
                    position: [200,200,0],
                    rotation: [45 * Math.PI/180,0,0]
                }
                var dog = psl.Entity.Create(options);
                
                //Add Graphics
                dog.AddGraphics();
                
                //Load Animations
                dog.graphics.Animation.Add("right_run_extended");
                dog.graphics.Animation.Add("right_flip");
                
                //Set Active Animations
                dog.graphics.Animation.Set("right_run_extended");
                
                //Enable callback to flip between loaded animations
                dog.graphics.Animation.onStop = function(){
                    if (dog.graphics.Animation.currentAnimation.name == "right_run_extended"){
                        dog.graphics.Animation.Set("right_flip");
                    }
                    else{
                        dog.graphics.Animation.Set("right_run_extended");
                    }
                }
                
                //Scale grpahics              
                dog.graphics.Scale([0.5,0.5,0.5]);
                
                //Start game loop
                Demo.GameLoop();

            });
    },
    Physics: function(){
        
        //Need to setup Demo
        Demo.Animations();  //Loads Animations for characters
        Demo.currentDemo = "PHYSICS";
        /**
         *      Physcis Manager
         *  Properties:
         *      map: Map object of all physics objects
         *      world: pointer to box2D world object
         *  Methods:
         *      Extend:  Add physics to CEntity object passed as input
         *      Update:  Updates physics world and all object
         *          Input:
         *              dt: number of miliseconds since last update
         *      Draw:Debug tool used to draw physics objects on canvas
         *
         */
        
        
        /**
         *      Physics Object
         *
         *  Properties:
         *      shape: box2D shape
         *      body: box2D body object
         *      type: string for object type, circle or box
         *      parent:Entity object that physics applies too
         *      canvas: Entity Manager canvas object
         *      container: html element container when using HTML renndering
         *      world: pointer to box2D physics world
         *      fixed: bool, is object fixed in space
         *      paused:bol, is object active or removed from physics updates
         *      _linearVelocity: private linearVelocity, allows for upating while paused
         *      _angularVelocity:private angularVelocity, allows for updating while paused
         *      onCollision: callback when object collides
         *      circleDef: box2D circle defintion
         *      boxDef: box2D box defintion
         *      bodyDef: box2D body definition
         *  Methods:
         *      MakeCircle: Sets physics object as circle
         *          Input:
         *              radius: number representing radius
         *      MakeBox: Sets physics object as Box
         *          Input:
         *              halfWidth: number of halfWidth
         *              halfHeight: number of halfHeight
         *              fixed: bool, is object fixed in space
         *      Update: Updates parent entity properties with physics values
         *          Input:
         *              dt: miliseconds since last update
         *      GetPosition: returns array of position [x,y]
         *      GetOriginPosition:returns array of origin position [x,y]
         *      GetRotation: returns number for rotation in radians
         *      GetLinearVelocity: returns array of linear velocity [x,y]
         *      GetAngularVelocity:returns number of angular velocity
         *      GetRadius:return radius value for object
         *      GetMass:return mass of object
         *      GetContactList: returns list of Entity objects in contact with physics object
         *      GetNumContacts: returns number of objects contacting physics object
         *      SetPosition: Sets position of object
         *          Input:
         *              position: array [x,y]
         *      SetOriginPosition: Sets origin position of object
         *          Input:
         *              position: array [x,y]
         *      SetRotation: Sets rotation of physics object in radians
         *          Input:
         *              rotation: rotation in radians
         *      SetLinearVelocity: Set linear velocity of object
         *          Input:
         *              velocity: array for velocity [x, y]
         *      SetAngularVelocity: Sets angular velocity of object
         *          Input:
         *              velocity: number for angular velocity
         *      AddForce: Apply force to object
         *          Input:
         *              force: Array force to apply
         *              worldPoint: Array point in world to apply
         *      AddTorque: Apply torque to object
         *          Input:
         *              torque: Array force to apply
         *      Contacted:returns true if object has contact, false otherwise
         *      Freeze: Disabled, use Pause instead
         *      Pause: Stops updates and remove object from collision detection
         *      UnPause: Resume physics operations on objects
         *      IsPaused: returns true if object is currently paused
         *      IsFrozen: returs true if object is forzen
         *      IsSleeping: returns true if object is sleeping
         *      AllowSleeping: Set object ability to sleep
         *          Input:
         *              allowSleep: bool, for sleeping property
         *      WakeUp: Wakes up physics object from sleeping
         *      
         */
        //Load Background -- See Images demo
        var background = psl.Graphics.LoadImage("images/backgrounds/MainMenu/MainMenu.png",
            function(a){
                psl.Entity.background = background;
                psl.Entity.canvas.width = 1024; 
                psl.Entity.canvas.height = 768; 
                psl.Entity.ctx.drawImage(psl.Entity.background.html, 0, 0);
                
                
                //Set up bounding walls
                var leftWall, rightWall, floor, ceiling;
                
                var canvasWidth = 1024; //psl.Entity.canvas.width;
                var canvasHeight = 768; //psl.Entity.canvas.height;
                
                floor = psl.Entity.Create({position: [canvasWidth/2, canvasHeight+50, 0]});
                floor.AddPhysics();
                floor.physics.MakeBox(canvasWidth, 55, true);
                
                ceiling = psl.Entity.Create({position: [canvasWidth/2, -canvasHeight, 0]});
                ceiling.AddPhysics();
                ceiling.physics.MakeBox(canvasWidth, 50, true);
                
                left = psl.Entity.Create({position: [-50, 0, 0]});
                left.AddPhysics();
                left.physics.MakeBox(55, canvasHeight*2, true);
                
                right = psl.Entity.Create({position: [canvasWidth+50, 0, 0]});
                right.AddPhysics();
                right.physics.MakeBox(55, canvasHeight*2, true);
                
                //Creaet bouncing balls
                var balls = [];
                for(var i = 0; i <= 10; i++){
                    balls[i] = psl.Entity.Create({width: 0, height: 0, position: [i*5 + 100,200,0], rotation:[0,0,0]});
                    balls[i].AddGraphics();
                    balls[i].graphics.Animation.Add(i.toString());
                    balls[i].graphics.Animation.Set(i.toString());
                    balls[i].graphics.Animation.active = false;
                    balls[i].graphics.Scale([1,1,1]);
                    //balls[i].graphics.Disable();
                    balls[i].AddPhysics();
                    balls[i].physics.MakeCircle(16); //Making balls half size, so physcis and graphcis can be seen at same time
        
                }
                
                Demo.GameLoop();
            })
    },
    AI: function(){
        Demo.currentDemo = "AI";
        /**
         *      AI Manager
         *  Methos
         *      FSM.Create: Creates a Finite State Machine
         *          Input:
         *              oEntity: object that owns FSM, passed as input to states
         *      States.Create: Creates a State Object
         *          Input:
         *              sName: string used for state name
         *      State.Get: Returns state object
         *          Input:
         *              sName: state name, used to store in map
         */
        psl.AI;
        
        /**
         *          Finite State Machine
         *  Methods:
         *      Transition:  Transition FSM to new state, Calls Exit of Current State,
         *                  and Enter and Execute of new state
         *          Input:
         *              sName: string name of State to transition too
         *              oMessage: object passed to new state on transition
         *      SetState: Sets current state without transitions
         *          Input:
         *              sName: string name of state to set
         *      Update: calls execute on current state of FSM
         *          Input:
         *              oMessage: object passed to Execute of current state
         *      GetState: Returns name of current state
         */
        //psl.AI.FSM.Create(psl.Entity.Create());
        
        /**
         *          State
         *  Methods:
         *      GetName: returns name of state
         *      Enter: Called when etering in state
         *          Input:
         *              cEntity: owner of FSM calling state
         *              oMessage: object passed as message in Transition
         *      Exit: Called when leaving a state
         *          Input:
         *              cEntity: owner of FSM calling state
         *              oMessage: object passed as message in Transition
         *      Execute:  Called when FSM calls Update
         *          Input:
         *              cEntity: owner of FSM calling state
         *              oMessage: object passed as message in Update
         */
        //psl.AI.State.Create("stateName");
        var options = {
            width: 50,
            height: 50,
            position: [50,100,0],
            rotation: [0,0,0]
        }
        var ent = psl.Entity.Create(options);
        
        //If an entity is passed into construtor, it will be passed
        //  as input to all state changes, otherwise it will be null
        var fsm = psl.AI.FSM.Create(ent);
        
        //Load State: Load Sound
        //  Transitions to Play state once sound has loaded
        //      passes auido key as message
        //      on Exit, changes volume to max
        var loadState = psl.AI.State.Create("load");
        loadState.Enter = function(owner, message){
            var parameters = {
                urls:       ['sounds/button-click.mp3'],    //Array of urls
                autoplay:   false,
                loop:       false,
                volume:     0.1,
                onload:      function(){
                    fsm.Transition("play", "click");
                }
            }
    
            psl.Audio.Load("click", parameters);
        }
        loadState.Exit = function(owner, message){
            psl.Audio.Volume(1.0);
        }
        loadState.Execute = function(owner, message){
            
        }
        
        //Play State: Plays sound key passed as message when executed
        var playState = psl.AI.State.Create("play");
        playState.Enter = function(owner, message){
            
        }
        playState.Exit = function(owner, message){
            
        }
        playState.Execute = function(owner, message){
            psl.Audio.Play(message);
        }
        
        
        
        //Transition to Load State
        fsm.Transition("load", {msg: "hello world"});
    
    },
    Font: function(){
        Demo.currentDemo = "FONT"
        /**
         *          Font Manager
         *  Properties
         *      map: stores all font objects
         *  Methods:
         *      Extend: Adds font to an Entity
         *          Input:
         *              oEntity: Entity object to attach font too
         *              options: object will properties of font
         *                  text: string to be printed
         *                  fontStyle: default normal
         *                  fontVariant: default normal
         *                  fontWeight: default normal
         *                  fontFamily: default Courier
         *                  size: default 24px
         *                  alignment: default start
         *                  baseline: default alphabetic
         *                  fontColor: default #000000
         *                  strokeColor default #000000
         *                  drawFill: default true
         *                  drawStroke: default false
         *                  offset: Array [x,y,z]
         *      Draw:   Draws all fonts in map
         *      Write: Creates and returns font object without attaching to an Entity
         *          Input:
         *              sText: string to print
         *              x: position in x
         *              y: position in y
         *              font: options of font object
         *      Remove: Removes font object from map
         *          Input:
         *              id: font id
         */
        psl.Font;
        
        /**
         *      Font Object
         *
         *  Properties:
         *      canvas: Entity canvas object
         *      context: Entity 2D context
         *      parent: Entity font is registerd too
         *      enabled: bool, is font drawing turned on
         *      text: string to be printed
         *      fontStyle: default normal
         *      fontVariant: default normal
         *      fontWeight: default normal
         *      fontFamily: default Courier
         *      size: default 24px
         *      alignment: default start
         *      baseline: default alphabetic
         *      fontColor: default #000000
         *      strokeColor default #000000
         *      drawFill: default true
         *      drawStroke: default false
         *      offset: offset from parent position Array [x,y,z]
         *  Methods:
         *      SetText
         *      SetFontStyle
         *      SetFontVariant
         *      SetFontWeight
         *      SetFontFamily
         *      SetSize
         *      SetAlignment
         *      SetBaseline
         *      SetColor
         *      SetStrokeColor
         *      SetFillVisible
         *      SetStrokeVisible
         *      SetOffset
         *      Draw
         *      Delete
         */
        //Load Background -- See Images demo
        var background = psl.Graphics.LoadImage("images/backgrounds/MainMenu/MainMenu.png",
            function(a){
                psl.Entity.background = background;
                psl.Entity.canvas.width = 1024; 
                psl.Entity.canvas.height = 768; 
                psl.Entity.ctx.drawImage(psl.Entity.background.html, 0, 0);
                
                
                var options = {
                    width: 50,
                    height: 50,
                    position: [150,100,0],
                    rotation: [0,0,0]
                }
                var ent = psl.Entity.Create(options);
                
                ent.AddText({
                    text: "Entity",
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
                
                Demo.GameLoop();
        })
    },
    Events: function(){
        Demo.currentDemo = "EVENTS";
        /**
         *          Event Manager
         *  Properteis:
         *      q: Priority Queue object
         *  Methods:
         *      Clear: empties event q
         *      Add: Creates an event and push to q based upon delivery time
         *          Input
         *              tag: string name used to identify event
         *              delay: delay in miliseconds for event deliver/trigger
         *              input: passed to input of callback function
         *              fn: callback function
         *              scope: scope to apply to callback function (optional)
         *      Update: Updates q and delivers any pending events
         *          Input:
         *              dt: miliseconds since last update
         */
        psl.Event;
        
        /**
         *          Event Object
         *  Properties:
         *      id: unique ID for event
         *      tag: tag supplied by user to define event
         *      delay: time delay in miliseconds for event
         *      input: input passed by user for callback
         *      exe: callback function
         *      scope: scope to be applied to callback function
         *      deliveryTime: time in miliseconds for delivery
         *  Methods:
         *      Execute: Calls callback and passes Event object as input
         *      
         */
        var parameters = {
            urls:       ['sounds/button-click.mp3'],    //Array of urls
            autoplay:   false,
            loop:       false,
            volume:     1.0,
            onload:     function(){
                console.log("Song Loaded");
                //Play
                psl.Audio.Play("click");

                //Play Again 3.5 sec later, at new volume level
                psl.Event.Add("play sound", 3500, psl,
                              function(e, input){
                                    psl.Audio.Volume(0.1);
                                    psl.Audio.Play("click", parameters);
                               });

            },
            onend:      function(){
                console.log("Song ended");
            }
        }
        
        
                 //tag, delay, input, fn, scope
        psl.Event.Add("load sound", 1000, psl, function(e, input){
             psl.Audio.Load("click", parameters);
        });
        
        Demo.GameLoop();
    },
    Tween: function(){
        Demo.currentDemo = "TWEEN";
        /**
         *          Twen Manager
         *  Properties:
         *      map: Map that holds all tween objects
         *  Methods:
         *      Remove: removes tween from map with given id
         *          Input:
         *              id: id of tween to remove
         *      Update: loops through all tween in map and updates
         *          Input:
         *              dt: miliseconds since last update
         *      Create: Creates a new Tween and adds to map
         *          Input:
         *              start: number start value
         *              stop: number stop value
         *              time: transition time in miliseconds for tween to occur
         *              fn: function to call on each tween update
         *              onEnd: function to call when tween event has concluded
         */
        
        /**
         *          Tween Object
         *  Properties
         *      id: unique id assigned by Tween Manager
         *      active: bool, when false removed from Tween Manager map
         *      fn: user defined callback function, tween object passed as input
         *      start: start time in miliseconds of tween
         *      stop: stop time in miliseconds of tween
         *      totalTime: total time for tween occurs over
         *      velocity: change per milisecond in value for tween
         *      count: number of times tween has been called
         *      timeElapsed: miliseconds elapsed since tween created
         *      value: current value of tween
         *      callback: user callback function
         *  Methods
         *      Update: called by Tween Manager to update tween object
         *          Input:
         *              dt: time in miliseconds since last update
         *      
         */
        
                
        //Load Background -- See Images demo
        var background = psl.Graphics.LoadImage("images/backgrounds/MainMenu/MainMenu.png",
            function(a){
                psl.Entity.background = background;
                psl.Entity.canvas.width = 1024; 
                psl.Entity.canvas.height = 768; 
                psl.Entity.ctx.drawImage(psl.Entity.background.html, 0, 0);
                
                
        
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
                var myTextObject = psl.Font.Write("Tweening an Object", 250, 250, fontOptions);
        
                
                //Tween position of object
                    //start, stop, time, fn, onEnd
                psl.Tween.Create(250, 600, 3000,
                function(val){
                    myTextObject.parent.position[0] = val;
                },
                function(tween){
                    myTextObject.parent.position[0] = 250;
                    myTextObject.text = "Tween Ended";
                });
                
                //Tween alpha of object
                psl.Tween.Create(0,255,3000,
                function(val){
                    var color = val|0;
                    var alpha = 1 - (color/255);
                    myTextObject.fontColor = "rgba("+ color +","+ color + ","+ color +", "+ alpha +")";
                });
                
                Demo.GameLoop();
            });
    },
    Memory: function(){
        Demo.currentDemo = "MEMORY";
        /**
         *          Memory Manager
         *  Properties:
         *      localDB: local storage object
         *      sessionDB: session storage object
         *  Methods:
         *      Local.
         *          Add: Add key value pair to local storage
         *          Update: Update key value parin in local storage
         *          Get: Get value from local storage for supplied key
         *          Delete: Removes key, value pair from local storage
         *          Clear: Removes all objects from local storage
         *      Session.
         *          Add: Add key value pair to session storage
         *          Update: Update key value parin in session storage
         *          Get: Get value from session storage for supplied key
         *          Delete: Removes key, value pair from session storage
         *          Clear: Removes all objects from session storage
         */
        //Load Background -- See Images demo
        var background = psl.Graphics.LoadImage("images/backgrounds/MainMenu/MainMenu.png",
            function(a){
                psl.Entity.background = background;
                psl.Entity.canvas.width = 1024; 
                psl.Entity.canvas.height = 768; 
                psl.Entity.ctx.drawImage(psl.Entity.background.html, 0, 0);
                        
                        
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
                var myTextObject = psl.Font.Write("Tweening an Object", 250, 250, fontOptions);
        
                //Get loaded data for "game" tag
                var gameData = psl.Memory.Local.Get("game");
                //Check to see if it exist (first time calling app)
                if(!gameData){
                    //first time app is loaded,
                    //  Setting game value
                    gameData = {
                        count: 0,
                        time: (new Date()).getTime()
                    }
                }
                //Increment count
                gameData.count++;
                
                //Print to font
                myTextObject.text = "Game Loaded: " + gameData.count;
                
                //Update value in local storage
                psl.Memory.Local.Update("game", gameData);
                
                Demo.GameLoop();
                
            });
    },
    Input: function(){
        Demo.currentDemo = "INPUT";
        /**
         *          Input Manager
         *  Properties:
         *      currentTime: current clock time
         *      previousTime: previous clock time
         *  Methods:
         *      Get.State
         *          Mouse: returns object {lastX, lastY, presed: bool}
         *          Touch: returns object {startX, startY, lastX, lastY, pressed: bool}
         *          Keyboard: returns pressed (true/false) for keyCode
         *              Input:
         *                  keyCode:
         *      Register.Mouse.Event.
         *          Down: Registers callback for event and returns Callback Event
         *              Input:
         *                  fFunction: callback function
         *                  oScope: callback scope
         *          Up: Registers callback for event and returns Callback Event
         *              Input:
         *                  fFunction: callback function
         *                  oScope: callback scope
         *          Move: Registers callback for event and returns Callback Event
         *              Input:
         *                  fFunction: callback function
         *                  oScope: callback scope
         *      Register.Touch.Event.
         *          Start: Registers callback for event and returns Callback Event
         *              Input:
         *                  fFunction: callback function
         *                  oScope: callback scope
         *          End: Registers callback for event and returns Callback Event
         *              Input:
         *                  fFunction: callback function
         *                  oScope: callback scope
         *          Move: Registers callback for event and returns Callback Event
         *              Input:
         *                  fFunction: callback function
         *                  oScope: callback scope
         *      Register.Keyboard.Event.
         *          Keydown: Registers callback for event and returns Callback Event
         *              Input:
         *                  Key: Key registering event for
         *                  fFunction: callback function
         *                  oScope: callback scope
         *          Keyup: Registers for callback event and returns Callback Event
         *              Input:
         *                  Key: Key registering event for
         *                  fFunction: callback function
         *                  oScope: callback scope
         *      Remove.Mouse.Event
         *          Down: Removes callback
         *              Input:
         *                  id: Callback ID
         *          Up: Removes callback
         *              Input:
         *                  id: Callback ID
         *          Move: Removes callback
         *              Input:
         *                  id: Callback ID
         *      Remove.Touch.Event
         *          Start: Removes callback
         *              Input:
         *                  iID: Callback ID
         *          End: Removes callback
         *              Input:
         *                  iID: Callback ID
         *          Move: Removes callback
         *              Input:
         *                  iID: Callback ID
         *      Remove.Keyboard.Event
         *          Keydown: Removes callback
         *              Input:
         *                  Key: key code
         *                  iID: Callback ID
         *          Keyup: Removes callback
         *              Input:
         *                  Key: key code
         *                  iID: Callback ID
         *      
         *      
         *          
         */
        
        /**
         *              Callback Event
         *  Properties:
         *      func: user defined callback function
         *      scope: user defined scope for callback (optional)
         *      id: callback id, defined by Input Manager
         */
        var parameters = {
            urls:       ['sounds/button-click.mp3'],    //Array of urls
            autoplay:   false,
            loop:       false,
            volume:     1.0,
            onload:     function(){
                console.log("Song Loaded");
                //Play
                psl.Audio.Play("click");
                
                //Mouse
                var event = psl.Input.Register.Mouse.Event.Down(function(){psl.Audio.Play("click")});
                //psl.Input.Remove.Mouse.Event.Down(event.id);
                //Touch
                psl.Input.Register.Touch.Event.End(function(){psl.Audio.Play("click")});
                //Keyboard
                psl.Input.Register.Keyboard.Event.Keyup("A", function(){psl.Audio.Play("click");})
                    //Space bar
                psl.Input.Register.Keyboard.Event.Keyup(32, function(){psl.Audio.Play("click");})
            },
            onend:      function(){
                console.log("Song ended");
            }
        }
        
        psl.Audio.Load("click", parameters);
         
        
    },
    GameLoop: function(){
        
        var time = Date.now();
        var dt = 0;
        var lastUpdate = Date.now();
        
        
        if (Demo.currentDemo == "GRAPHICS") {
            
            var loop = function(){
                //Time Update
                time = Date.now();
                dt = time - lastUpdate;
                lastUpdate = time;
                
                //Engine Update
                psl.Graphics.Update(dt);
                psl.Graphics.Draw();
                
                window.requestAnimFrame(loop);
            }
            
            loop();
            
        }
        else if (Demo.currentDemo == "PHYSICS") {
            
            var loop = function(){
                //Time Update
                time = Date.now();
                dt = time - lastUpdate;
                lastUpdate = time;
                
                //Engine Update
                //  Graphics, handles background and clearing screen
                psl.Graphics.Update(dt);
                psl.Graphics.Draw();
                
                psl.Physics.Update(dt);
                psl.Physics.Draw();
                
                window.requestAnimFrame(loop);
            }
            
            loop();
            
        }
        else if (Demo.currentDemo == "FONT") {
            
            var loop = function(){
                //Time Update
                time = Date.now();
                dt = time - lastUpdate;
                lastUpdate = time;
                
                //Engine Update
                //Graphics, handles background and clearing screen
                psl.Graphics.Update(dt);
                psl.Graphics.Draw();
                
                psl.Font.Draw();
                
                window.requestAnimFrame(loop);
            }
            
            loop();
            
        }
        else if (Demo.currentDemo == "EVENTS") {
            
            var loop = function(){
                //Time Update
                time = Date.now();
                dt = time - lastUpdate;
                lastUpdate = time;
                
                //Engine Update
                psl.Event.Update(dt);
                
                window.requestAnimFrame(loop);
            }
            
            loop();
            
        }
        else if (Demo.currentDemo == "TWEEN") {
            
            var loop = function(){
                //Time Update
                time = Date.now();
                dt = time - lastUpdate;
                lastUpdate = time;
                
                //Engine Update
                psl.Tween.Update(dt);
                
                //Graphics, handles background and clearing screen
                psl.Graphics.Update(dt);
                psl.Graphics.Draw();
                //Demo is Tweening a Font object
                psl.Font.Draw();
                
                
                
                window.requestAnimFrame(loop);
            }
            
            loop();
            
        }
        else if (Demo.currentDemo == "MEMORY") {
            
            var loop = function(){
                //Time Update
                time = Date.now();
                dt = time - lastUpdate;
                lastUpdate = time;
                
                //Engine Update
                psl.Tween.Update(dt);
                
                //Graphics, handles background and clearing screen
                psl.Graphics.Update(dt);
                psl.Graphics.Draw();
                //Demo is Outputting Data with a Font object
                psl.Font.Draw();
                
                
                
                window.requestAnimFrame(loop);
            }
            
            loop();
            
        }
        
        
    
    
    }
}