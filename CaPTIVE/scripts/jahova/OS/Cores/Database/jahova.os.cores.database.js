com.jahova.os.Instance().Cores.Instance().Database = (function()
{
    var pInstance;

    function constructor()
    {
        //PRIVATE ATTRIBUTES
        var NAME = "JaHOVA OS Internal API : Database Core";
        var VERSION = "0v5";
        var PATH = "scripts/jahova/OS/Cores/Database/jahova.os.cores.database.js";
        var ID = null;
        
        var os = com.jahova.os.Instance();
        var utilities = com.jahova.utilities.Instance();
        /*
         **/
        //PRIVATE METHODS
        
        
        //Private Classes
        

        return{
            //PUBLIC ATTRIBUTES
            
            //PUBLIC PRIVILEDGE METHODS
           
            GetName: function(){
                return NAME;
            },
            
            GetVersion: function(){
                return VERSION;
            },
            
            GetPath: function(){
                return PATH;
            },
           
            GetID: function(){
                return ID;
            },
            
            Initialize: function(){
                
            }
            
        }
    }
    
    return {
        //OBJECT ACCESSOR
        Instance: function()
        {
            if(!pInstance)
            {
                //Instantiate if pInstance does not exist
                pInstance = constructor();
            }
            
            return pInstance;
        }
    }
})();