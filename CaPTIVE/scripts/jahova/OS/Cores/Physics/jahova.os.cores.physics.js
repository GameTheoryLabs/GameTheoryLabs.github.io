com.jahova.os.Instance().Cores.Instance().Audio = (function()
{
    var pInstance;

    function constructor()
    {
        //PRIVATE ATTRIBUTES
        var NAME = "JaHOVA OS Internal API : Audio Core";
        var VERSION = "0v5";
        var PATH = "scripts/jahova/OS/Cores/Audio/jahova.os.cores.audio.js";
        var ID = null;
        
        var os = com.jahova.os.Instance();
        var utilities = com.jahova.utilities.Instance();
        
        var sounds = null;
        /*
         **/
        //PRIVATE METHODS
        
        
        //Private Classes
        var CSound =  function(sKey){
            this.key = sKey;
            this.path = "";
            this.loop = false;
            this.autoplay = false;
            this.type = "";
            this.duration = "";
            this.volume = "";
            this.audio = os.resschmgr.Create.HTMLElement("audio");
        }

        return{
            //PUBLIC ATTRIBUTES
            
            //PUBLIC PRIVILEDGE METHODS
            Add: function(sKey, sPath, bLoop, bAutoplay, sType){       
                var snd = new CSound(sKey);
                snd.loop = bLoop;
                snd.autoplay = bAutoplay;
                
                if(sType){
                    snd.type = sType;
                    snd.path = sPath;
                    var source = document.createElement('source');
                    if(sType.toUpperCase() == "MP3"){
                        
                        if (snd.audio.html().canPlayType('audio/mpeg;')) {
                            source.type= 'audio/mpeg';
                            source.src= sPath;
                            snd.audio.html().setAttribute('preload', 'auto');
                            
                            if(bLoop){snd.audio.html().setAttribute('loop', bLoop);}
                            if(bAutoplay){snd.audio.html().setAttribute('autoplay', bAutoplay);}
                            
                            snd.audio.html().appendChild(source);
                            
                            sounds.put(sKey, snd);
                        }
                        else{
                            os.windows.Create.ErrorWindow(" Audio", "Audio File: " +  sKey + " not loaded <br/>Audio File Type: " + sType + " is not supported by browser")
                        }
                        
                    }
                    else if(sType.toUpperCase == "OGG"){
                        
                        if(snd.audio.html().canPlayType('audio/ogg;')) {
                            source.type= 'audio/ogg';
                            source.src= sPath;
                            snd.audio.html().setAttribute('preload', 'auto');
                            
                            if(loop){snd.audio.html().setAttribute('loop', bLoop);}
                            if(autoplay){snd.audio.html().setAttribute('autoplay', bAutoplay);}
                            
                            snd.audio.html().appendChild(source);
                            
                            sounds.put(sKey, snd);
                        }
                        else{
                            os.windows.Create.ErrorWindow(" Audio", "Audio File: " +  sKey + " not loaded <br/>Audio File Type: " + sType + " is not supported by browser")
                        }
                    }
                }
                else{
                    snd.type = sType;
                    snd.path = sPath;
                    var source = document.createElement('source');
                    
                    if (snd.audio.html().canPlayType('audio/mpeg;')) {
                        source.type= 'audio/mpeg';
                        source.src= sPath + ".mp3";
                        snd.audio.html().setAttribute('preload', 'auto');
                        
                        if(bLoop){snd.audio.html().setAttribute('loop', bLoop);}
                        if(bAutoplay){snd.audio.html().setAttribute('autoplay', bAutoplay);}
                        
                        snd.audio.html().appendChild(source);
                        
                        sounds.put(sKey, snd);
                    }
                    else if(snd.audio.html().canPlayType('audio/ogg;')) {
                        source.type= 'audio/ogg';
                        source.src= sPath + ".ogg";
                        snd.audio.html().setAttribute('preload', 'auto');
                        
                        if(bLoop){snd.audio.html().setAttribute('loop', bLoop);}
                        if(bAutoplay){snd.audio.html().setAttribute('autoplay', bAutoplay);}
                        
                        snd.audio.html().appendChild(source);
                        
                        sounds.put(sKey, snd);
                    }
                    
                }
                
                snd.duration = snd.audio.html().duration;
                snd.volume = snd.audio.html().volume;
                
                return snd;
                
            },
            Get: {
                Volume: function(sKey){
                    return sounds.get(sKey).volume;
                },
                Sound: function(sKey){
                    return sounds.get(sKey);
                },
                Duration: function(sKey){
                    return sounds.get(key).audio.html().duration;
                }
                
            },
            Set: {
                Volume: function(sKey, vol){
                    var snd = sounds.get(sKey);
                    snd.audio.html().volume = vol;
                    snd.volume = vol;
                },
                CurrentTime: function(sKey, time){
                    var snd = sounds.get(sKey);
                    snd.audio.html().currentTime = time;
                }
            },
            Play: function(sKey){
                sounds.get(sKey).audio.html().play();
            },
            Pause: function(sKey){
                sounds.get(sKey).audio.html().pause();
            },
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
                sounds = os.resschmgr.Create.Map();   
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