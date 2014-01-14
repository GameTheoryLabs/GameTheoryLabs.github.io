//JaHOVA Internal Cores
//      Dependent upon JaHOVA OS

/****h* JaHOVA/Cores
*  LINKS
* |html <p><a href="http://jahovaos.com/JaHOVA/Documentation/Full/toc_index.html">   Table of Contents </a></p>
*
*  NAME
*    JaHOVA Cores
*    
*  AUTHOR
*   Corey Clark
*   cclark@coreyclarkphd.com
*
*  HISTORY
*   Created: 4/14/2011
*   
*
*  DESCRIPTION
*     This module holds pointers to all user defined
*      and external Cores added to the OS
*
*  USAGE
*/
com.jahova.core = (function()
                {
                    var pInstance;
                    
                    function constructor()
                    {
                        //PRIVATE ATTRIBUTES
                        var NAME = "JaHOVA Cores";
                        var VERSION = "0v3";
                        var PATH = "scripts/jahova/Cores/jahova.cores.js";
                        
                        //PRIVATE METHODS
                        
                        return{
                            //PUBLIC ATTRIBUTES
                            
                            //PUBLIC PRIVILEDGE METHODS
                            GetName: function()
                            {
                                return NAME;
                            },
                            
                            GetVersion: function()
                            {
                                return VERSION;
                            },
                            
                            GetPath: function()
                            {
                                return PATH;
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
/*
*  NOTES
*     N/A
*
*  IDEAS
*     N/A
*
*  TODO
*
*  
*******/