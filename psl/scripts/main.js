window.onload = function(){
    psl = com.playstylelabs.Instance();
    
    //Load animaation json.. url, callback, scope
    psl.Animation.LoadJSON("images/spritesheets/animations.json", psl.Demo);


    
    
    
    
}

//http://phrogz.net/tmp/image_move_sprites_css.html
function rotateDog(deg){
                dog.rotation[0] += deg * Math.PI/ 180;
               }
               function scaleDog(val){
                dog.graphics.Scale([val,val,val]);
               }