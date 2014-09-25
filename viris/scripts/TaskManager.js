TaskManager = function()
{
    // Task States
    const TASK =
    {
        MOVE  : 0 ,
        BUILD : 1 ,
        WAIT  : 2 ,
        COMM  : 3
    } ;
    
    // Manager States
    const STATE =
    {
        IDLE        : 0 ,
        NEW_TASK    : 1 ,
        IN_PROGRESS : 2 ,
        COMPLETE    : 3  
    } ;
    
    // Task Manager variables
    var taskArray = new Array() ; // holds all the queued tasks
    var state     = STATE.IDLE  ; // holds the current state of the task manager
    var active    = null        ; // the active task
    var wait      = 0           ; // active wait time
    
    // Queue a robot move task
    this.queueMove = function( px , pz , time , scan )
    {
        var task =
        {
            type : TASK.MOVE ,
            x    : px        ,
            z    : pz        ,
            time : time      ,
            scan : scan
        } ;
        
        taskArray.push( task ) ;
    } ;
    
    // Queue a build task
    this.queueBuild = function( px , pz )
    {
        var task =
        {
            type : TASK.BUILD ,
            x    : px         ,
            z    : pz
        } ;
        
        taskArray.push( task ) ;
    } ;
    
    // Queue a "wait" task - time is in milliseconds
    this.queueWait = function( time )
    {
        var task =
        {
            type : TASK.WAIT ,
            time : time
        } ;
        
        taskArray.push( task ) ;
    } ;
    
    // Queue a communication task
    this.queueCommunication = function( comSatID , stationID )
    {
        var task =
        {
            type   : TASK.COMM ,
            comID  : comSatID  ,
            statID : stationID 
        } ;
        
        taskArray.push( task ) ;
    } ;
    
    // Executes the given task
    function executeTask( task )
    {
        switch( task.type )
        {
        case TASK.MOVE:
            GlobalRobot.moveTo( task.x , task.z , task.time , task.scan ) ;
            break ;
        
        case TASK.BUILD:
            GlobalRobot.build( task.x , 0 , task.z ) ;
            GlobalMineFacilities.push( GlobalEntityManager.createMinFac( task.x , 0 , task.z , 0.002 ) );
            break ;
        
        case TASK.WAIT:
            wait = task.time ;
            break ;
        
        case TASK.COMM:
            GlobalComSat.communicate ( GlobalEntityManager.getEntityByID( task.statID ) , GlobalRobot ) ;
            break ;
        }
    }
    
    // Determines if the given task is complete
    function isTaskComplete( task , delta )
    {
        var complete = false ;
        
        switch( task.type )
        {
        case TASK.MOVE:
            complete = GlobalRobot.IsMoving == false ;
            break ;
        
        case TASK.BUILD:
            complete = GlobalRobot.IsBuilding == false ;
            break ;
        
        case TASK.WAIT:
            wait -= delta ;
            complete = ( wait <= 0.0 ) ;
            break ;
        
        case TASK.COMM:
            complete = GlobalComSat.IsCommunicating == false ;
            break ;
        }
        
        return complete ;
    }
    
    // Task Manager update function - state decision maker
    this.update = function( delta )
    {
        switch( state )
        {
        case STATE.IDLE:
            state = taskArray.length > 0 ? state = STATE.NEW_TASK : STATE.IDLE ;
            break;
        
        case STATE.NEW_TASK:
            active = taskArray.shift() ;
            executeTask( active ) ;
            state = STATE.IN_PROGRESS ;
            break;
        
        case STATE.IN_PROGRESS:
            state = isTaskComplete( active , delta ) ? state = STATE.IDLE : STATE.IN_PROGRESS ;
            break;
        }
    } ;
} ;

var GlobalTaskManager ;

function initTaskManager()
{
    GlobalTaskManager = new TaskManager();
}

function updateTaskManager( delta )
{
    GlobalTaskManager.update( delta );
}