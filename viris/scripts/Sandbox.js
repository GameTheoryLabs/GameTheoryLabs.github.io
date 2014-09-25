Sandbox = function()
{
this.update = function( delta )
{
} ;
} ;

var GlobalSandbox ;

function initSandbox()
{
GlobalSandbox = new Sandbox() ;
}

function updateSandbox( delta )
{
GlobalSandbox.update( delta ) ;
}