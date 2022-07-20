//Variables :
var mario,marioImg,mario2,mario2Img,mariodeadImg,marioLImg,coin,coinImg, ground,goombaGroup,coinGroup,rand;
var goomba1,goomba1Img,goomba2Img,goomba3Img,mariodead,kingdom,kingdomImg,start,startImg,stars,starsGroup,star2Img;
var PLAY=1; 
var END=0;
var gameState="START";
var score=0;
var jumpSound , checkPointSound, dieSound;
localStorage ["HighScore"]=0;

//To load the images:
function preload(){
  marioImg=loadImage("sprites/mario.gif");
  marioLImg=loadImage("sprites/marioL.gif");
  startImg=loadImage("sprites/start.png");
  goomba1Img = loadImage("sprites/goomba1.gif");
  goomba2Img=loadImage("sprites/goomba2.png");
  goomba3Img=loadImage("sprites/goomba3.png");
  goomba4Img=loadImage("sprites/goomba4.png");
  goomba5Img=loadImage("sprites/goomba5.png");
  goomba6Img=loadImage("sprites/goomba6.png");
  coinImg=loadImage("sprites/coin.png");
  coin2Img=loadImage("sprites/coin2.png");
  coin3Img=loadImage("sprites/coin3.png");
  coin4Img=loadImage("sprites/coin4.png");
  mariodeadImg=loadImage("sprites/mariodead.jpg");
  bgImg=loadImage("sprites/bg2.jpg");
  jump = loadSound("sprites/jumpS.wav");
  theme = loadSound("sprites/theme.mp3");
  coinSound = loadSound("sprites/coin.wav");
  gameOverSound=loadSound("sprites/gameover.wav");
  checkPointSound=loadSound("sprites/checkpoint.ogg");
  star1Img=loadImage("sprites/star1.png");
  star2Img=loadImage("sprites/star2.png");

}

//To create the sprites(charecters)
function setup() {
  createCanvas(1500,700);

  theme.play();
  
  kingdom=createSprite(750,350,1500,700);
  kingdom.addImage(bgImg);
  kingdom.scale=0.5;
  
  start = createSprite(750,350,50,50);
  start.addImage(startImg);
  start.visible=true;
  start.scale=0.5;

  mario=createSprite(90, 680, 50, 50);
  mario.addImage(marioImg);
  //mario.debug=true; -> to find radious
  mario.setCollider("circle",0,0,80);
  mario.scale=1.2;

  ground=createSprite(750,680,1800,20);
  ground.visible=false;

  mariodead = createSprite(750,350,1500,700);
  mariodead.addImage(mariodeadImg);
  mariodead.visible=false;

  goombaGroup=createGroup();
  coinGroup=createGroup();
  starsGroup=createGroup();

}

//Functions 
function draw() {
  background(0);
  //console.log(gameState);

  if(gameState==="START"){
    theme.stop();
    start.visible=true;
    //console.log(start.x)
    mario.visible=false;
      
    if(mousePressedOver(start)){
        gameState="PLAY";
        theme.play();
      }
  } 

  //Game : play state
  if(gameState==="PLAY"){

    start.destroy();
    mario.visible=true;

    kingdom.velocityX=-5;
   
    //Movement 
    if(kingdom.x<0){
      kingdom.x=width/2;
    }

    //Mario to jump
    if(keyDown("UP_ARROW")&& mario.y >= 100 ){
      mario.velocityY=-9;
      //jump.play();
    }

    if(keyDown("LEFT_ARROW")&& mario.x >= 115 ){
      mario.addImage(marioLImg);
      mario.x=mario.x-9;
    }

    if(keyDown("RIGHT_ARROW")&& mario.x <= 1400 ){
      mario.addImage(marioImg);
      mario.x=mario.x+9;
    }

    //Generations of coins and enemies
    spawnCoin();
    spawnGoomba();

    //After the score of 100 - level 2 
    goombaGroup.velocityX = -(20 + 4* score/100);
    //starsGroup.velocityX = -(20 + 4* score/130);

    //Score:   
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }

    if(mario.isTouching(coinGroup)){
        coinGroup.destroyEach();
        score = score + Math.round(getFrameRate()/3);  
        coinSound.play();  
    }

     //After the score of 150-Level 3
     if(score>50 && score%100 === 0){
      spawnStar();
      //spawnObject();
    }

    if(mario.isTouching(starsGroup)){
      starsGroup.destroyEach();
      score = score + Math.round(getFrameRate()); 
      coinSound.play();  
    }

    //Gamestate-END
    if(mario.isTouching(goombaGroup)){
        gameState="END";
        gameOverSound.play(); 
        theme.stop();       
    }  
  }

  //Gravity of mario
  mario.velocityY=mario.velocityY+1;

  //Mario to stand on the ground
  mario.collide(ground);

  //To display the charecters
  drawSprites();

  //Texts
  textSize(35);
  fill(255,255,255); 
  text("Score: " +score, 1200,100);
  text("High Score: "+localStorage["HighScore"],1200,150);

  //Gamestate-End
  if(gameState==="END"){
    mario.velocityY=0;    
    coinGroup.destroyEach();
    goombaGroup.destroyEach();
    coinGroup.setVelocityXEach(0);
    goombaGroup.setVelocityXEach(0);
    starsGroup.setVelocityXEach(0);

    //Storage
    goombaGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    starsGroup.setLifetimeEach(-1);

    mariodead.visible=true;
    mario.visible=false;
    kingdom.velocityX=0;     

    textSize(38);
    fill(255,255,255)
   
    text("Press 'r' to restart the game", 550,180);

    // to restart the game
    if(keyCode===114){
      reset();
    }
  }
}

function spawnCoin(){
    //to remove continues objects
    if(World.frameCount % 130 === 0){
    coin=createSprite(1500,500,10,10);
    coin.y=Math.round(random(150,660));    
    coin.scale=0.25;
    coin.velocityX=-20;

    //console.log(coin.x);
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: coin.addImage(coinImg);
             break;
      case 2: coin.addImage(coin2Img);
            break;
      case 3: coin.addImage(coin3Img);
        break;
      case 4:  coin.addImage(coin4Img);
            break;     
      default: break;
    }
  
    //depth
    coin.depth=mario.depth;
    mario.depth=mario.depth+1;
  
    //lifetime
    //speed=distance/time --> t= d/s = 1500/5 =300
    coin.lifetime=300;
    coinGroup.add(coin);     
    }  
  }

  function spawnGoomba(){
    if(World.frameCount % 80 === 0){
    goomba=createSprite(1500,650,10,10);
    goomba.y=Math.round(random(190,620));
    goomba.velocityX=-12;
    goomba.scale=0.5;
    //goomba.debug=true;
    goomba.setCollider("circle",0,0,120);
    //console.log(goomba.x);  
    var rand = Math.round(random(1,4));
    switch(rand) {      
      case 1: goomba.addImage(goomba3Img);
        break;
      case 2:  goomba.addImage(goomba4Img);
            break;
      case 3:  goomba.addImage(goomba5Img);
            break;
      case 4:  goomba.addImage(goomba6Img);
            break;
      default: break;
    } 
  
    //depth
    goomba.depth=mario.depth;
    mario.depth=mario.depth+1;  
    goombaGroup.add(goomba);  
    goomba.lifetime=300;
    }  
  }

  function spawnStar(){
    //to remove continues objects
    if(World.frameCount % 90 === 0){
    star=createSprite(1500,500,10,10);
    star.y=Math.round(random(100,450));    
    star.scale=0.25;
    star.velocityX=-20;

    //console.log(star.x);
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: star.addImage(star1Img);
             break;
      case 2: star.addImage(star2Img);
            break;
      default: break;
    }
  
    //depth
    star.depth=mario.depth;
    mario.depth=mario.depth+1;
  
    //lifetime
    //speed=distance/time --> t= d/s = 1500/5 =300
    star.lifetime=75;
    starsGroup.add(star);     
    }  
  }
  
  function reset(){
    gameState="START";
    start = createSprite(750,350,50,50);
    start.addImage(startImg);
    start.visible=true;
    start.scale=0.5;
    start.visible=true;
  
    if(localStorage ["HighScore"]<score){
      localStorage["HighScore"]=score;
    }
      score=0;
      starsGroup.destroyEach();
      coinGroup.destroyEach();
      goombaGroup.destroyEach();
      mariodead.visible=false;
      mario.visible=true;   
  }
  