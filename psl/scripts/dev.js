var com  = com || {};

//Utility Functions, Classes and Objects
com.playstylelabs.Instance().Physcis = (function(){
    
    //PRIVATE MODULE PROPERTIES
    var pInstance = null;
    
    //CONSTANTS
    var NAME = "PlayStyleLabs";
    var VERSION = "0.1";
    var PATH = "scripts/psl.js";
    var BROWSER = null;
    
    var constructor = function(){
        
        //
        //PRIVATE OBJECTS, PROPERTIES AND CLASS DEFINITIONS
        //
        
        
        //PUBLIC OBJECTS/METHODS Being returned
        return{
            AddForce: function(){
                
            }

                
        }
    }
    return {
        //Instantiates Objects and Returns
        //  Insures a single object
        Instance: function()
        {
            if(!pInstance)
            {
                //Instantiate if pInstance does not exist
                pInstance = constructor();
                
                //Do Initilization stuff here
                
            }
            
            return pInstance;
        }
    }
})();