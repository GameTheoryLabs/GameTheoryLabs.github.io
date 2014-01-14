
com.jahova.utilities.Instance().DebugBar = (function()
                        {
                            var pInstance;
                           
                            function constructor()
                            {
                                //******************
                                //PRIVATE ATTRIBUTES
                                //******************
                                
                                var NAME = "JaHOVA Utilities : Debug Bar";
                                var VERSION = "0v5";
                                var PATH = "scripts/jahova/Utilities/DebugBar/jahova.utilities.debugbar.js";
                                var ENABLED = true;
                                
                                var os = com.jahova.os.Instance();
                                var debugbar = os.debugbar;
                                var prompt = "~JaHOVA OS >>";
                                

                                //******************
                                //PRIVATE METHODS
                                //******************
                                
                                
                                //******************
                                //INITALIZATION
                                //******************

                                
                                return{
                                    //PUBLIC ATTRIBUTES
                                    ConsolePagePinned: false,
                                    LogsPagePinned: false,
                                    SettingsPagePinned: false,
                                    
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
                                    
                                    GetStatus: function(){
                                        return ENABLED;
                                    },
                                    
                                    Enable: function(){
                                        ENABLED = true;
                                        os.Elements.DebugBar.style.display = "block";
                                        
                                    },
                                    
                                    Disable: function(){
                                        ENABLED = false;
                                        os.Elements.DebugBar.style.display = "none";
                                        
                                    },
                                    
                                    Initialize: function(){
                                        window.onkeydown = os.debugbar.EvaluateShortCuts;
                                        os.debugbar.Build();
                                    },
                                    
                                    Build: function(){
                                        
                                        //Debug Bar Wrapper
                                        os.Elements.DebugBar = document.createElement("div");
                                        os.Elements.DebugBar.id = "com.jahova.debugBar";
                                        os.Elements.DebugBar.className = "ideSidebar appBaseColor";
                                        document.body.appendChild(os.Elements.DebugBar);
                                        
                                        
                                        //***********************************
                                        //
                                        //  CONSOLE
                                        //
                                        //***********************************                                        
                                        
                                        //Debug Bar Tab
                                        os.Elements.DebugBarConsoleTab = document.createElement("div");
                                        os.Elements.DebugBarConsoleTab.id = "com.jahova.debugBar.Console.Tab";
                                        os.Elements.DebugBarConsoleTab.className = "ideSidebarTabFolderView jahova_borRadR2 sidebarTabColor";
                                        os.Elements.DebugBar.appendChild(os.Elements.DebugBarConsoleTab);
                                        
                                        //Debug Bar Tab Label
                                        os.Elements.DebugBarConsoleTabLabel = document.createElement("div");
                                        os.Elements.DebugBarConsoleTabLabel.id = "com.jahova.debugBar.Console.Tab.Label";
                                        os.Elements.DebugBarConsoleTabLabel.className = "ideSidebarTabTextFolderView textColorWhite";
                                        os.Elements.DebugBarConsoleTabLabel.innerHTML = "Console";
                                        os.Elements.DebugBarConsoleTab.appendChild(os.Elements.DebugBarConsoleTabLabel);
                                        
                                        //Debug Bar Content Wrapper
                                        os.Elements.DebugBarConsole = document.createElement("div");
                                        os.Elements.DebugBarConsole.id = "com.jahova.debugBar.Console.Wrapper";
                                        os.Elements.DebugBarConsole.className = "ideSidebarPageFolderView sidebarTabColor jahova_borRadL2 jahova_borRadB2 jahova_transWp5s";
                                        //os.Elements.DebugBarConsole.style.visibility = "visible";
                                        //os.Elements.DebugBarConsole.style.width = "260px";
                                        os.Elements.DebugBarConsoleTab.appendChild(os.Elements.DebugBarConsole);
                                        
                                        //Debug Bar Content Header
                                        os.Elements.DebugBarConsoleHeader = document.createElement("div");
                                        os.Elements.DebugBarConsoleHeader.id = "com.jahova.debugBar.Console.Header";
                                        os.Elements.DebugBarConsoleHeader.className = "ideSidebarFolderHeader jahova_borRadT2 menuColor";
                                        os.Elements.DebugBarConsole.appendChild(os.Elements.DebugBarConsoleHeader);
                                        
                                        //Debug Bar Content Header Label
                                        os.Elements.DebugBarConsoleHeaderLabel = document.createElement("div");
                                        os.Elements.DebugBarConsoleHeaderLabel.id = "com.jahova.debugBar.Console.Header.Label";
                                        os.Elements.DebugBarConsoleHeaderLabel.className = "ideSidebarFolderH3";
                                        os.Elements.DebugBarConsoleHeaderLabel.innerHTML = "Terminal Window";
                                        os.Elements.DebugBarConsoleHeader.appendChild(os.Elements.DebugBarConsoleHeaderLabel);
                                        
                                        //Debug Bar Header Pin
                                        os.Elements.DebugBarConsoleHeaderPin = document.createElement("div");
                                        os.Elements.DebugBarConsoleHeaderPin.id = "com.jahova.debugBar.Console.Header.Pin";
                                        os.Elements.DebugBarConsoleHeaderPin.className = "ideSidebarPin";
                                        os.Elements.DebugBarConsoleHeaderPin.onclick = this.AnchorPage;
                                        os.Elements.DebugBarConsoleHeader.appendChild(os.Elements.DebugBarConsoleHeaderPin);
                                      
                                        //Debug Bar Icon
                                        os.Elements.DebugBarConsoleIconHeader = document.createElement("div");
                                        os.Elements.DebugBarConsoleIconHeader.id = "com.jahova.debugBar.Console.Icons";
                                        os.Elements.DebugBarConsoleIconHeader.className = "ideSidebarFolderIconHeader iconColor";
                                        os.Elements.DebugBarConsole.appendChild(os.Elements.DebugBarConsoleIconHeader);
                                        
                                        //Debug Bar Content Area
                                        os.Elements.DebugBarConsoleContent = document.createElement("div");
                                        os.Elements.DebugBarConsoleContent.id = "com.jahova.debugBar.Console.Content";
                                        os.Elements.DebugBarConsoleContent.className = "ideSidebarFolderContent jahova_borRadB2 viewContentBkgColor";
                                        os.Elements.DebugBarConsole.appendChild(os.Elements.DebugBarConsoleContent);
                                        
                                        os.console.cmdWindow.style.border = "0px";
                                        os.console.cmdWindow.style.height = "503px";
                                        os.Elements.DebugBarConsoleContent.appendChild(os.console.cmdWindow);
                                        
                                        
                                        //***********************************
                                        //
                                        //  LOGS
                                        //
                                        //***********************************
                                        
                                        //Debug Bar Tab
                                        os.Elements.DebugBarLogTab = document.createElement("div");
                                        os.Elements.DebugBarLogTab.id = "com.jahova.debugBar.Log.Tab";
                                        os.Elements.DebugBarLogTab.className = "ideSidebarTabFolderView jahova_borRadR2 sidebarTabColor";
                                        os.Elements.DebugBar.appendChild(os.Elements.DebugBarLogTab);
                                        
                                        //Debug Bar Tab Label
                                        os.Elements.DebugBarLogTabLabel = document.createElement("div");
                                        os.Elements.DebugBarLogTabLabel.id = "com.jahova.debugBar.Log.TabLabel";
                                        os.Elements.DebugBarLogTabLabel.className = "ideSidebarTabTextFolderView textColorWhite";
                                        os.Elements.DebugBarLogTabLabel.innerHTML = "Logs";
                                        os.Elements.DebugBarLogTab.appendChild(os.Elements.DebugBarLogTabLabel);
                                        
                                        //Debug Bar Content Wrapper
                                        os.Elements.DebugBarLog = document.createElement("div");
                                        os.Elements.DebugBarLog.id = "com.jahova.debugBar.Log.Wrapper";
                                        os.Elements.DebugBarLog.className = "ideSidebarPageFolderView sidebarTabColor jahova_borRadL2 jahova_borRadB2 jahova_transWp5s";
                                        os.Elements.DebugBarLogTab.appendChild(os.Elements.DebugBarLog);
                                        
                                        //Debug Bar Content Header
                                        os.Elements.DebugBarLogHeader = document.createElement("div");
                                        os.Elements.DebugBarLogHeader.id = "com.jahova.debugBar.Log.Header";
                                        os.Elements.DebugBarLogHeader.className = "ideSidebarFolderHeader jahova_borRadT2 menuColor";
                                        os.Elements.DebugBarLog.appendChild(os.Elements.DebugBarLogHeader);
                                        
                                        //Debug Bar Content Header Label
                                        os.Elements.DebugBarLogHeaderLabel = document.createElement("div");
                                        os.Elements.DebugBarLogHeaderLabel.id = "com.jahova.debugBar.Log.Header.Label";
                                        os.Elements.DebugBarLogHeaderLabel.className = "ideSidebarFolderH3";
                                        os.Elements.DebugBarLogHeaderLabel.innerHTML = "JaHOVA Logs";
                                        os.Elements.DebugBarLogHeader.appendChild(os.Elements.DebugBarLogHeaderLabel);
                                        
                                        //Debug Bar Header Pin
                                        os.Elements.DebugBarLogHeaderPin = document.createElement("div");
                                        os.Elements.DebugBarLogHeaderPin.id = "com.jahova.debugBar.Log.Header.Pin";
                                        os.Elements.DebugBarLogHeaderPin.className = "ideSidebarPin";
                                        os.Elements.DebugBarLogHeaderPin.onclick = this.AnchorPage;
                                        os.Elements.DebugBarLogHeader.appendChild(os.Elements.DebugBarLogHeaderPin);
                                        
                                        //Debug Bar Icon
                                        os.Elements.DebugBarLogIconHeader = document.createElement("div");
                                        os.Elements.DebugBarLogIconHeader.id = "com.jahova.debugBar.Log.Icons";
                                        os.Elements.DebugBarLogIconHeader.className = "ideSidebarFolderIconHeader iconColor";
                                        os.Elements.DebugBarLog.appendChild(os.Elements.DebugBarLogIconHeader);
                                        
                                        //Debug Bar Content Area
                                        os.Elements.DebugBarLogContent = document.createElement("pre");
                                        os.Elements.DebugBarLogContent.id = "com.jahova.debugBar.Log.Content";
                                        os.Elements.DebugBarLogContent.className = "ideSidebarFolderContent jahova_borRadB2 viewContentBkgColor";
                                        os.Elements.DebugBarLog.appendChild(os.Elements.DebugBarLogContent);
                                        
                                        
                                        //***********************************
                                        //
                                        //  SETTINGS
                                        //
                                        //***********************************
                                        
                                        //Debug Bar Tab
                                        os.Elements.DebugBarSettingsTab = document.createElement("div");
                                        os.Elements.DebugBarSettingsTab.id = "com.jahova.debugBar.Settings.Tab";
                                        os.Elements.DebugBarSettingsTab.className = "ideSidebarTabFolderView jahova_borRadR2 sidebarTabColor";
                                        os.Elements.DebugBar.appendChild(os.Elements.DebugBarSettingsTab);
                                        
                                        //Debug Bar Tab Label
                                        os.Elements.DebugBarSettingsTabLabel = document.createElement("div");
                                        os.Elements.DebugBarSettingsTabLabel.id = "com.jahova.debugBar.Settings.TabLabel";
                                        os.Elements.DebugBarSettingsTabLabel.className = "ideSidebarTabTextFolderView textColorWhite";
                                        os.Elements.DebugBarSettingsTabLabel.innerHTML = "Settings";
                                        os.Elements.DebugBarSettingsTab.appendChild(os.Elements.DebugBarSettingsTabLabel);
                                        
                                        //Debug Bar Content Wrapper
                                        os.Elements.DebugBarSettings = document.createElement("div");
                                        os.Elements.DebugBarSettings.id = "com.jahova.debugBar.Settings.Wrapper";
                                        os.Elements.DebugBarSettings.className = "ideSidebarPageFolderView sidebarTabColor jahova_borRadL2 jahova_borRadB2 jahova_transWp5s";
                                        os.Elements.DebugBarSettingsTab.appendChild(os.Elements.DebugBarSettings);
                                        
                                        //Debug Bar Content Header
                                        os.Elements.DebugBarSettingsHeader = document.createElement("div");
                                        os.Elements.DebugBarSettingsHeader.id = "com.jahova.debugBar.Settings.Header";
                                        os.Elements.DebugBarSettingsHeader.className = "ideSidebarFolderHeader jahova_borRadT2 menuColor";
                                        os.Elements.DebugBarSettings.appendChild(os.Elements.DebugBarSettingsHeader);
                                        
                                        //Debug Bar Content Header Label
                                        os.Elements.DebugBarSettingsHeaderLabel = document.createElement("div");
                                        os.Elements.DebugBarSettingsHeaderLabel.id = "com.jahova.debugBar.Settings.Header.Label";
                                        os.Elements.DebugBarSettingsHeaderLabel.className = "ideSidebarFolderH3";
                                        os.Elements.DebugBarSettingsHeaderLabel.innerHTML = "JaHOVA Settings";
                                        os.Elements.DebugBarSettingsHeader.appendChild(os.Elements.DebugBarSettingsHeaderLabel);
                                        
                                        //Debug Bar Header Pin
                                        os.Elements.DebugBarSettingsHeaderPin = document.createElement("div");
                                        os.Elements.DebugBarSettingsHeaderPin.id = "com.jahova.debugBar.Settings.Header.Pin";
                                        os.Elements.DebugBarSettingsHeaderPin.className = "ideSidebarPin";
                                        os.Elements.DebugBarSettingsHeaderPin.onclick = this.AnchorPage;
                                        os.Elements.DebugBarSettingsHeader.appendChild(os.Elements.DebugBarSettingsHeaderPin);
                                        
                                        
                                        //Debug Bar Icon
                                        os.Elements.DebugBarSettingsIconHeader = document.createElement("div");
                                        os.Elements.DebugBarSettingsIconHeader.id = "com.jahova.debugBar.Settings.Icons";
                                        os.Elements.DebugBarSettingsIconHeader.className = "ideSidebarFolderIconHeader iconColor";
                                        os.Elements.DebugBarSettings.appendChild(os.Elements.DebugBarSettingsIconHeader);
                                        
                                        //Debug Bar Content Area
                                        os.Elements.DebugBarSettingsContent = document.createElement("div");
                                        os.Elements.DebugBarSettingsContent.id = "com.jahova.debugBar.Settings.Content";
                                        os.Elements.DebugBarSettingsContent.className = "ideSidebarFolderContent jahova_borRadB2 viewContentBkgColor";
                                        os.Elements.DebugBarSettings.appendChild(os.Elements.DebugBarSettingsContent);

                                    },
                                    
                                    //******************************************
                                    //
                                    //  SIDEBAR PIN FUNCTIONS
                                    //
                                    //******************************************
                                    AnchorPage: function(e){
                                        var identifier = "com.jahova.debugBar."
                                        var name = e.target.id;
                                        name = name.substring(identifier.length);
                                        name = name.substring(0, name.indexOf('.'));
                                        
                                        if(name.toUpperCase() == "CONSOLE"){
                                            os.debugbar.AnchorConsolePage(e);   
                                        }
                                        else if(name.toUpperCase() == "LOG"){
                                            os.debugbar.AnchorLogsPage(e);
                                        }
                                        else if(name.toUpperCase() == "SETTINGS"){
                                            os.debugbar.AnchorSettingsPage(e);
                                        }
                                        
                                    },
                                    AnchorConsolePage: function(e){
                                        
                                            if(e.target.classList[0] == "ideSidebarPinned"){
                                                os.Elements.DebugBarConsole.className = "ideSidebarPageFolderView sidebarTabColor jahova_borRadL2 jahova_borRadB2 jahova_transWp5s";
                                                os.Elements.DebugBarConsole.style.width = "";
                                                os.Elements.DebugBarConsoleHeaderPin.className = "ideSidebarPin";
                                                os.Elements.DebugBarConsoleHeaderLabel.className = "ideSidebarFolderH3";
                                                os.Elements.DebugBarConsoleContent.className = "ideSidebarFolderContent jahova_borRadB2 viewContentBkgColor";
                                                os.Elements.DebugBarConsoleHeaderLabel.innerHTML = "Terminal Window";
                                                this.ConsolePagePinned = false;
                                            }
                                            else{
                                                os.Elements.DebugBarConsole.className = "ideSidebarPageFolderViewPinned sidebarTabColor jahova_borRadL2 jahova_borRadB2";
                                                os.Elements.DebugBarConsole.style.width = "560px";
                                                os.Elements.DebugBarConsoleHeaderPin.className = "ideSidebarPinned";
                                                os.Elements.DebugBarConsoleHeaderLabel.className = "ideSidebarFolderH3Pinned";
                                                os.Elements.DebugBarConsoleContent.className = "ideSidebarFolderContentPinned jahova_borRadB2 viewContentBkgColor";
                                                os.Elements.DebugBarConsoleHeaderLabel.innerHTML = "Terminal Window";
                                                this.ConsolePagePinned = true;
                                            }
                                    },
                                    AnchorLogsPage: function(e){
                                        
                                            if(e.target.classList[0] == "ideSidebarPinned"){
                                                os.Elements.DebugBarLog.className = "ideSidebarPageFolderView sidebarTabColor jahova_borRadL2 jahova_borRadB2 jahova_transWp5s";
                                                os.Elements.DebugBarLogHeaderPin.className = "ideSidebarPin";
                                                os.Elements.DebugBarLogHeaderLabel.className = "ideSidebarFolderH3";
                                                os.Elements.DebugBarLogContent.className = "ideSidebarFolderContent jahova_borRadB2 viewContentBkgColor";
                                                os.Elements.DebugBarLogHeaderLabel.innerHTML = "JaHOVA Logs";
                                                this.LogsPagePinned = false;
                                            }
                                            else{
                                                os.Elements.DebugBarLog.className = "ideSidebarPageFolderViewPinned sidebarTabColor jahova_borRadL2 jahova_borRadB2";
                                                os.Elements.DebugBarLogHeaderPin.className = "ideSidebarPinned";
                                                os.Elements.DebugBarLogHeaderLabel.className = "ideSidebarFolderH3Pinned";
                                                os.Elements.DebugBarLogContent.className = "ideSidebarFolderContentPinned jahova_borRadB2 viewContentBkgColor";
                                                os.Elements.DebugBarLogHeaderLabel.innerHTML = "JaHOVA Logs";
                                                this.LogsPagePinned = true;
                                            }
                                    },
                                    AnchorSettingsPage: function(e){
                                        
                                            if(e.target.classList[0] == "ideSidebarPinned"){
                                                os.Elements.DebugBarSettings.className = "ideSidebarPageFolderView sidebarTabColor jahova_borRadL2 jahova_borRadB2 jahova_transWp5s";
                                                os.Elements.DebugBarSettingsHeaderPin.className = "ideSidebarPin";
                                                os.Elements.DebugBarSettingsHeaderLabel.className = "ideSidebarFolderH3";
                                                os.Elements.DebugBarSettingsContent.className = "ideSidebarFolderContent jahova_borRadB2 viewContentBkgColor";
                                                os.Elements.DebugBarSettingsHeaderLabel.innerHTML = "JaHOVA Settings";
                                                this.SettingsPagePinned = false;
                                            }
                                            else{
                                                os.Elements.DebugBarSettings.className = "ideSidebarPageFolderViewPinned sidebarTabColor jahova_borRadL2 jahova_borRadB2";
                                                os.Elements.DebugBarSettingsHeaderPin.className = "ideSidebarPinned";
                                                os.Elements.DebugBarSettingsHeaderLabel.className = "ideSidebarFolderH3Pinned";
                                                os.Elements.DebugBarSettingsContent.className = "ideSidebarFolderContentPinned jahova_borRadB2 viewContentBkgColor";
                                                os.Elements.DebugBarSettingsHeaderLabel.innerHTML = "JaHOVA Settings";
                                                this.SettingsPagePinned = true;
                                            }
                                    },
                                    
                                    EvaluateShortCuts:function(e){
                                        var keyCode = e.keyCode ? e.keyCode : e.charCode;
                                        
                                        //Ctrl Key
                                        // Short Cuts
                                        if(e.ctrlKey){
                                            //~ ` key - Hide/Show Debug Bar
                                            if (keyCode == 192)
                                            {
                                                if(os.debugbar.GetStatus()){
                                                    //Disable Debug Bar
                                                    os.debugbar.Disable();
                                                }
                                                else{
                                                    //Enable Debug Bar
                                                    os.debugbar.Enable();
                                                }
                                            }
                                        }
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
