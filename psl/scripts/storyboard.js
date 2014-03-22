//Global PSL module
var psl = null;
var Demo = {
    div: null,
    alertDiv: null,
    States: {
        MainMenu: null,
        PetShop: null,
        DogShow: null,
        Training: null,
        Park: null,
        Practice: null,
        Settings: null,
        Lvl1: null,
        Lvl2: null,
        Lvl3: null,
        Prac1: null,
        Prac2: null,
        Prac3: null
        
    },
    Init: {
        
    },
    FSM: null,
    Orientation: null
}
window.onload = function(){
    //Get connection to PSL module
    psl = com.playstylelabs.Instance();
    
    //Get Current Orientation
    Demo.Orientation = window.orientation;
    
    //Create Orientation Alert Div
    Demo.alertDiv = psl.Create.HTML("div");
    Demo.alertDiv.Append.Class("alert");
    Demo.alertDiv.Append.ToHTML(document.body);
    
    //Create Main Div to hold Screens
    Demo.div = psl.Create.HTML("div");
    Demo.div.Append.ToHTML(document.body);
    
    //Test for Portration Orientation
    (Demo.Orientation == 0) || (Demo.Orientation == 180) ? Demo.div.Append.Class("hide") : Demo.alertDiv.Append.Class("hide");
    
    //Orientation Change
    window.onorientationchange = function(){
        //Get Current Orientation
        Demo.Orientation = window.orientation;
        
        //Portrait
        if((Demo.Orientation == 0) || (Demo.Orientation == 180)){
            Demo.alertDiv.Remove.Class("hide");
            Demo.div.Append.Class("hide");
        }
        else{
            Demo.alertDiv.Append.Class("hide");
            Demo.div.Remove.Class("hide");
        }
    }
    //
    //      Create Demo FSM and States
    //
    
    //Create FSM
    Demo.FSM = psl.Create.FSM(Demo);

    //Main Menu State
    Demo.Init.MainMenu();

    //Dog Show State   
    Demo.Init.DogShow();

    //Pet Store State    
    Demo.Init.PetShop();
    
    Demo.Init.Settings();
    Demo.Init.Practice();
    Demo.Init.Park();
    Demo.Init.Training();
    Demo.Init.Lvl1();
    Demo.Init.Lvl2();
    Demo.Init.Lvl3();
    //Demo.Init.Prac1();
    //Demo.Init.Prac2();
    Demo.Init.Prac3();
    
    //Set Main Menu as Starting State
    Demo.FSM.Transition("MainMenu");
    
    
}
Demo.Init.Lvl1 = function(){
    Demo.States.Lvl1 = psl.Create.State("Level1");
    
    //Create Buttons
    Demo.States.Lvl1.Buttons = {};
    
    Demo.States.Lvl1.Buttons.MainMenu = psl.Create.HTML("div");
    Demo.States.Lvl1.Buttons.MainMenu.Append.ToHTML(Demo.div.html);
    Demo.States.Lvl1.Buttons.MainMenu.Append.Class("Level1Button hide");
    Demo.States.Lvl1.Buttons.MainMenu.html.style.top = "5px";
    Demo.States.Lvl1.Buttons.MainMenu.html.style.left = "860px";
    Demo.States.Lvl1.Buttons.MainMenu.html.addEventListener("touchend", function(){Demo.FSM.Transition("MainMenu");}, false);
    
    Demo.States.Lvl1.Buttons.PetShop = psl.Create.HTML("div");
    Demo.States.Lvl1.Buttons.PetShop.Append.ToHTML(Demo.div.html);
    Demo.States.Lvl1.Buttons.PetShop.Append.Class("Level1Button hide");
    Demo.States.Lvl1.Buttons.PetShop.html.style.top = "160px";
    Demo.States.Lvl1.Buttons.PetShop.html.style.left = "860px";
    Demo.States.Lvl1.Buttons.PetShop.html.addEventListener("touchend", function(){Demo.FSM.Transition("PetShop");}, false);
    
    //  -- Overload State Methods
    Demo.States.Lvl1.Enter = function(demo, msg){
        //Remove any pending background image
        Demo.div.Remove.AllClasses();
        
        //Add Main Menu image;
        Demo.div.Append.Class("background Level1");
        
        //Set Up Menus
        Demo.States.Lvl1.Buttons.MainMenu.Remove.Class("hide");
        Demo.States.Lvl1.Buttons.PetShop.Remove.Class("hide");
        
        //Add Event Listeners
    }
    Demo.States.Lvl1.Exit = function(demo, msg){
        //Remove Background image
        Demo.div.Remove.AllClasses();
        Demo.div.Append.Class("background");
        
        //Remove Menu
        Demo.States.Lvl1.Buttons.MainMenu.Append.Class("hide");
        Demo.States.Lvl1.Buttons.PetShop.Append.Class("hide");
        
        //Remove Event Listeners
    }
}
Demo.Init.Lvl2 = function(){
    Demo.States.Lvl2 = psl.Create.State("Level2");
    
    //Create Buttons
    Demo.States.Lvl2.Buttons = {};
    
    Demo.States.Lvl2.Buttons.MainMenu = psl.Create.HTML("div");
    Demo.States.Lvl2.Buttons.MainMenu.Append.ToHTML(Demo.div.html);
    Demo.States.Lvl2.Buttons.MainMenu.Append.Class("Level1Button hide");
    Demo.States.Lvl2.Buttons.MainMenu.html.style.top = "5px";
    Demo.States.Lvl2.Buttons.MainMenu.html.style.left = "860px";
    Demo.States.Lvl2.Buttons.MainMenu.html.addEventListener("touchend", function(){Demo.FSM.Transition("MainMenu");}, false);
    
    Demo.States.Lvl2.Buttons.PetShop = psl.Create.HTML("div");
    Demo.States.Lvl2.Buttons.PetShop.Append.ToHTML(Demo.div.html);
    Demo.States.Lvl2.Buttons.PetShop.Append.Class("Level1Button hide");
    Demo.States.Lvl2.Buttons.PetShop.html.style.top = "160px";
    Demo.States.Lvl2.Buttons.PetShop.html.style.left = "860px";
    Demo.States.Lvl2.Buttons.PetShop.html.addEventListener("touchend", function(){Demo.FSM.Transition("PetShop");}, false);
    
    //  -- Overload State Methods
    Demo.States.Lvl2.Enter = function(demo, msg){
        //Remove any pending background image
        Demo.div.Remove.AllClasses();
        
        //Add Main Menu image;
        Demo.div.Append.Class("background Level2");
        
        //Set Up Menus
        Demo.States.Lvl2.Buttons.MainMenu.Remove.Class("hide");
        Demo.States.Lvl2.Buttons.PetShop.Remove.Class("hide");
        
        //Add Event Listeners
    }
    Demo.States.Lvl2.Exit = function(demo, msg){
        //Remove Background image
        Demo.div.Remove.AllClasses();
        Demo.div.Append.Class("background");
        
        //Remove Menu
        Demo.States.Lvl2.Buttons.MainMenu.Append.Class("hide");
        Demo.States.Lvl2.Buttons.PetShop.Append.Class("hide");
        
        //Remove Event Listeners
    }
}
Demo.Init.Lvl3 = function(){
    Demo.States.Lvl3 = psl.Create.State("Level3");
    
    //Create Buttons
    Demo.States.Lvl3.Buttons = {};
    
    Demo.States.Lvl3.Buttons.MainMenu = psl.Create.HTML("div");
    Demo.States.Lvl3.Buttons.MainMenu.Append.ToHTML(Demo.div.html);
    Demo.States.Lvl3.Buttons.MainMenu.Append.Class("Level1Button hide");
    Demo.States.Lvl3.Buttons.MainMenu.html.style.top = "5px";
    Demo.States.Lvl3.Buttons.MainMenu.html.style.left = "860px";
    Demo.States.Lvl3.Buttons.MainMenu.html.addEventListener("touchend", function(){Demo.FSM.Transition("MainMenu");}, false);
    
    Demo.States.Lvl3.Buttons.PetShop = psl.Create.HTML("div");
    Demo.States.Lvl3.Buttons.PetShop.Append.ToHTML(Demo.div.html);
    Demo.States.Lvl3.Buttons.PetShop.Append.Class("Level1Button hide");
    Demo.States.Lvl3.Buttons.PetShop.html.style.top = "160px";
    Demo.States.Lvl3.Buttons.PetShop.html.style.left = "860px";
    Demo.States.Lvl3.Buttons.PetShop.html.addEventListener("touchend", function(){Demo.FSM.Transition("PetShop");}, false);
    
    //  -- Overload State Methods
    Demo.States.Lvl3.Enter = function(demo, msg){
        //Remove any pending background image
        Demo.div.Remove.AllClasses();
        
        //Add Main Menu image;
        Demo.div.Append.Class("background Level3");
        
        //Set Up Menus
        Demo.States.Lvl3.Buttons.MainMenu.Remove.Class("hide");
        Demo.States.Lvl3.Buttons.PetShop.Remove.Class("hide");
        
        //Add Event Listeners
    }
    Demo.States.Lvl3.Exit = function(demo, msg){
        //Remove Background image
        Demo.div.Remove.AllClasses();
        Demo.div.Append.Class("background");
        
        //Remove Menu
        Demo.States.Lvl3.Buttons.MainMenu.Append.Class("hide");
        Demo.States.Lvl3.Buttons.PetShop.Append.Class("hide");
        
        //Remove Event Listeners
    }
}
Demo.Init.Prac1 = function(){
    Demo.States.Prac1 = psl.Create.State("Practice1");
    
    //  -- Overload State Methods
    Demo.States.Prac1.Enter = function(demo, msg){
        //Remove any pending background image
        Demo.div.Remove.AllClasses();
        
        //Add Main Menu image;
        Demo.div.Append.Class("background Level1");
        
        //Set Up Menus
        
        
        //Add Event Listeners
    }
    Demo.States.Prac1.Exit = function(demo, msg){
        //Remove Background image
        Demo.div.Remove.AllClasses();
        Demo.div.Append.Class("background");
        
        //Remove Menu
        
        
        //Remove Event Listeners
    }
}
Demo.Init.Prac2 = function(){
    Demo.States.Prac2 = psl.Create.State("Practice2");
    
    //  -- Overload State Methods
    Demo.States.Prac2.Enter = function(demo, msg){
        //Remove any pending background image
        Demo.div.Remove.AllClasses();
        
        //Add Main Menu image;
        Demo.div.Append.Class("background Level2");
        
        //Set Up Menus
        
        
        //Add Event Listeners
    }
    Demo.States.Prac2.Exit = function(demo, msg){
        //Remove Background image
        Demo.div.Remove.AllClasses();
        Demo.div.Append.Class("background");
        
        //Remove Menu
        
        
        //Remove Event Listeners
    }
}
Demo.Init.Prac3 = function(){
    Demo.States.Prac3 = psl.Create.State("Practice3");
    
    //Create Buttons
    Demo.States.Prac3.Buttons = {};
    
    Demo.States.Prac3.Buttons.MainMenu = psl.Create.HTML("div");
    Demo.States.Prac3.Buttons.MainMenu.Append.ToHTML(Demo.div.html);
    Demo.States.Prac3.Buttons.MainMenu.Append.Class("Level1Button hide");
    Demo.States.Prac3.Buttons.MainMenu.html.style.top = "5px";
    Demo.States.Prac3.Buttons.MainMenu.html.style.left = "860px";
    Demo.States.Prac3.Buttons.MainMenu.html.addEventListener("touchend", function(){Demo.FSM.Transition("MainMenu");}, false);
    
    Demo.States.Prac3.Buttons.PetShop = psl.Create.HTML("div");
    Demo.States.Prac3.Buttons.PetShop.Append.ToHTML(Demo.div.html);
    Demo.States.Prac3.Buttons.PetShop.Append.Class("Level1Button hide");
    Demo.States.Prac3.Buttons.PetShop.html.style.top = "160px";
    Demo.States.Prac3.Buttons.PetShop.html.style.left = "860px";
    Demo.States.Prac3.Buttons.PetShop.html.addEventListener("touchend", function(){Demo.FSM.Transition("PetShop");}, false);
    
    //  -- Overload State Methods
    Demo.States.Prac3.Enter = function(demo, msg){
        //Remove any pending background image
        Demo.div.Remove.AllClasses();
        
        //Add Main Menu image;
        Demo.div.Append.Class("background Practice3");
        
        //Set Up Menus
        Demo.States.Prac3.Buttons.MainMenu.Remove.Class("hide");
        Demo.States.Prac3.Buttons.PetShop.Remove.Class("hide");
        
        //Add Event Listeners
    }
    Demo.States.Prac3.Exit = function(demo, msg){
        //Remove Background image
        Demo.div.Remove.AllClasses();
        Demo.div.Append.Class("background");
        
        //Remove Menu
        Demo.States.Prac3.Buttons.MainMenu.Append.Class("hide");
        Demo.States.Prac3.Buttons.PetShop.Append.Class("hide");
        
        //Remove Event Listeners
    }
}
Demo.Init.Settings = function(){
    Demo.States.Settings = psl.Create.State("Settings");
    
    Demo.States.Settings.Buttons = {};
    Demo.States.Settings.Buttons.MainMenu = psl.Create.HTML('div');
    Demo.States.Settings.Buttons.MainMenu.Append.ToHTML(Demo.div.html);
    Demo.States.Settings.Buttons.MainMenu.Append.Class("SettingsButton hide");
    Demo.States.Settings.Buttons.MainMenu.html.style.top = "475px";
    Demo.States.Settings.Buttons.MainMenu.html.style.left = "545px";
    Demo.States.Settings.Buttons.MainMenu.html.addEventListener("touchend", function(){Demo.FSM.Transition("MainMenu");}, false);
    
    
    //  -- Overload State Methods
    Demo.States.Settings.Enter = function(demo, msg){
        //Remove any pending background image
        Demo.div.Remove.AllClasses();
        
        //Add Main Menu image;
        Demo.div.Append.Class("background Settings");
        
        //Set Up Menus
        Demo.States.Settings.Buttons.MainMenu.Remove.Class("hide");
        
        //Add Event Listeners
    }
    Demo.States.Settings.Exit = function(demo, msg){
        //Remove Background image
        Demo.div.Remove.AllClasses();
        Demo.div.Append.Class("background");
        
        //Remove Menu
        Demo.States.Settings.Buttons.MainMenu.Append.Class("hide");
        
        //Remove Event Listeners
    }
}
Demo.Init.Practice = function(){
    Demo.States.Practice = psl.Create.State("Practice");
    
    //Create Buttons
    Demo.States.Practice.Buttons = {};
    
    Demo.States.Practice.Buttons.Level1 = psl.Create.HTML("div");
    Demo.States.Practice.Buttons.Level1.Append.ToHTML(Demo.div.html);
    Demo.States.Practice.Buttons.Level1.Append.Class("PracticeMenuButton hide");
    Demo.States.Practice.Buttons.Level1.html.style.top = "250px";
    Demo.States.Practice.Buttons.Level1.html.style.left = "230px";
    Demo.States.Practice.Buttons.Level1.html.addEventListener("touchend", function(){Demo.FSM.Transition("Level1");}, false);
    
    Demo.States.Practice.Buttons.Level2 = psl.Create.HTML("div");
    Demo.States.Practice.Buttons.Level2.Append.ToHTML(Demo.div.html);
    Demo.States.Practice.Buttons.Level2.Append.Class("PracticeMenuButton hide");
    Demo.States.Practice.Buttons.Level2.html.style.top = "250px";
    Demo.States.Practice.Buttons.Level2.html.style.left = "440px";
    Demo.States.Practice.Buttons.Level2.html.addEventListener("touchend", function(){Demo.FSM.Transition("Level2");}, false);
    
    Demo.States.Practice.Buttons.Level3 = psl.Create.HTML("div");
    Demo.States.Practice.Buttons.Level3.Append.ToHTML(Demo.div.html);
    Demo.States.Practice.Buttons.Level3.Append.Class("PracticeMenuButton hide");
    Demo.States.Practice.Buttons.Level3.html.style.top = "250px";
    Demo.States.Practice.Buttons.Level3.html.style.left = "660px";
    Demo.States.Practice.Buttons.Level3.html.addEventListener("touchend", function(){Demo.FSM.Transition("Practice3");}, false);
    
    
    //  -- Overload State Methods
    Demo.States.Practice.Enter = function(demo, msg){
        //Remove any pending background image
        Demo.div.Remove.AllClasses();
        
        //Add Main Menu image;
        Demo.div.Append.Class("background PracticeMenu");
        
        //Set Up Menus
        Demo.States.Practice.Buttons.Level1.Remove.Class("hide");
        Demo.States.Practice.Buttons.Level2.Remove.Class("hide");
        Demo.States.Practice.Buttons.Level3.Remove.Class("hide");
        
        //Add Event Listeners
    }
    Demo.States.Practice.Exit = function(demo, msg){
        //Remove Background image
        Demo.div.Remove.AllClasses();
        Demo.div.Append.Class("background");
        
        //Remove Menu
        Demo.States.Practice.Buttons.Level1.Append.Class("hide");
        Demo.States.Practice.Buttons.Level2.Append.Class("hide");
        Demo.States.Practice.Buttons.Level3.Append.Class("hide");
        
        //Remove Event Listeners
    }
}
Demo.Init.Park = function(){
    Demo.States.Park = psl.Create.State("Park");
    
    //Create Buttons
    Demo.States.Park.Buttons = {};
    
    Demo.States.Park.Buttons.MainMenu = psl.Create.HTML("div");
    Demo.States.Park.Buttons.MainMenu.Append.ToHTML(Demo.div.html);
    Demo.States.Park.Buttons.MainMenu.Append.Class("LevelMenuButton hide");
    Demo.States.Park.Buttons.MainMenu.html.style.top = "15px";
    Demo.States.Park.Buttons.MainMenu.html.style.left = "856px";
    Demo.States.Park.Buttons.MainMenu.html.addEventListener("touchend", function(){Demo.FSM.Transition("MainMenu");}, false);
    
    Demo.States.Park.Buttons.PetShop = psl.Create.HTML("div");
    Demo.States.Park.Buttons.PetShop.Append.ToHTML(Demo.div.html);
    Demo.States.Park.Buttons.PetShop.Append.Class("LevelMenuButton hide");
    Demo.States.Park.Buttons.PetShop.html.style.top = "600px";
    Demo.States.Park.Buttons.PetShop.html.style.left = "858px";
    Demo.States.Park.Buttons.PetShop.html.addEventListener("touchend", function(){Demo.FSM.Transition("PetShop");}, false);
    
    Demo.States.Park.Buttons.Level1 = psl.Create.HTML("div");
    Demo.States.Park.Buttons.Level1.Append.ToHTML(Demo.div.html);
    Demo.States.Park.Buttons.Level1.Append.Class("LevelMenuButton hide");
    Demo.States.Park.Buttons.Level1.html.style.top = "450px";
    Demo.States.Park.Buttons.Level1.html.style.left = "100px";
    Demo.States.Park.Buttons.Level1.html.addEventListener("touchend", function(){Demo.FSM.Transition("Level1");}, false);
    
    Demo.States.Park.Buttons.Level2 = psl.Create.HTML("div");
    Demo.States.Park.Buttons.Level2.Append.ToHTML(Demo.div.html);
    Demo.States.Park.Buttons.Level2.Append.Class("LevelMenuButton hide");
    Demo.States.Park.Buttons.Level2.html.style.top = "175px";
    Demo.States.Park.Buttons.Level2.html.style.left = "275px";
    Demo.States.Park.Buttons.Level2.html.addEventListener("touchend", function(){Demo.FSM.Transition("Level2");}, false);
    
    Demo.States.Park.Buttons.Level3 = psl.Create.HTML("div");
    Demo.States.Park.Buttons.Level3.Append.ToHTML(Demo.div.html);
    Demo.States.Park.Buttons.Level3.Append.Class("LevelMenuButton hide");
    Demo.States.Park.Buttons.Level3.html.style.top = "25px";
    Demo.States.Park.Buttons.Level3.html.style.left = "425px";
    Demo.States.Park.Buttons.Level3.html.addEventListener("touchend", function(){Demo.FSM.Transition("Level3");}, false);
    
    //  -- Overload State Methods
    Demo.States.Park.Enter = function(demo, msg){
        //Remove any pending background image
        Demo.div.Remove.AllClasses();
        
        //Add Main Menu image;
        Demo.div.Append.Class("background LevelMenu");
        
        //Set Up Menus
        Demo.States.Park.Buttons.MainMenu.Remove.Class("hide");
        Demo.States.Park.Buttons.PetShop.Remove.Class("hide");
        Demo.States.Park.Buttons.Level1.Remove.Class("hide");
        Demo.States.Park.Buttons.Level2.Remove.Class("hide");
        Demo.States.Park.Buttons.Level3.Remove.Class("hide");
        
        //Add Event Listeners
    }
    Demo.States.Park.Exit = function(demo, msg){
        //Remove Background image
        Demo.div.Remove.AllClasses();
        Demo.div.Append.Class("background");
        
        //Remove Menu
        Demo.States.Park.Buttons.MainMenu.Append.Class("hide");
        Demo.States.Park.Buttons.PetShop.Append.Class("hide");
        Demo.States.Park.Buttons.Level1.Append.Class("hide");
        Demo.States.Park.Buttons.Level2.Append.Class("hide");
        Demo.States.Park.Buttons.Level3.Append.Class("hide");
        
        //Remove Event Listeners
    }
}
Demo.Init.Training = function(){
    Demo.States.Training = psl.Create.State("Training");
    
    //Create Buttons
    Demo.States.Training.Buttons = {};
    
    Demo.States.Training.Buttons.MainMenu = psl.Create.HTML("div");
    Demo.States.Training.Buttons.MainMenu.Append.ToHTML(Demo.div.html);
    Demo.States.Training.Buttons.MainMenu.Append.Class("TrainingButton hide");
    Demo.States.Training.Buttons.MainMenu.html.style.top = "15px";
    Demo.States.Training.Buttons.MainMenu.html.style.left = "856px";
    Demo.States.Training.Buttons.MainMenu.html.addEventListener("touchend", function(){Demo.FSM.Transition("MainMenu");}, false);
    
    Demo.States.Training.Buttons.PetShop = psl.Create.HTML("div");
    Demo.States.Training.Buttons.PetShop.Append.ToHTML(Demo.div.html);
    Demo.States.Training.Buttons.PetShop.Append.Class("TrainingButton hide");
    Demo.States.Training.Buttons.PetShop.html.style.top = "600px";
    Demo.States.Training.Buttons.PetShop.html.style.left = "858px";
    Demo.States.Training.Buttons.PetShop.html.addEventListener("touchend", function(){Demo.FSM.Transition("PetShop");}, false);
    
    
    //  -- Overload State Methods
    Demo.States.Training.Enter = function(demo, msg){
        //Remove any pending background image
        Demo.div.Remove.AllClasses();
        
        //Add Main Menu image;
        Demo.div.Append.Class("background Training");
        
        //Set Up Menus
        Demo.States.Training.Buttons.MainMenu.Remove.Class("hide");
        Demo.States.Training.Buttons.PetShop.Remove.Class("hide");
        
        //Add Event Listeners
    }
    Demo.States.Training.Exit = function(demo, msg){
        //Remove Background image
        Demo.div.Remove.AllClasses();
        Demo.div.Append.Class("background");
        
        //Remove Menu
        Demo.States.Training.Buttons.MainMenu.Append.Class("hide");
        Demo.States.Training.Buttons.PetShop.Append.Class("hide");
        
        //Remove Event Listeners
    }
}
Demo.Init.PetShop = function(){
    //Create Pet Store State
    Demo.States.PetShop = psl.Create.State("PetShop");
    
    Demo.States.PetShop.Buttons = {};
    Demo.States.PetShop.Buttons.MainMenu = psl.Create.HTML('div');
    Demo.States.PetShop.Buttons.MainMenu.Append.ToHTML(Demo.div.html);
    Demo.States.PetShop.Buttons.MainMenu.Append.Class("DogShowButton hide");
    Demo.States.PetShop.Buttons.MainMenu.html.style.top = "600px";
    Demo.States.PetShop.Buttons.MainMenu.html.style.left = "845px";
    Demo.States.PetShop.Buttons.MainMenu.html.addEventListener("touchend", function(){Demo.FSM.Transition("MainMenu");}, false);
    
    //  -- Overload State Methods
    Demo.States.PetShop.Enter = function(demo, msg){
        //Remove any pending background image
        Demo.div.Remove.AllClasses();
        
        //Add Main Menu image;
        Demo.div.Append.Class("background PetShop");
        
        //Set Up Menus
        Demo.States.PetShop.Buttons.MainMenu.Remove.Class("hide");
        
        //Add Event Listeners
    }
    Demo.States.PetShop.Exit = function(demo, msg){
        //Remove Background image
        Demo.div.Remove.AllClasses();
        Demo.div.Append.Class("background");
        
        //Remove Menu
        Demo.States.PetShop.Buttons.MainMenu.Append.Class("hide");
        
        //Remove Event Listeners
    }
    
    
}
Demo.Init.DogShow = function(){
    //Create Dog Show State
    Demo.States.DogShow = psl.Create.State("DogShow");
    
    //Create Buttons
    Demo.States.DogShow.Buttons = {};
    
    Demo.States.DogShow.Buttons.MainMenu = psl.Create.HTML("div");
    Demo.States.DogShow.Buttons.MainMenu.Append.ToHTML(Demo.div.html);
    Demo.States.DogShow.Buttons.MainMenu.Append.Class("DogShowButton hide");
    Demo.States.DogShow.Buttons.MainMenu.html.style.top = "5px";
    Demo.States.DogShow.Buttons.MainMenu.html.style.left = "845px";
    Demo.States.DogShow.Buttons.MainMenu.html.addEventListener("touchend", function(){Demo.FSM.Transition("MainMenu");}, false);
    
    Demo.States.DogShow.Buttons.PetShop = psl.Create.HTML("div");
    Demo.States.DogShow.Buttons.PetShop.Append.ToHTML(Demo.div.html);
    Demo.States.DogShow.Buttons.PetShop.Append.Class("DogShowButton hide");
    Demo.States.DogShow.Buttons.PetShop.html.style.top = "160px";
    Demo.States.DogShow.Buttons.PetShop.html.style.left = "845px";
    Demo.States.DogShow.Buttons.PetShop.html.addEventListener("touchend", function(){Demo.FSM.Transition("PetShop");}, false);
    
    //  -- Overload State Methods
    Demo.States.DogShow.Enter = function(demo, msg){
        //Remove any pending background image
        Demo.div.Remove.AllClasses();
        
        //Add Main Menu image;
        Demo.div.Append.Class("background DogShow");
        
        //Set Up Menus
        Demo.States.DogShow.Buttons.MainMenu.Remove.Class("hide");
        Demo.States.DogShow.Buttons.PetShop.Remove.Class("hide");
        
        //Add Event Listeners
    }
    Demo.States.DogShow.Exit = function(demo, msg){
        //Remove Background image
        Demo.div.Remove.AllClasses();
        Demo.div.Append.Class("background");
        
        //Remove Menu
        Demo.States.DogShow.Buttons.MainMenu.Append.Class("hide");
        Demo.States.DogShow.Buttons.PetShop.Append.Class("hide");
        
        //Remove Event Listeners
    }
}
Demo.Init.MainMenu = function(){
    //Create Main Menu State
    Demo.States.MainMenu = psl.Create.State("MainMenu");
    
    //Create Menu Buttons
    Demo.States.MainMenu.Buttons = {
        Training: psl.Create.HTML("div"),
        Park: psl.Create.HTML("div"),
        Practice: psl.Create.HTML("div"),
        PetShop: psl.Create.HTML("div"),
        Settings: psl.Create.HTML("div"),
        DogShow: psl.Create.HTML("div")
    }
    
    //Training Button Config
    Demo.States.MainMenu.Buttons.Training.Append.ToHTML(Demo.div.html);
    Demo.States.MainMenu.Buttons.Training.Append.Class("MainMenuButton");
    Demo.States.MainMenu.Buttons.Training.html.style.top = "401px";
    Demo.States.MainMenu.Buttons.Training.html.style.left = "50px";
    Demo.States.MainMenu.Buttons.Training.html.addEventListener("touchstart", function(){Demo.FSM.Transition("Training");}, false);
    
    //Park Button Config
    Demo.States.MainMenu.Buttons.Park.Append.ToHTML(Demo.div.html);
    Demo.States.MainMenu.Buttons.Park.Append.Class("MainMenuButton");
    Demo.States.MainMenu.Buttons.Park.html.style.top = "406px";
    Demo.States.MainMenu.Buttons.Park.html.style.left = "378px";
    Demo.States.MainMenu.Buttons.Park.html.addEventListener("touchstart", function(){Demo.FSM.Transition("Park");}, false);
    
    //Practice Button Config
    Demo.States.MainMenu.Buttons.Practice.Append.ToHTML(Demo.div.html);
    Demo.States.MainMenu.Buttons.Practice.Append.Class("MainMenuButton");
    Demo.States.MainMenu.Buttons.Practice.html.style.top = "407px";
    Demo.States.MainMenu.Buttons.Practice.html.style.left = "690px";
    Demo.States.MainMenu.Buttons.Practice.html.addEventListener("touchstart", function(){Demo.FSM.Transition("Practice");}, false);
    
    //PetShop Button Config
    Demo.States.MainMenu.Buttons.PetShop.Append.ToHTML(Demo.div.html);
    Demo.States.MainMenu.Buttons.PetShop.Append.Class("MainMenuButton");
    Demo.States.MainMenu.Buttons.PetShop.html.style.top = "556px";
    Demo.States.MainMenu.Buttons.PetShop.html.style.left = "50px";
    Demo.States.MainMenu.Buttons.PetShop.html.addEventListener("touchstart", function(){Demo.FSM.Transition("PetShop");}, false);
    
    //Settings Button Config
    Demo.States.MainMenu.Buttons.Settings.Append.ToHTML(Demo.div.html);
    Demo.States.MainMenu.Buttons.Settings.Append.Class("MainMenuButton");
    Demo.States.MainMenu.Buttons.Settings.html.style.top = "556px";
    Demo.States.MainMenu.Buttons.Settings.html.style.left = "373px";
    Demo.States.MainMenu.Buttons.Settings.html.addEventListener("touchstart", function(){Demo.FSM.Transition("Settings");}, false);
    
    //DogShow Button Config
    Demo.States.MainMenu.Buttons.DogShow.Append.ToHTML(Demo.div.html);
    Demo.States.MainMenu.Buttons.DogShow.Append.Class("MainMenuButton");
    Demo.States.MainMenu.Buttons.DogShow.html.style.top = "556px";
    Demo.States.MainMenu.Buttons.DogShow.html.style.left = "690px";
    Demo.States.MainMenu.Buttons.DogShow.html.addEventListener("touchstart", function(){Demo.FSM.Transition("DogShow");}, false);
    
    //  -- Overload State Methods
    Demo.States.MainMenu.Enter = function(demo, msg){
        //Remove any pending background image
        Demo.div.Remove.AllClasses();
        
        //Add Main Menu image;
        Demo.div.Append.Class("background MainMenu");
        
        //Set Up Menus
        Demo.States.MainMenu.Buttons.Training.Remove.Class("hide");
        Demo.States.MainMenu.Buttons.Park.Remove.Class("hide");
        Demo.States.MainMenu.Buttons.Practice.Remove.Class("hide");
        Demo.States.MainMenu.Buttons.PetShop.Remove.Class("hide");
        Demo.States.MainMenu.Buttons.Settings.Remove.Class("hide");
        Demo.States.MainMenu.Buttons.DogShow.Remove.Class("hide");
        
    }
    Demo.States.MainMenu.Exit = function(demo, msg){
        //Remove Background image
        Demo.div.Remove.AllClasses();
        Demo.div.Append.Class("background");
        
        //Remove Menu
        Demo.States.MainMenu.Buttons.Training.Append.Class("hide");
        Demo.States.MainMenu.Buttons.Park.Append.Class("hide");
        Demo.States.MainMenu.Buttons.Practice.Append.Class("hide");
        Demo.States.MainMenu.Buttons.PetShop.Append.Class("hide");
        Demo.States.MainMenu.Buttons.Settings.Append.Class("hide");
        Demo.States.MainMenu.Buttons.DogShow.Append.Class("hide");
    }
}