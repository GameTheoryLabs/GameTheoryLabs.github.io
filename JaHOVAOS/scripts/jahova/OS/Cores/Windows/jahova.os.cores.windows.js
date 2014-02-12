com.jahova.os.Instance().Cores.Instance().Windows = (function()
{
    var pInstance;

    function constructor()
    {
        //PRIVATE ATTRIBUTES
        var NAME = "JaHOVA OS Internal API : Windows Core";
        var VERSION = "0v5";
        var PATH = "scripts/jahova/OS/Cores/Windows/jahova.os.cores.windows.js";
        var ID = null;
        
        var os = com.jahova.os.Instance();
        var utilities = com.jahova.utilities.Instance();
        
        //PRIVATE METHODS
        
        
        //Private Classes
        var CWindow = function(windowID, windowTitle, themeName){
            
            var _state = {
                window:    "HIDDEN",
                titlebar:  "VISIBLE",
                menubar:   "VISIBLE",
                toolbar:   "VISIBLE",
                statusbar: "VISIBLE",
                content:   "VISIBLE",
                buttons:   "VISIBLE"
            };
            var _position = {
                top: 0,
                left: 0
            };
            var _title = windowTitle;
            var _id = windowID;
            var _width = null;
            var _height = null;
            
            this.type = null;
            this.theme = null;
            this.menu = null;
            this.isMin = false;
            this.isMax = false;
   
            this.Callbacks = {
                onOpen: null,
                onClose: null,
                onMax: null,
                onMin: null,
                onFocus: null,
                onBlur: null
            };
            
            this.Scope = {
                onOpen: null,
                onClose: null,
                onMax: null,
                onMin: null,
                onFocus: null,
                onBlur: null
            };
            
            this.Hide = {
                    window: function(){
                        this.elements.window.html().style.display = "none";
                        _state.window = "HIDDEN";
                    }.bind(this),
                    titlebar: function(){
                        this.elements.titlebar.html().style.display = "none";
                        _state.titlebar = "HIDDEN";
                        
                        //Set Content Area height
                        var windowHeight = this.elements.window.GetHeight();
                        var titlebarHeight = this.elements.titlebar.GetHeight();
                        var menubarHeight = this.elements.menubar.GetHeight();
                        var statusbarHeight = this.elements.statusbar.GetHeight();
                        var toolbarHeight = this.elements.toolbar.GetHeight();
                        
                        if(this.theme.menubarIntegrated){
                            this.elements.content.html().style.height = (windowHeight - titlebarHeight - menubarHeight - statusbarHeight -  toolbarHeight) + "px";
                        }
                        else{
                            this.elements.content.html().style.height = (windowHeight - titlebarHeight - statusbarHeight -  toolbarHeight) + "px";
                        }
                        
                    }.bind(this),
                    menubar:  function(){
                        this.elements.menubar.html().style.display = "none";
                        _state.menubar = "HIDDEN";
                        
                        if(this.theme.menubarIntegrated){
                            //Set Content Area height
                            var windowHeight = this.elements.window.GetHeight();
                            var titlebarHeight = this.elements.titlebar.GetHeight();
                            var menubarHeight = this.elements.menubar.GetHeight();
                            var statusbarHeight = this.elements.statusbar.GetHeight();
                            var toolbarHeight = this.elements.toolbar.GetHeight();
                            this.elements.content.html().style.height = (windowHeight - titlebarHeight - menubarHeight - statusbarHeight -  toolbarHeight) + "px";
                        }
                        
                    }.bind(this),
                    toolbar: function(){
                        this.elements.toolbar.html().style.display = "none";
                        _state.toolbar = "HIDDEN";
                        
                        //Set Content Area height
                        var windowHeight = this.elements.window.GetHeight();
                        var titlebarHeight = this.elements.titlebar.GetHeight();
                        var menubarHeight = this.elements.menubar.GetHeight();
                        var statusbarHeight = this.elements.statusbar.GetHeight();
                        var toolbarHeight = this.elements.toolbar.GetHeight();
                        
                        if(this.theme.menubarIntegrated){
                            this.elements.content.html().style.height = (windowHeight - titlebarHeight - menubarHeight - statusbarHeight -  toolbarHeight) + "px";
                        }
                        else{
                            this.elements.content.html().style.height = (windowHeight - titlebarHeight - statusbarHeight -  toolbarHeight) + "px";
                        }
                        
                    }.bind(this),
                    statusbar: function(){
                        this.elements.statusbar.html().style.display = "none";
                        _state.statusbar = "HIDDEN";
                        
                        //Set Content Area height
                        var windowHeight = this.elements.window.GetHeight();
                        var titlebarHeight = this.elements.titlebar.GetHeight();
                        var menubarHeight = this.elements.menubar.GetHeight();
                        var statusbarHeight = this.elements.statusbar.GetHeight();
                        var toolbarHeight = this.elements.toolbar.GetHeight();
                        
                        if(this.theme.menubarIntegrated){
                            this.elements.content.html().style.height = (windowHeight - titlebarHeight - menubarHeight - statusbarHeight -  toolbarHeight) + "px";
                        }
                        else{
                            this.elements.content.html().style.height = (windowHeight - titlebarHeight - statusbarHeight -  toolbarHeight) + "px";
                        }
                        
                    }.bind(this),
                    content: function(){
                        this.elements.content.html().style.display = "none";
                        _state.content = "HIDDEN";
                    }.bind(this),
                    buttons: function(){
                        this.elements.titlebar.buttons.html().style.display = "none";
                        _state.buttons = "HIDDEN";
                    }.bind(this)
            };
            
            this.Display = {
                window: function(){
                    this.elements.window.html().style.display = "block";
                    _state.window = "VISIBLE";
                    this.MakeActive();
                    
                    //Set Content Area height
                    var windowHeight = this.elements.window.GetHeight();
                    var titlebarHeight = this.elements.titlebar.GetHeight();
                    var menubarHeight = this.elements.menubar.GetHeight();
                    var statusbarHeight = this.elements.statusbar.GetHeight();
                    var toolbarHeight = this.elements.toolbar.GetHeight();
                    
                    if(this.theme.menubarIntegrated){
                        this.elements.content.html().style.height = (windowHeight - titlebarHeight - menubarHeight - statusbarHeight -  toolbarHeight) + "px";
                    }
                    else{
                        this.elements.content.html().style.height = (windowHeight - titlebarHeight - statusbarHeight -  toolbarHeight ) + "px";
                    }
                }.bind(this),
                
                titlebar: function(){
                    this.elements.titlebar.html().style.display = "block";
                    _state.titlebar = "VISIBLE";
                    
                    //Set Content Area height
                    var windowHeight = this.elements.window.GetHeight();
                    var titlebarHeight = this.elements.titlebar.GetHeight();
                    var menubarHeight = this.elements.menubar.GetHeight();
                    var statusbarHeight = this.elements.statusbar.GetHeight();
                    var toolbarHeight = this.elements.toolbar.GetHeight();
                    
                    if(this.theme.menubarIntegrated){
                        this.elements.content.html().style.height = (windowHeight - titlebarHeight - menubarHeight - statusbarHeight -  toolbarHeight) + "px";
                    }
                    else{
                        this.elements.content.html().style.height = (windowHeight - titlebarHeight - statusbarHeight -  toolbarHeight) + "px";
                    }
                }.bind(this),
                
                menubar:  function(){
                    this.elements.menubar.html().style.display = "block";
                    _state.menubar = "VISIBLE";
                    
                    //Set Content Area height
                    
                    
                    if(this.theme.menubarIntegrated){
                        var windowHeight = this.elements.window.GetHeight();
                        var titlebarHeight = this.elements.titlebar.GetHeight();
                        var menubarHeight = this.elements.menubar.GetHeight();
                        var statusbarHeight = this.elements.statusbar.GetHeight();
                        var toolbarHeight = this.elements.toolbar.GetHeight();
                        this.elements.content.html().style.height = (windowHeight - titlebarHeight - menubarHeight - statusbarHeight -  toolbarHeight) + "px";
                    }
                    
                }.bind(this),
                
                toolbar: function(){
                    this.elements.toolbar.html().style.display = "block";
                    _state.toolbar = "VISIBLE";
                    
                    //Set Content Area height
                    var windowHeight = this.elements.window.GetHeight();
                    var titlebarHeight = this.elements.titlebar.GetHeight();
                    var menubarHeight = this.elements.menubar.GetHeight();
                    var statusbarHeight = this.elements.statusbar.GetHeight();
                    var toolbarHeight = this.elements.toolbar.GetHeight();
                    
                    if(this.theme.menubarIntegrated){
                        this.elements.content.html().style.height = (windowHeight - titlebarHeight - menubarHeight - statusbarHeight -  toolbarHeight) + "px";
                    }
                    else{
                        this.elements.content.html().style.height = (windowHeight - titlebarHeight - statusbarHeight -  toolbarHeight) + "px";
                    }
                    
                }.bind(this),
                
                statusbar: function(){
                    this.elements.statusbar.html().style.display = "block";
                    _state.statusbar = "VISIBLE";
                    
                    //Set Content Area height
                    var windowHeight = this.elements.window.GetHeight();
                    var titlebarHeight = this.elements.titlebar.GetHeight();
                    var menubarHeight = this.elements.menubar.GetHeight();
                    var statusbarHeight = this.elements.statusbar.GetHeight();
                    var toolbarHeight = this.elements.toolbar.GetHeight();
                    
                    if(this.theme.menubarIntegrated){
                        this.elements.content.html().style.height = (windowHeight - titlebarHeight - menubarHeight - statusbarHeight -  toolbarHeight) + "px";
                    }
                    else{
                        this.elements.content.html().style.height = (windowHeight - titlebarHeight - statusbarHeight -  toolbarHeight) + "px";
                    }
                    
                }.bind(this),
                
                content: function(){
                    this.elements.content.html().style.display = "block";
                    _state.content = "VISIBLE";
                    
                    
                }.bind(this),
                buttons: function(){
                    this.elements.titlebar.buttons.html().style.display = "block";
                    _state.buttons = "VISIBLE";
                }.bind(this)
            };
            
            this.Get = {
                State: {
                    window: function(){
                        return _state.window;
                    },
                    titlebar: function(){
                        return _state.titlebar;
                    },
                    menubar: function(){
                        return _state.menubar;
                    },
                    toolbar: function(){
                        return _state.toolbar;
                    },
                    statusbar: function(){
                        return _state.statusbar;
                    },
                    content: function(){
                        return _state.content;
                    }  
                },
                theme: function(){
                    return this.theme;
                }.bind(this),
                
                id: function(){
                    return _id;
                },
                position: function(){
                    return {top: _position.top,
                            left: _position.left};
                },
                title: function(){
                    return _title;
                } 
            };
            
            this.Set = {
                position: function(iTop, iLeft){
                    _position.top = iTop;
                    _position.left = iLeft;
                    
                    this.elements.window.html().style.top = iTop + "px";
                    this.elements.window.html().style.left = iLeft + "px";
                    
                }.bind(this),
                
                width: function(iWidth){
                    
                    _width = iWidth;
                    this.elements.window.html().style.width = _width + "px";
                    
                }.bind(this),
                
                height: function(iHeight){
                    
                    _height = iHeight;
                    this.elements.window.html().style.height = _height + "px";
                    
                    //Set Content Area height
                    var windowHeight = this.elements.window.GetHeight();
                    var titlebarHeight = this.elements.titlebar.GetHeight();
                    var menubarHeight = this.elements.menubar.GetHeight();
                    var statusbarHeight = this.elements.statusbar.GetHeight();
                    var toolbarHeight = this.elements.toolbar.GetHeight();
                    
                    if(this.theme.menubarIntegrated){
                        this.elements.content.html().style.height = (windowHeight - titlebarHeight - menubarHeight - statusbarHeight -  toolbarHeight) + "px";
                    }
                    else{
                        this.elements.content.html().style.height = (windowHeight - titlebarHeight - statusbarHeight -  toolbarHeight) + "px";
                    }
                    
                }.bind(this),
                
                title: function(sTitle){
                    
                    _title = sTitle;
                    this.elements.titlebar.text.html().innerHTML = _title;
                    
                }.bind(this),
                
                statusbarText: function(sStatus){
                    this.elements.statusbar.text.html().innerHTML = sStatus;
                    
                }.bind(this),
                
                theme:function(sThemeName){
                    this.LoadTheme(sThemeName);
                }.bind(this),
                
                onOpen: function(fName, scope){
                    
                    this.Callbacks.onOpen = fName;
                    this.Scope.onOpen = scope;
                    
                }.bind(this),
                
                onClose: function(fName, scope){
                    
                    this.Callbacks.onClose = fName;
                    this.Scope.onClose = scope;
                    
                }.bind(this),
                
                onMin: function(fName, scope){
                    
                    this.Callbacks.onMin = fName;
                    this.Scope.onMin = scope;
                    
                }.bind(this),
                
                onMax: function(fName, scope){
                    
                    this.Callbacks.onMax = fName;
                    this.Scope.onMax = scope;
                    
                }.bind(this),
                
                onFocus: function(fName, scope){
                    
                    this.Callbacks.onFocus = fName;
                    this.Scope.onFocus = scope;
                    
                }.bind(this),
                
                onBlur: function(fName, scope){
                    
                    this.Callbacks.onBlur = fName;
                    this.Scope.onBlur = scope;
                    
                }.bind(this)
            }
            var _Events = {
                onOpen: function(e){
                    
                    //Call user defined function if exist
                    if(this.Callbacks.onOpen){
                        
                        if(this.Scope.onOpen){
                            
                            this.Callbacks.onOpen.apply(this.Scope.onOpen, [e]);
                            
                        }
                        else{
                            
                            this.Callbacks.onOpen(e);
                            
                        }
                    }
                    
                    //Calling OS related code....
                    
                    
                }.bind(this),
                
                onClose: function(e){
                                        
                    //Calling OS related code....
                    os.windows.WindowsManager.Windows.remove(ID);
                    document.body.removeChild(this.elements.window.html());
                    
                    //Call user defined function if exist
                    if(this.Callbacks.onClose){
                        
                        if(this.Scope.onClose){
                            
                            this.Callbacks.onClose.apply(this.Scope.onClose, [e]);
                            
                        }
                        else{
                            
                            this.Callbacks.onClose(e);
                            
                        }
                    }
                                        
                                        
                }.bind(this),
                
                onMin: function(e){
                    
                    
                    
                    //Calling OS related code....
                    if(!this.isMin){
                        
                        this.Hide.content();
                        this.Hide.statusbar();
                        this.Hide.menubar();
                        this.Hide.buttons();
                        this.elements.titlebar.Class.ClearAll();
                        this.elements.titlebar.Class.Add(this.theme.Class.titlebarMinimized);

                        this.elements.window.Class.ClearAll();
                        this.elements.window.Class.Add(this.theme.Class.windowMinimized);
                        
                        this.elements.window.html().style.width = "150px";
                        this.elements.window.html().style.height = "25px";
                        
                        this.elements.titlebar.html().onclick = _Events.onMin;
                        
                        //Does Desktop Exist
                        if(os.windows.Desktop.Get.state.desktop() == "VISIBLE"){
                            this.elements.window.html().style.top = "";
                            this.elements.window.html().style.left = "";
                            os.windows.Desktop.Elements.dock.AppendChild(this.elements.window.html());
                            
                        }
                        //No desktop, minimize at spot
                        else{
                            this.elements.window.html().style.position = "absolute";
                        }
                        
                        this.isMin = true;
                        if(e){e.stopPropagation();}
                        
                        
                    }
                    else{
                        
                        this.Display.content();
                        
                        
                        this.Display.statusbar();
                        
                        if(_state.menubar == "VISIBLE")
                            this.Display.menubar();
                        
                        this.Display.buttons();
                        
                        this.elements.titlebar.Class.ClearAll();
                        this.elements.titlebar.Class.Add(this.theme.Class.titlebar);
                        
                        this.elements.window.Class.ClearAll();
                        this.elements.window.Class.Add(this.theme.Class.window);
                        this.Set.position(_position.top, _position.left);
                        this.Set.width(_width);
                        this.Set.height(_height);
                        
                        this.elements.titlebar.html().onclick = "";
                        
                        if(os.windows.Desktop.Get.state.desktop() == "VISIBLE"){
                            
                            document.body.appendChild(this.elements.window.html());
                        }
                        
                        //Set Content Area height
                        var windowHeight = this.elements.window.GetHeight();
                        var titlebarHeight = this.elements.titlebar.GetHeight();
                        var menubarHeight = this.elements.menubar.GetHeight();
                        var statusbarHeight = this.elements.statusbar.GetHeight();
                        var toolbarHeight = this.elements.toolbar.GetHeight();
                        if(this.theme.menubarIntegrated){
                            this.elements.content.html().style.height = (windowHeight - titlebarHeight - menubarHeight - statusbarHeight -  toolbarHeight) + "px";
                        }
                        else{
                            this.elements.content.html().style.height = (windowHeight - titlebarHeight - statusbarHeight -  toolbarHeight) + "px";
                        }
                        this.isMin= false;
                        if(e){e.stopPropagation();}
                        
                    }
                    
                    //Call user defined function if exist
                    if(this.Callbacks.onMin){
                        
                        if(this.Scope.onMin){
                            
                            this.Callbacks.onMin.apply(this.Scope.onMin, [e]);
                            
                        }
                        else{
                            
                            this.Callbacks.onMin(e);
                            
                        }
                    }                    
                    
                }.bind(this),
                
                onMax: function(e){
                    
                    
                    
                    //Calling OS related code....
                    if(!this.isMax){
                        this.isMax = true;
                        
                        
                        this.elements.window.Class.ClearAll();
                        this.elements.window.Class.Add(this.theme.Class.windowMaximized);
                        
                        this.elements.window.html().style.left = "0px";
                        this.elements.window.html().style.width = "";
                        
                        
                        
                        var dockHeight = os.windows.Desktop.Elements.dock.html().clientHeight;
                        var windowHeight = this.elements.window.GetHeight();
                        var titlebarHeight = this.elements.titlebar.GetHeight();
                        var menubarHeight = this.elements.menubar.GetHeight();
                        var statusbarHeight = this.elements.statusbar.GetHeight();
                        var toolbarHeight = this.elements.toolbar.GetHeight();
                        
                        if(this.theme.menubarIntegrated){
                            this.elements.content.html().style.height = (window.innerHeight - dockHeight - titlebarHeight - statusbarHeight - menubarHeight - toolbarHeight) + "px";
                            this.elements.window.html().style.height = (window.innerHeight - dockHeight) + "px";
                            this.elements.window.html().style.top = "0px";
                        }
                        else{
                            this.elements.content.html().style.height = (window.innerHeight - dockHeight - titlebarHeight - statusbarHeight - toolbarHeight) + "px";
                            this.elements.window.html().style.height = (window.innerHeight - dockHeight - menubarHeight) + "px";
                            this.elements.window.html().style.top = "20px";
                        }
                        
                        if(e){e.stopPropagation();}
                    }
                    else{
                        this.isMax = false;
                        this.elements.window.Class.ClearAll();
                        this.elements.window.Class.Add(this.theme.Class.window);
                        this.elements.window.html().style.height = _height + "px";
                        this.Set.position(_position.top, _position.left);
                        this.Set.width(_width);
                        this.Set.height(_height);
                        
                        var windowHeight = this.elements.window.GetHeight();
                        var titlebarHeight = this.elements.titlebar.GetHeight();
                        var menubarHeight = this.elements.menubar.GetHeight();
                        var statusbarHeight = this.elements.statusbar.GetHeight();
                        var toolbarHeight = this.elements.toolbar.GetHeight();
                        if(this.theme.menubarIntegrated){
                            this.elements.content.html().style.height = (windowHeight - titlebarHeight - menubarHeight - statusbarHeight -  toolbarHeight) + "px";
                        }
                        else{
                            this.elements.content.html().style.height = (windowHeight - titlebarHeight - statusbarHeight -  toolbarHeight) + "px";
                        }
                        if(e){e.stopPropagation();}
                    }
                    
                    //Call user defined function if exist
                    if(this.Callbacks.onMax){
                        
                        if(this.Scope.onMax){
                            
                            this.Callbacks.onMax.apply(this.Scope.onMax, [e]);
                            
                        }
                        else{
                            
                            this.Callbacks.onMax(e);
                            
                        }
                    }
                }.bind(this),
                
                onFocus: function(e){
                    
                    //Call user defined function if exist
                    if(this.Callbacks.onFocus){
                        
                        if(this.Scope.onFocus){
                            
                            this.Callbacks.onFocus.apply(this.Scope.onFocus, [e]);
                            
                        }
                        else{
                            
                            this.Callbacks.onFocus(e);
                            
                        }
                    }
                    
                    //Calling OS related code....
                    
                }.bind(this),
                
                onBlur: function(e){

                    //Calling OS related code....
                    this.elements.window.html().onclick = this.MakeActive;
                    this.elements.window.html().style.zIndex = 20;
                    
                    //Hide menubar if not integrated
                    if(!this.theme.menubarIntegrated){
                        this.Hide.menubar();
                    }
                    
                    //Call user defined function if exist
                    if(this.Callbacks.onBlur){
                        
                        if(this.Scope.onBlur){
                            
                            this.Callbacks.onBlur.apply(this.Scope.onBlur, [e]);
                            
                        }
                        else{
                            
                            this.Callbacks.onBlur(e);
                            
                        }
                    }
                    
                }.bind(this)
            }
            this.MakeActive = function(e){
                
                _Events.onFocus();
                
                if(os.windows.WindowsManager.ActiveWindow && (os.windows.WindowsManager.ActiveWindow != this)){
                   
                    os.windows.WindowsManager.ActiveWindow.Blur();
                   
                }
                os.windows.WindowsManager.ActiveWindow = this;
                this.elements.window.html().onclick = "";
                this.elements.window.html().style.zIndex = 25;
                
                //Hide menubar if not integrated
                if(!this.theme.menubarIntegrated){
                    if(_state.menubar == "VISIBLE")
                    this.Display.menubar();
                }
                
                
            }.bind(this);
            
            this.Blur = function(){
                _Events.onBlur();
            }.bind(this);
            
            this.Maximize = function(){
                _Events.onMax();
            };
            
            this.Minimize = function(){
                _Events.onMin();
            };
            this.LoadTheme = function(themeName){
                //Theme Name was supplied
                if(themeName){
                    this.theme = os.windows.WindowsManager.Themes.get(themeName)
                    
                    //verify Theme was found
                    if(!this.theme){
                        alert(themeName + " Window Theme was not found");
                    }
                    
                }
                //default to Mac Theme
                else{
                    
                    this.theme = os.windows.WindowsManager.Themes.get("Mac");
                }
                
                
                //
                //  Set Theme classes to Window Elements
                //
                
                //Clear Existing classes
                ClearThemeClasses();
                
                //Set Classes
                this.elements.window.Class.Add(this.theme.Class.window);
                this.elements.titlebar.Class.Add(this.theme.Class.titlebar);
                this.elements.menubar.Class.Add(this.theme.Class.menubar);
                this.elements.toolbar.Class.Add(this.theme.Class.toolbar);
                this.elements.statusbar.Class.Add(this.theme.Class.statusbar);
                this.elements.content.Class.Add(this.theme.Class.content);
                this.elements.titlebar.text.Class.Add(this.theme.Class.titlebarText);
                this.elements.titlebar.buttons.Class.Add(this.theme.Class.titlebarButtonContainer);
                this.elements.titlebar.buttons.max.Class.Add(this.theme.Class.titlebarButtonMax);
                this.elements.titlebar.buttons.min.Class.Add(this.theme.Class.titlebarButtonMin);
                this.elements.titlebar.buttons.close.Class.Add(this.theme.Class.titlebarButtonClose);
                this.elements.statusbar.text.Class.Add(this.theme.Class.statusbarText);
                this.elements.window.html().id = _id;
                
                //Set Default Window Postion
                this.Set.position(this.theme.Position.top, this.theme.Position.left)
                
                //Set Default Width/Height
                this.Set.width(this.theme.width);
                this.Set.height(this.theme.height);
                
                
                
                
            };
            
            var ClearThemeClasses = function(){
                //Top Level
                this.elements.window.Class.ClearAll();
                this.elements.titlebar.Class.ClearAll();
                this.elements.menubar.Class.ClearAll();
                this.elements.toolbar.Class.ClearAll();
                this.elements.statusbar.Class.ClearAll();
                this.elements.content.Class.ClearAll();
                this.elements.titlebar.text.Class.ClearAll();
                this.elements.titlebar.buttons.Class.ClearAll();
                this.elements.titlebar.buttons.max.Class.ClearAll();
                this.elements.titlebar.buttons.min.Class.ClearAll();
                this.elements.titlebar.buttons.close.Class.ClearAll();
                this.elements.statusbar.text.Class.ClearAll();

            }.bind(this);

            //
            //HTML Elements
            //
            
            //Top Level
            this.elements = {
                window: os.resschmgr.Create.HTMLElement("div"),
                titlebar: os.resschmgr.Create.HTMLElement("div"),
                menubar: os.resschmgr.Create.HTMLElement("div"),
                toolbar: os.resschmgr.Create.HTMLElement("div"),
                statusbar: os.resschmgr.Create.HTMLElement("div"),
                content: os.resschmgr.Create.HTMLElement("div")
            }
            
            //Title Bar
            this.elements.titlebar.text = os.resschmgr.Create.HTMLElement("div");
            this.elements.titlebar.buttons = os.resschmgr.Create.HTMLElement("div");
            this.elements.titlebar.buttons.max = os.resschmgr.Create.HTMLElement("div");
            this.elements.titlebar.buttons.min = os.resschmgr.Create.HTMLElement("div");
            this.elements.titlebar.buttons.close = os.resschmgr.Create.HTMLElement("div");
            
            //Menu Bar
            this.elements.menubar.children = os.resschmgr.Create.Map();
            
            //Tool Bar
            this.elements.toolbar.children = os.resschmgr.Create.Map();
            
            //Status Bar
            this.elements.statusbar.text = os.resschmgr.Create.HTMLElement("div");
            
            //
            //  Begin Window Initialization
            //
            this.LoadTheme(themeName);
            
            
            
            //Set Title Bar Title
            if(_title)
                this.elements.titlebar.text.html().innerHTML = _title;
            
            //Set ID's
            this.elements.window.html().id =                    _id;
            this.elements.titlebar.html().id =                  _id;
            this.elements.menubar.html().id =                   _id;
            this.elements.toolbar.html().id =                   _id;
            this.elements.statusbar.html().id =                 _id;
            this.elements.content.html().id =                   _id;
            this.elements.titlebar.text.html().id =             _id;
            this.elements.titlebar.buttons.html().id =          _id;
            this.elements.titlebar.buttons.max.html().id =      _id;
            this.elements.titlebar.buttons.min.html().id =      _id;
            this.elements.titlebar.buttons.close.html().id =    _id;
            this.elements.statusbar.text.html().id =            _id;
            
            //Set Callbacks
            this.elements.titlebar.buttons.max.html().onclick =      _Events.onMax;
            this.elements.titlebar.buttons.min.html().onclick =      _Events.onMin;
            this.elements.titlebar.buttons.close.html().onclick =    _Events.onClose;
            this.elements.titlebar.html().onmousedown = os.windows.WindowsManager.BeginDrag;
                
            //***************************
            //      CONNECT ELEMENTS
            //***************************
                
            //Build Title Bar
            this.elements.titlebar.buttons.AppendChild(this.elements.titlebar.buttons.close.html());
            this.elements.titlebar.buttons.AppendChild(this.elements.titlebar.buttons.min.html());
            this.elements.titlebar.buttons.AppendChild(this.elements.titlebar.buttons.max.html());
            this.elements.titlebar.AppendChild(this.elements.titlebar.buttons.html());
            this.elements.titlebar.AppendChild(this.elements.titlebar.text.html());
            
            //Build Status Bar
            this.elements.statusbar.AppendChild(this.elements.statusbar.text.html());
            
            this.elements.window.AppendChild(this.elements.titlebar.html());
            this.elements.window.AppendChild(this.elements.menubar.html());
            this.elements.window.AppendChild(this.elements.toolbar.html());
            this.elements.window.AppendChild(this.elements.content.html());
            this.elements.window.AppendChild(this.elements.statusbar.html());
            
            //Attach to document
            document.body.appendChild(this.elements.window.html());
            
            
            //Set Content Area height
            var windowHeight = this.elements.window.GetHeight();
            var titlebarHeight = this.elements.titlebar.GetHeight();
            var menubarHeight = this.elements.menubar.GetHeight();
            var statusbarHeight = this.elements.statusbar.GetHeight();
            var toolbarHeight = this.elements.toolbar.GetHeight();
            
            if(this.theme.menubarIntegrated){
                this.elements.content.html().style.height = (windowHeight - titlebarHeight - menubarHeight - statusbarHeight -  toolbarHeight) + "px";
            }
            else{
                this.elements.content.html().style.height = (windowHeight - titlebarHeight - statusbarHeight -  toolbarHeight) + "px";
            }
            
            //Default Window to be hidden
            this.Hide.window();
            
            //Registar with Windows Manager
            os.windows.WindowsManager.Windows.put(windowID, this);
            
            
        };
        
        var CWindowTheme = function(sName){
            this.type = null;
            this.name = sName;
            this.url = null;
            this.menubarIntegrated = null;
            this.Class = {
                window: null,
                windowMinimized: null,
                windowMaximized: null,
                titlebar: null,
                titlebarText: null,
                titlebarButtonContainer: null,
                titlebarButtonMax: null,
                titlebarButtonMin:null,
                titlebarButtonClose: null,
                titlebarMinimized: null,
                menubar: null,
                menubarElement: null,
                toolbar: null,
                toolbarElement: null,
                content: null,
                statusbar: null,
                statusbarText: null
            };
            
            this.Position = {
                top: 0,
                left: 0
            };
            
            this.width = 400;
            this.height = 300;
            this.resizable = false;
            
        };
        
                
        var CMenuElement = function(){
            this.SetHTML("div");
            this.children = [];
            this.theme = null;
            this.onClickScope = null;
            this.onClick = null;
            
            this.AddChild = function(){
                
            };
        };
        CMenuElement.inherits(os.resschmgr.CHTMLElement);
        
        var CToolbarElement = function(){
            this.SetHTML("div");
            this.imageURL = null;
            this.theme = null;
            this.tooltipText = null;
            this.tooltipEnabled = false;
            this.onClickScope = null;
            this.onClick = null;
        };
        CToolbarElement.inherits(os.resschmgr.CHTMLElement);
        
        var CDesktopTheme = function(sName){ 
            this.name = sName;
            this.url = null;
            this.Class = {
                desktop: null,
                dock: null,
                startButton: null,
                startButtonText: null,
                startMenu: null,
                application: null
            };
            
            
        };
        
        var CApplication = function(id){
            this.SetHTML("div");
            
            var _displayText = null;
            var _tooltipText = null;
            var _tooltipEnabled = false;
            var _imageURL = null;
            var _theme = null;
            var _id = id;
            var _onClick = function(e){
                //Call user defined function if exist
                if(this.onClick){
                    
                    if(this.onClickScope){
                        
                        this.onClick.apply(this.onClickScope, [e]);
                        
                    }
                    else{
                        
                        this.onClick(e);
                        
                    }
                }
                
                //Calling OS related code....
                
                
            }.bind(this);
            
            this.onClickScope = null;
            this.onClick = null;
            
            this.Get ={
                ID: function(){
                    return _id;
                }.bind(this),
                
                DisplayText: function(){
                    
                }.bind(this),
                
                TooltipText: function(){
                    
                }.bind(this),
                
                Callback: function(){
                    
                }.bind(this),
                
                Image: function(){
                    
                }.bind(this)
            }
            
            this.Set = {
                DisplayText: function(sDisplayText){
                    
                    this.html().innerHTML = sDisplayText;
                    _displayText = sDisplayText;
                    
                }.bind(this),
                
                TooltipText: function(){
                    
                }.bind(this),
                
                Callback: function(func, scope){
                    this.onClick = func;
                    if(scope){
                        this.onClickScope = scope;
                    }
                }.bind(this),
                
                Image: function(){
                    
                }.bind(this),
                
                Theme: function(theme){
                    
                    _theme = theme;
                    this.Class.ClearAll();
                    this.Class.Add(theme.Class.application);
                    
                }.bind(this)
            };
            
            this.EnableTooltip = function(){
                
            };
            
            this.DisableTooltip = function(){
                
            };
            
            this.html().onclick = _onClick;
            os.windows.Desktop.Applications.put(id, this);
            
            
        };
        CApplication.inherits(os.resschmgr.CHTMLElement);

        return{
            //PUBLIC OBJECTS
            Create: {
                Window: function(wndTitle, themeName){
                    return new CWindow("jahova.window.id." + os.windows.WindowsManager.nextID++, wndTitle, themeName);
                },
                ErrorWindow: function(wndTitle, message){
                    var width = 400;
                    var height = 100;
                    macWin = os.windows.Create.Window("ERROR: " + wndTitle, "PC");
                    
                    macWin.elements.content.html().innerHTML = message;
                    
                    macWin.elements.content.html().style.backgroundImage = "none";
                    
                    macWin.Set.width(width);
                    macWin.Set.height(height);
                    macWin.Set.position((window.innerHeight/2) - (height / 2), (window.innerWidth / 2) - (width / 2));
                    
                    macWin.Hide.statusbar();
                    macWin.Hide.menubar();
                    macWin.Hide.toolbar();
                    
                    macWin.Display.window();
                    
                        
                },
                MessageWindow: function(wndTitle, message){
                    var width = 400;
                    var height = 100;
                    macWin = os.windows.Create.Window(" " + wndTitle, "PC");
                    
                    macWin.elements.content.html().innerHTML = message;
                    
                    macWin.elements.content.html().style.backgroundImage = "none";
                    
                    macWin.Set.width(width);
                    macWin.Set.height(height);
                    macWin.Set.position((window.innerHeight/2) - (height / 2), (window.innerWidth / 2) - (width / 2));
                    
                    macWin.Hide.statusbar();
                    macWin.Hide.menubar();
                    macWin.Hide.toolbar();
                    
                    macWin.Display.window();
                    
                        
                },
                Theme: function(name){
                    var theme = new CWindowTheme(name);
                    os.windows.WindowsManager.Themes.put(name, theme);
                    return theme;
                },
                MenuElement: function(){
                    return new CMenuElement();
                },
                ToolbarElement: function(){
                    return new CToolbarElement();
                }
            },
            WindowsManager: {
                nextID: 0,
                Windows: null,
                Themes: null,
                BuildDefaultThemes: function(){
                    //
                    //      Build PC Theme
                    //
                    var pcTheme = new os.windows.Create.Theme("PC");
                    pcTheme.menubarIntegrated = true;
                    pcTheme.type = "STD";
                    pcTheme.url = os.GetDomain + "styles/jahova.window.pc.css";
                    pcTheme.Position.top = 50;
                    pcTheme.Position.left = 50;
                    pcTheme.Class.window = "pcWindow";
                    pcTheme.Class.windowMinimized = "pcWindowMinimized";
                    pcTheme.Class.windowMaximized = "pcWindowMaximized";
                    pcTheme.Class.titlebar = "pcTitlebar";
                    pcTheme.Class.titlebarText = "pcTitlebarText";
                    pcTheme.Class.titlebarButtonContainer = "pcButtonContainer";
                    pcTheme.Class.titlebarButtonMax = "pcButtonMax";
                    pcTheme.Class.titlebarButtonMin = "pcButtonMin";
                    pcTheme.Class.titlebarButtonClose = "pcButtonClose";
                    pcTheme.Class.titlebarMinimized = "pcTitlebarMinimized";
                    pcTheme.Class.menubar = "pcMenubar";
                    pcTheme.Class.menubarElement = "pcMenubarElement";
                    pcTheme.Class.toolbar = "pcToolbar";
                    pcTheme.Class.toolbarElement = "pcToolbarElement";
                    pcTheme.Class.content = "pcContent";
                    pcTheme.Class.statusbar = "pcStatusbar";
                    pcTheme.Class.statusbarText = "pcStatusbarText";
                    
                    //save theme
                    os.windows.WindowsManager.Themes.put(pcTheme.name, pcTheme);
                    
                    //
                    //      Build Mac Theme
                    //
                    var macTheme = os.windows.Create.Theme("Mac");
                    macTheme.type = "STD";
                    macTheme.menubarIntegrated = false;
                    macTheme.url = os.GetDomain + "styles/jahova.window.mac.css";
                    macTheme.Position.top = 50;
                    macTheme.Position.left = 50;
                    macTheme.Class.window = "macWindow";
                    macTheme.Class.windowMinimized = "macWindowMinimized";
                    macTheme.Class.windowMaximized = "macWindowMaximized";
                    macTheme.Class.titlebar = "macTitlebar";
                    macTheme.Class.titlebarText = "macTitlebarText";
                    macTheme.Class.titlebarButtonContainer = "macButtonsContainer";
                    macTheme.Class.titlebarButtonMax = "macButtonMax";
                    macTheme.Class.titlebarButtonMin = "macButtonMin";
                    macTheme.Class.titlebarButtonClose = "macButtonClose";
                    macTheme.Class.titlebarMinimized = "macTitlebarMinimized";
                    macTheme.Class.menubar = "macMenubar";
                    macTheme.Class.menubarElement = "macMenubarElement";
                    macTheme.Class.toolbar = "macToolbar";
                    macTheme.Class.toolbarElement = "macToolbarElement";
                    macTheme.Class.content = "macContent";
                    macTheme.Class.statusbar = "macStatusbar";
                    macTheme.Class.statusbarText = "macStatusbarText";
                    
                    //save theme
                    os.windows.WindowsManager.Themes.put("Mac", macTheme);
                    
                    
                },
                ActiveWindow: null,
                Create: {
                    Window: function(wndTitle, themeName){
                        return new CWindow("jahova.window.id." + os.windows.WindowsManager.nextID++, wndTitle, themeName);
                    },
                    Theme: function(name){
                        var theme = new CWindowTheme(name);
                        os.windows.WindowsManager.Themes.put(name, theme);
                        return theme;
                        
                    },
                    MenuElement: function(){
                        return new CMenuElement();
                    },
                    ToolbarElement: function(){
                        return new CToolbarElement();
                    }
                    
                },
                BeginDrag: function(e){
                    var obj = os.windows.WindowsManager.Windows.get(e.target.id);
                    
                    if(obj){
                        
                        if(os.windows.WindowsManager.ActiveWindow){
                            os.windows.WindowsManager.ActiveWindow.elements.window.html().zIndex = 20;
                        }
                        
                        obj.MakeActive();
                        
                        document.addEventListener("mousemove", os.windows.WindowsManager.DragStart, false);
                        document.addEventListener("mouseup", os.windows.WindowsManager.DragStop, false);
                        
                        obj.startX = e.clientX + window.scrollX;
                        obj.startY = e.clientY + window.scrollY;
                        
                        obj.startTop = obj.Get.position().top;
                        obj.startLeft = obj.Get.position().left;
                        
                    }
                    e.preventDefault();
                },
                DragStart: function(e){
                    var object = os.windows.WindowsManager.ActiveWindow;
                    var x,y;
                    
                    x = e.clientX + window.scrollX;
                    y = e.clientY + window.scrollY;
                    
                    if(object){
                        
                        object.Set.position((object.startTop  + y - object.startY), (object.startLeft + x - object.startX) );
                        
                    }

                    e.preventDefault();
                },
                DragStop: function(e){
                    var object = os.windows.WindowsManager.ActiveWindow;
                    if(object){
                        document.removeEventListener("mousemove", os.windows.WindowsManager.DragStart,false);
                        document.removeEventListener("mouseup", os.windows.WindowsManager.DragStop, false);
                    }
                    
                    e.preventDefault();
                },
                BeginResize: function(e){
                    
                },
                ResizeStart: function(e){
                    
                },
                ResizeStop: function(e){
                    
                }
                
            },
            
            Desktop: {
                Themes: null,
                Applications: null,
                nextID: 0,
                theme: null,
                _state: {
                    desktop: null,
                    dock: null,
                    startButton: null,
                    startButtonText: null,
                    startMenu: null
                },
                Get: {
                    state: {
                        desktop: function(){
                            return os.windows.Desktop._state.desktop;
                        },
                        dock: function(){
                            return os.windows.Desktop._state.dock;
                        },
                        startButton: function(){
                            return os.windows.Desktop._state.startButton;
                        },
                        startButtonText: function(){
                            return os.windows.Desktop._state.startButtonText;
                        },
                        startMenu: function(){
                            return os.windows.Desktop._state.startMenu;
                        }
                    }
                },
                Create: {
                    Theme: function(name){
                        
                        var theme = new CDesktopTheme(name);
                        os.windows.Desktop.Themes.put(name, theme);
                        return theme;
                    },
                    Application: function(){
                        return new CApplication(os.windows.Desktop.nextID++);
                    }
                },
                Display: {
                    desktop: function(){
                        os.windows.Desktop.Elements.desktop.html().style.display = "block";
                        os.windows.Desktop._state.desktop = "VISIBLE";
                    },
                    dock: function(){
                        os.windows.Desktop.Elements.dock.html().style.display = "block";
                        os.windows.Desktop._state.dock = "VISIBLE";
                    },
                    startButton: function(){
                        os.windows.Desktop.Elements.startButton.html().style.display = "block";
                        os.windows.Desktop._state.startButton = "VISIBLE";
                    },
                    startButtonText: function(){
                        os.windows.Desktop.Elements.startButtonText.html().style.display = "block";
                        os.windows.Desktop._state.startButtonText = "VISIBLE";
                    },
                    startMenu: function(){
                        os.windows.Desktop.Elements.startMenu.html().style.display = "block";
                        os.windows.Desktop._state.startMenu = "VISIBLE";
                    }
                },
                Hide: {
                    desktop: function(){
                        os.windows.Desktop.Elements.desktop.html().style.display = "none";
                        os.windows.Desktop._state.desktop = "HIDDEN";
                    },
                    dock: function(){
                        os.windows.Desktop.Elements.dock.html().style.display = "none";
                        os.windows.Desktop._state.dock = "HIDDEN";
                    },
                    startButton: function(){
                        os.windows.Desktop.Elements.startButton.html().style.display = "none";
                        os.windows.Desktop._state.startButton = "HIDDEN";
                    },
                    startButtonText: function(){
                        os.windows.Desktop.Elements.startButtonText.html().style.display = "none";
                        os.windows.Desktop._state.startButtonText = "HIDDEN";
                    },
                    startMenu: function(){
                        os.windows.Desktop.Elements.startMenu.html().style.display = "none";
                        os.windows.Desktop._state.startMenu = "HIDDEN";
                    }
                },
                Set: {

                },
                BuildDefaultTheme: function(){
                    var jDesktop = os.windows.Desktop.Create.Theme("default");
                    
                    jDesktop.url = os.GetDomain + "styles/jahova.window.desktop.css";
                    jDesktop.Class.desktop =           "jDesktop";
                    jDesktop.Class.dock =              "jDock";
                    jDesktop.Class.startButton =       "jStartButton";
                    jDesktop.Class.startButtonText =   "jStartButtonText";
                    jDesktop.Class.startMenu =         "jStartMenu";
                    jDesktop.Class.application =       "jApplication";
                
                },
                AddApplication: function(app){
                    
                    app.Set.Theme(os.windows.Desktop.theme);
                    os.windows.Desktop.Elements.startMenu.AppendChild(app.html());
                },
                RemoveApplication: function(){
                    
                },
                LoadTheme: function(theme){
                    //Set Theme 
                    os.windows.Desktop.theme = theme;
                    
                    //Clear any existing Theme
                    os.windows.Desktop.ClearTheme();
                    
                    //Load Desktop Classes
                    os.windows.Desktop.Elements.desktop.Class.Add(theme.Class.desktop);
                    os.windows.Desktop.Elements.dock.Class.Add(theme.Class.dock);
                    os.windows.Desktop.Elements.startButton.Class.Add(theme.Class.startButton);
                    os.windows.Desktop.Elements.startButtonText.Class.Add(theme.Class.startButtonText);
                    os.windows.Desktop.Elements.startMenu.Class.Add(theme.Class.startMenu);
                    document.body.className = "jDesktop";
                    
                    //Loop through any applications
                    for(var i = 0; i < os.windows.Desktop.Applications.size; i++){
                        os.windows.Applications.value().Set.Theme(theme);
                    }
                    
                    
                },
                ClearTheme: function(){
                    os.windows.Desktop.Elements.desktop.Class.ClearAll();
                    os.windows.Desktop.Elements.dock.Class.ClearAll();
                    os.windows.Desktop.Elements.startButton.Class.ClearAll();
                    os.windows.Desktop.Elements.startButtonText.Class.ClearAll();
                    os.windows.Desktop.Elements.startMenu.Class.ClearAll();
                    document.body.className = "";
                },
                Elements: {
                    desktop: os.resschmgr.Create.HTMLElement("div"),
                    dock: os.resschmgr.Create.HTMLElement("div"),
                    startButton: os.resschmgr.Create.HTMLElement("div"),
                    startButtonText: os.resschmgr.Create.HTMLElement("div"),
                    startMenu: os.resschmgr.Create.HTMLElement("div")
                },
                Load: function(sTheme){
                    var theme;
                    
                    //Did user provide a theme, if not load default
                    if(sTheme){
                        
                        theme = os.windows.Desktop.Themes.get(sTheme);
                    
                    }
                    else{
                        
                        theme = os.windows.Desktop.Themes.get("default");
                    
                    }
                    
                    //Set Theme
                    os.windows.Desktop.LoadTheme(theme);
                    
                    //Set IDs
                    os.windows.Desktop.Elements.desktop.html().id = "jdesktop";
                    os.windows.Desktop.Elements.dock.html().id = "jdesktop.dock";
                    os.windows.Desktop.Elements.startButton.html().id = "jdesktop.startButton";
                    os.windows.Desktop.Elements.startButtonText.html().id = "jdesktop.startButtonText";
                    os.windows.Desktop.Elements.startMenu.html().id = "jdesktop.startMenu";
                    
                    //Set Text
                    os.windows.Desktop.Elements.startButtonText.html().innerHTML = "Start";
                    
                    //Connect Elements
                    os.windows.Desktop.Elements.desktop.AppendChild(os.windows.Desktop.Elements.dock.html());
                    os.windows.Desktop.Elements.dock.AppendChild(os.windows.Desktop.Elements.startButton.html());
                    os.windows.Desktop.Elements.startButton.AppendChild(os.windows.Desktop.Elements.startButtonText.html());
                    os.windows.Desktop.Elements.startButton.AppendChild(os.windows.Desktop.Elements.startMenu.html());
                    
                    document.body.appendChild(os.windows.Desktop.Elements.desktop.html());
                    
                    //Set States
                    os.windows.Desktop._state.desktop =         "VISIBLE";
                    os.windows.Desktop._state.dock =            "VISIBLE";
                    os.windows.Desktop._state.startButton =     "VISIBLE";
                    os.windows.Desktop._state.startButtonText = "VISIBLE";
                    os.windows.Desktop._state.startMenu =       "VISIBLE";
                }
                
            },
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
                
                //Initialize Windows Manager
                os.windows.WindowsManager.Windows = os.resschmgr.Create.Map();
                os.windows.WindowsManager.Themes = os.resschmgr.Create.Map();
                
                os.windows.WindowsManager.BuildDefaultThemes();
                
                
                //Initialize Desktop
                os.windows.Desktop.Themes = os.resschmgr.Create.Map();
                os.windows.Desktop.Applications = os.resschmgr.Create.Map();
                
                os.windows.Desktop.BuildDefaultTheme();
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