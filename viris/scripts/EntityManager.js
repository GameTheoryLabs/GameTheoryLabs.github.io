EntityManager = function()
{
    var nextEntityID = 0 ;
    var entityArray = new Array() ;
    
    function storeEntity( entity )
    {
        entityArray.push( entity ) ;
        
        entity.ENTITY_ID = nextEntityID ;
        
        nextEntityID++ ;
    }
    
    this.createRobot = function( px , py , pz , animSpeed )
    {
        var robot = new EntityRobot( px , py , pz , animSpeed ) ;
        
        storeEntity( robot ) ;
        
        return robot ;
    } ;
    
    this.createCharger = function( px , py , pz )
    {
        var charger = new EntityCharger( px , py , pz ) ;
        
        storeEntity( charger ) ;
        
        return charger ;
    } ;
    
    this.createPlatform = function( px , py , pz , animSpeed )
    {
        var platform = new EntityPlatform( px , py , pz , animSpeed ) ;
        
        storeEntity( platform ) ;
        
        return platform ;
    } ;
    
    this.createStation = function( px , py , pz , animSpeed )
    {
        var station = new EntityStation( px , py , pz , animSpeed ) ;
         
        storeEntity( station ) ;
        
        return station ;
    } ;
    
    this.createComSat = function( px , py , pz , animSpeed )
    {
        var comSat = new EntityComSat( px , py , pz , animSpeed ) ;
        
        storeEntity( comSat ) ;
        
        return comSat ;
    } ;
    
    this.createMinFac = function( px , py , pz , animSpeed )
    {
        var minFac = new EntityMineFac(  px , py , pz , animSpeed ) ;
        
        storeEntity( minFac ) ;
        
        return minFac ;
    } ;
    
    this.removeEntityByID = function( id )
    {
        var length = entityArray.length ;
        for( var i = 0 ; i < length ; i++ )
        {
            if( entityArray[ i ].ENTITY_ID == id )
            {
                entityArray[ i ].destroy() ;
                entityArray.splice( i , 1 ) ;
                return ;
            }
        }
    } ;
    
    this.getEntityByID = function( id )
    {
        var length = entityArray.length ;
        for( var i = 0 ; i < length ; i++ )
        {
            if( entityArray[ i ].ENTITY_ID == id )
            {
                return entityArray[ i ] ;
            }
        }
    } ;
    
    this.update = function( delta )
    {
        var length = entityArray.length ;
        for( var i = 0 ; i < length ; i++ )
        {
            entityArray[ i ].update( delta ) ;
        }
    } ;
} ;

var GlobalEntityManager ;

function initEntityManager()
{
    GlobalEntityManager = new EntityManager() ;
}

function updateEntityManager( delta )
{
    GlobalEntityManager.update( delta ) ;
}