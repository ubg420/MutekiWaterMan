/*
 * constant
 */
var SCREEN_WIDTH   = 800;
var SCREEN_HEIGHT   = 450;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;


var player;
var water;
var speed;

var BackGroup;
var BulletGroup;
var EffectGroup;
var EnemyGroup;
var ItemGroup;

var worldvx;
var worldspeedX;

var score;


var UI_DATA = {
    main: { // MainScene用ラベル
        children: [{
            type: "Label",
            name: "score",
            fontSize: 32,
            fillStyle: "White",
            shadowBlur: 4,
            x: 650,
            y: 30,
        },
        {
            type: "Label",
            name: "HP",
            fontSize: 64,
            fillStyle: "White",
            shadowColor: "blue",
            shadowBlur: 4,
            x: 400,
            y: 30,
        }],

    }
};

var RESULT = {
    main: { // MainScene用ラベル
        children: [{
            type: "Label",
            name: "Resultscore",
            fontSize: 32,
            fillStyle: "White",
            shadowBlur: 4,
            x: SCREEN_WIDTH /2,
            y: SCREEN_HEIGHT /2 - 100,
        },
        {
            type: "Label",
            name: "comment",
            fontSize: 16,
            fillStyle: "White",
            shadowBlur: 4,
            x: SCREEN_WIDTH /2,
            y: (SCREEN_HEIGHT /2 - 100) + 75,
        }],
    }
};


var ASSETS = {
    "title":  "./image/Back_old.png",
    "logo":  "./image/logo.png",
    "start":  "./image/start.png",
    "player":  "./image/player.png",
    "playerSS":  "./PlayerSS.tmss",
    "Enemy":  "./image/Enemy.png",
    "REnemy":  "./image/REnemy.png",
    "EnemySS":  "./EnemySS.tmss",
    "REnemySS":  "./REnemySS.tmss",
    "Bullet":  "./image/bullet.png",
    "Back":  "./image/Back.png",
    "Kin":  "./image/kin.png",
    "Macho":  "./image/Macho.png",
    "MachoSS":  "./MachoSS.tmss",
    "Bomb":  "./image/Bomb.png",
    "RBomb":  "./image/RBomb.png",
    "ABomb":  "./image/ABomb.png",
    "Doon":  "./image/DOON2.png",
    "Kemuri":  "./image/kemuri.png",
    "Heri":  "./image/heri.png",
    "HeriSS":  "./HeriSS.tmss",
    "RMacho":  "./image/RMacho.png",
    "RMachoSS":  "./RMachoSS.tmss",
    "WaterMater":  "./image/water.png",
    "WaterItem":  "./image/waterItem.png",
    "WaterItem50":  "./image/waterItem50.png",
};





tm.preload(function() {
    //tm.sound.WebAudioManager.add("sound", "http://jsrun.it/static/assets/svggirl/01/svg_girl_theme.mp3");
});



tm.main(function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();

    var loading = tm.app.LoadingScene({
        assets: ASSETS,
        nextScene: TitleScene,
    });
    
    app.replaceScene(loading);

    app.run();
});

tm.define("TitleScene", {
    superClass : "tm.app.Scene",
 
    init : function() {
        this.superInit({
            title :  "タイトル",
            width :  SCREEN_WIDTH,
            height : SCREEN_HEIGHT
        });

        this.title = tm.app.Sprite("title", SCREEN_WIDTH, SCREEN_HEIGHT).addChildTo(this);
        this.title.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);

        this.Tplayer = tm.app.AnimationSprite("playerSS",150,150).addChildTo(this);
        this.Tplayer.position.set(120,315);
        this.Tplayer.gotoAndPlay("walk");

        this.TMacho = tm.app.AnimationSprite("MachoSS",280,280).addChildTo(this);
        this.TMacho.position.set(670,250);
        this.TMacho.gotoAndPlay("tati");

        this.TEnemy = tm.app.AnimationSprite("EnemySS",180,180).addChildTo(this);
        this.TEnemy.position.set(630,315);
        this.TEnemy.gotoAndPlay("tati");


        this.logo = tm.app.Sprite("logo", 700, 243).addChildTo(this);
        this.logo.position.set(SCREEN_WIDTH/2, -130);
        this.logo.tweener
            .clear()
            .to({scaleX:0,scaleY:0}, 1)
            .wait(2300)
            .to({y:this.y + 130,scaleX:1,scaleY:1}, 1300,"easeInOutQuad")


        this.startflg = false;


        // 画面(シーンの描画箇所)をタッチした時の動作
        this.addEventListener("pointingend", function(e) {
            // シーンの遷移
            if(this.startflg){
                e.app.replaceScene(MainScene());
            }

        });

        this.fireflg = false;
        this.counterflg = false;
        this.timer = 0;

        this.AnimationStart =10;

    },

    //タイトルシーン用アニメーション

    update : function(app){

        this.timer++;

        if(this.timer == this.AnimationStart){
            this.TEnemy.gotoAndPlay("kamae");
            this.TMacho.gotoAndPlay("kamae");

        }
        if(this.timer == this.AnimationStart + 15){
            this.TMacho.gotoAndPlay("shot");

            this.bom = tm.app.Sprite("Bomb", 150, 150).addChildTo(this);
            this.bom.position.set(this.TMacho.x -30,this.TMacho.y -100);
            this.bom.ry = 0.8;
            this.bom.vy = -2;
            this.bom.vx = 28;

            this.fireflg = true;

        }
        if(this.timer == this.AnimationStart + this.AnimationStart + 110){
            this.TEnemy.gotoAndPlay("shot");
            this.TMacho.gotoAndPlay("shot");
        }

        if(this.fireflg){
            this.bom.x -= this.bom.vx;
            this.bom.y += this.bom.vy;
            this.bom.vy += this.bom.ry;

            //跳ね返す
            if(this.bom.x < 160){
                this.counterflg = true;
                this.bom.vy = -2;
                this.bom.vx *= -1;
                this.Tplayer.gotoAndPlay("Nomu");

                this.TEnemy.gotoAndPlay("shot");
                this.Tbullet = tm.app.Sprite("Bullet", 50, 50).addChildTo(this);
                this.Tbullet.position.set(this.TEnemy.x -70,this.TEnemy.y -20);
                this.Tbullet.tweener
                    .clear()
                    .to({x:this.Tbullet.x - 400}, 350)
                    .to({rotation:120},2)
                    .to({x:this.Tbullet.x + 600,y:this.Tbullet.y - 800}, 850)

                this.Tkin = tm.app.Sprite("Kin", 65, 65).addChildTo(this);
                this.Tkin.position.set(150,250);
                this.Tkin.tweener
                    .clear()
                    .to({x: this.Tkin.x +10, y: this.Tkin.y - 10,scaleX:0}, 75)
                    .to({x: this.Tkin.x +20, y: this.Tkin.y - 20,scaleX:1}, 75)
                    .wait(1000)
                    .to({alpha:0}, 500)

                this.Tkin2 = tm.app.Sprite("Kin", 60, 60).addChildTo(this);
                this.Tkin2.position.set(170,280);
                this.Tkin2.tweener
                    .clear()
                    .to({scaleX:0,scaleY:0},1)
                    .wait(350)
                    .to({scaleX:1,scaleY:1},1)
                    .to({x: this.Tkin2.x +10, y: this.Tkin2.y - 10,scaleX:0}, 75)
                    .to({x: this.Tkin2.x +20, y: this.Tkin2.y - 20,scaleX:1}, 75)
                    .wait(1000)
                    .to({alpha:0}, 500)     
            }
            //爆発
            if(this.bom.y > 350){

                this.doon = tm.app.Sprite("Doon", 250, 250).addChildTo(this);
                this.doon.position.set(this.bom.x -50 ,this.bom.y - 67);
                this.doon.tweener
                .clear()
                .to({y:this.doon.y - this.doon.height + 100,scaleY:2}, 350,"easeOutQuart")
                .to({x:this.doon.x - 40,y:this.doon.y,scaleY:1,scaleX:1.5,alpha:0}, 300,"easeInOutCubic")
               
                this.bom.vy = 0;
                this.bom.ry = 0;
                this.bom.vx = 0;
                this.bom.y = -1000;

                this.TEnemy.tweener
                    .clear()
                    .to({x: this.TEnemy.x +300, y: this.TEnemy.y - 200,rotation:360}, 500)


                this.TMacho.tweener
                    .clear()
                    .to({x: this.TMacho.x +300, y: this.TMacho.y - 200,rotation:360}, 500)

            }

        }

        if(this.counterflg){

        }

        if(this.timer == 115){
            this.Tstart = tm.app.Sprite("start", 500, 100).addChildTo(this);
            this.Tstart.position.set(SCREEN_WIDTH/2, 410);
            this.Tstart.tweener
                .clear()
                .to({scaleY:0.5}, 700)
                .to({scaleY:1}, 700)
                .wait(500)
                .setLoop(true)

            this.startflg = true;

        }


    }

});


tm.define("EndScene", {
    superClass : "tm.app.Scene",
 
    init : function() {
        this.superInit();
        
        this.Meigenmeke();

        this.fromJSON(RESULT.main);
        this.Name = tm.app.Label("サイト").addChildTo(this);
        this.Name
            .setPosition(100, 740)
            .setFillStyle("white")
            .setFontSize(25);

            var cachacom =  tm.ui.GlossyButton(200, 60, "#32cd32", "かちゃコム").addChildTo(this);
            cachacom.setPosition(650, 400);
            cachacom.onclick = function() {
                window.open("http://cachacacha.com");
            };

            
            var tweet =  tm.ui.GlossyButton(200, 60, "blue", "tweet",20,"ヒラギノ角ゴ Pro W3'").addChildTo(this);
            tweet.setPosition(290, 250);
            url = "cachacacha.com/GAME/MutekiWaterMan/";
            txt = encodeURIComponent("SCORE: " + score + " "+ this.ResultTxt +" "+ url + " #水を飲んでる間は無敵の人");


            tweet.onclick = function() {
                window.open("http://twitter.com/intent/tweet?text=" + txt);
            };
            


    },

    update: function(app) {
        this.Resultscore.text = "SCORE\n"+score;
        this.comment.text = this.ResultTxt;

         var resume =  tm.ui.GlossyButton(200, 60, "", "もう一回").addChildTo(this);
            resume.setPosition(510, 250);
            resume.onclick = function() {
              app.replaceScene(MainScene());
            };
        

    },

    onnextscene: function (e) {
        e.app.replaceScene(MainScene());
    },


    Meigenmeke:function (e){


        this.ResultTxt = "水を飲むのだ";

        if(score > 500){
            this.ResultTxt = "無敵のめざめ";
        }

        if(score > 1000){
            this.ResultTxt = "はじまりの無敵";

        }

        if(score > 1500){
            this.ResultTxt ="下積みの無敵";

        }

        if(score > 2000){
            this.ResultTxt ="新人の無敵";
        }

        if(score > 2500){
            this.ResultTxt = "いっちょまえに無敵";
        }

        if(score > 3000){
            this.ResultTxt = "村一番の無敵";
        }

        if(score > 3500){
            this.ResultTxt = "人呼んで無敵";
        }

        if(score > 4000){
                this.ResultTxt = "素敵な無敵";
        }

        if(score > 4500){
                this.ResultTxt = "無敵の星";
        }

        if(score > 5000){
                this.ResultTxt = "無敵さま";
        }

        if(score > 5500){
                this.ResultTxt = "ガチ無敵勢";
        }

        if(score > 6000){
                this.ResultTxt = "無敵界一の無敵";
        }

        if(score > 7500){
                this.ResultTxt = "人類最後の無敵";
        }

        if(score > 8000){
                this.ResultTxt = "限界突破の無敵";
        }

        if(score > 8500){
                this.ResultTxt = "無敵地球代表";
        }

        if(score > 9000){
                this.ResultTxt = "宇宙最大の無敵";
        }

        if(score > 9500){
                this.ResultTxt = "無敵の向こう側";
        }

        if(score > 10000){
                this.ResultTxt = "無敵神";
        }

        if(score > 11000){
                this.ResultTxt = "無敵の極み";
        }


    }

});

tm.define("MainScene", {
    superClass: "tm.app.Scene",

    init: function() {
        // 親の初期化
        this.superInit();

        worldspeedX = 3;
        worldvx = worldspeedX;


        BackGroup = tm.app.CanvasElement().addChildTo(this); //
        
        player = Player().addChildTo(this);


        EnemyGroup = tm.app.CanvasElement().addChildTo(this); //
        ItemGroup = tm.app.CanvasElement().addChildTo(this); //
        BulletGroup = tm.app.CanvasElement().addChildTo(this); //

        EffectGroup = tm.app.CanvasElement().addChildTo(this); //

        this.mapA = Map("Back").addChildTo(BackGroup);
        this.mapA.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);

        this.mapB = Map("Back").addChildTo(BackGroup);
        this.mapB.position.set(SCREEN_WIDTH + (SCREEN_WIDTH /2), SCREEN_HEIGHT/2);

        this.SentouMapX = this.mapB.x; //先頭のマップの高さ

        
        score = 0;
        this.scoreUI = tm.app.Label("SCORE").addChildTo(this);
        this.scoreUI
            .setPosition(80, 30)
            .setFillStyle("black")
            .setFontSize(40)  
            .setShadowBlur(4)
            .setShadowColor("black");

        this.timer = 0;
        this.Level = 1;

        var waterM = WaterMater().addChildTo(this);
        water = Water().addChildTo(this);
        var enemy = Macho().addChildTo(EnemyGroup);

        this.watercnt = 0;
    },

    update: function(app) {
        // カウントアップを行う
        this.SentouMapX -= worldvx;

         this.MapCheck();
         this.ScoreUpdate();
         this.enemy_create();
         this.LevelCheck();
         this.WaterHaichi();

         this.timer++;
    },


    MapCheck:function(){

        if(this.SentouMapX   < 405){
            this.MapCreate();
        }


    },

    MapCreate: function(){


        var map = Map("Back").addChildTo(BackGroup);
        map.position.set(SCREEN_WIDTH + (SCREEN_WIDTH /2), SCREEN_HEIGHT/2);
        this.SentouMapX = map.x; //先頭のマップの高さ


    },

    ScoreUpdate:function(){

        score += Math.floor(worldvx);
        this.scoreUI.text = score + "cm";

    },


    enemy_create: function(){

        //
        if(this.timer % 200 == 0 && this.Level > 0){
          var enemy = Enemy().addChildTo(EnemyGroup);
        }

        if(this.timer % 300 == 0 && this.Level > 1){
          var enemy = Macho().addChildTo(EnemyGroup);
        }

        if(this.timer % 320 == 0 && this.Level > 2){
          var enemy = Heri().addChildTo(EnemyGroup);
        }

        if(this.timer % 453 == 0 && this.Level > 3){
          var enemy = REnemy().addChildTo(EnemyGroup);
        }

        if(this.timer % 380 == 0 && this.Level > 4){
          var enemy = RMacho().addChildTo(EnemyGroup);
        }

        if(this.timer % 1000 == 0 && this.Level > 5){
          var enemy = ABomb().addChildTo(EnemyGroup);
        }

        if(this.timer % 200 == 0 && this.Level > 6){
          var enemy = Enemy().addChildTo(EnemyGroup);
        }

        if(this.timer % 180 == 0 && this.Level > 7){
          var enemy = Macho().addChildTo(EnemyGroup);
        }

        if(this.timer % 300 == 0 && this.Level > 8){
          var enemy = Heri().addChildTo(EnemyGroup);
        }

        if(this.timer % 340 == 0 && this.Level > 9){
          var enemy = REnemy().addChildTo(EnemyGroup);
        }

        if(this.timer % 370 == 0 && this.Level > 10){
          var enemy = RMacho().addChildTo(EnemyGroup);
        }

        if(this.timer % 800 == 0 && this.Level > 11){
          var enemy = ABomb().addChildTo(EnemyGroup);
        }




    },

    LevelCheck:function(){

        if(score > 500 && this.Level < 2){
            this.Level = 2;
        }
        if(score > 2000 && this.Level < 3){
            this.Level = 3;
        }
        if(score > 3500 && this.Level < 4){
            this.Level = 4;
        }
        if(score > 4500 && this.Level < 5){
            this.Level = 5;
        }
        if(score > 5600 && this.Level < 6){
            this.Level = 6;
            this.interval = true;
        }
        if(score > 6500 && this.Level < 7){
            this.Level = 7;
            this.interval = false;
        }
        if(score > 7000 && this.Level < 8){
            this.Level = 8;
            this.interval = false;
        }

        if(score > 8000 && this.Level < 9){
            this.Level = 9;
            this.interval = false;
        }

        if(score > 9000 && this.Level < 10){
            this.Level = 10;
            this.interval = false;
        }

        if(score > 10000 && this.Level < 11){
            this.Level = 11;
            this.interval = false;
        }

        if(score > 11000 && this.Level < 12){
            this.Level = 12;
            this.interval = false;
        }



    },

    WaterHaichi:function(){
        if(score > 1600 && this.watercnt < 1){
            var wateritem = WaterItem().addChildTo(ItemGroup);
            this.watercnt++;
        }

        if(score > 3100 && this.watercnt < 2){
            var wateritem = WaterItem().addChildTo(ItemGroup);
            this.watercnt++;
        }

        if(score > 4000 && this.watercnt < 3){
            var wateritem = WaterItem().addChildTo(ItemGroup);
            this.watercnt++;
        }

        if(score > 4800 && this.watercnt < 4){
            var wateritem = WaterItem().addChildTo(ItemGroup);
            this.watercnt++;
        }

        if(score > 5700 && this.watercnt < 5){
            var wateritem = WaterItem().addChildTo(ItemGroup);
            this.watercnt++;
        }

        if(score > 6600 && this.watercnt < 6){
            var wateritem = WaterItem().addChildTo(ItemGroup);
            this.watercnt++;
        }

        if(score > 7600 && this.watercnt < 7){
            var wateritem = WaterItem().addChildTo(ItemGroup);
            this.watercnt++;
        }

        if(score > 8600 && this.watercnt < 8){
            var wateritem = WaterItem().addChildTo(ItemGroup);
            this.watercnt++;
        }

        if(score > 9600 && this.watercnt < 9){
            var wateritem = WaterItem().addChildTo(ItemGroup);
            this.watercnt++;
        }



    }



});


tm.define("Map", {
    superClass: "tm.app.Sprite",

    init: function (Back) {
        this.superInit(Back,SCREEN_WIDTH,SCREEN_HEIGHT);

        },

    update: function(){

        this.x -= worldvx;

    }

});


tm.define("Player", {
    superClass: "tm.app.AnimationSprite",
    init: function () {
        this.superInit("playerSS");
        this.gotoAndPlay("walk");

        this.width = 100;
        this.height = 100;

        this.yuka = 235;

        this.x = 100;
        this.y = this.yuka;

        this.origin.x = 0;
        this.origin.y = 0;

        this.v = tm.geom.Vector2(0, 0);
        this.vy = 0;

        this.jumpFlg = 2;  //プレイヤーの状態フラグ　0:走ってる 1:地上　2:空中

        this.power = 10;

        this.speed = worldvx;
        this.kasokudo = 0.05;

        //この座標を超えたら画面全体がスクロールする
        this.RemitY = 450;

        this.MaxSpeed = 4;

        this.Gameoverflg = 0;

        this.MutekiFlg = false;
        this.WaterKARAFlg = false; //水が空っぽ


        this.speed = 2;
        this.vx = this.speed;

    },

    update: function(app) {

        this.L = this.x + 25;
        this.R = this.x + this.width - 25;
        this.T = this.y + 25;
        this.B = this.y+ this.height;

        if(this.Gameoverflg == 0){      
            this.Move(app);

        }
        else{
            this.Gameover(app);
        }


        //水を飲んでる時
        if(this.MutekiFlg){
            this.MutekiDrink();
        }


        if(this.x < 0){
            app.replaceScene(EndScene());
        }


    },

    Move: function(app){


    if(!this.WaterKARAFlg){
       if (app.pointing.getPointingStart()) {
            this.gotoAndPlay("Nomu");
            this.vx = 0;  
            this.MutekiFlg = true;
        }
        if(app.pointing.getPointingEnd()){
            this.gotoAndPlay("walk");
            this.vx = this.speed;  
            this.MutekiFlg = false;
        }
    }

        worldvx = this.vx;


    },

    PositionCheck:function(){

        if(this.y > this.yuka){
            this.y = this.yuka;
            this.vy = 0;
        }

    },

    //水飲んでてムテキ中
    MutekiDrink:function(){
        if(!water.Drink()){
            this.WaterKARA();
        }
    },

    //
    WaterKARA:function(){
        this.WaterKARAFlg = true;
        this.gotoAndPlay("Kara");
        this.MutekiFlg = false;
        this.vx = this.speed;  
    },
    //
    WaterAdd:function(waterquantity){
        this.WaterKARAFlg = false;
        this.gotoAndPlay("walk");
        this.vx = this.speed;  
        water.Add(waterquantity);

    },

    clash:function(){

        if(this.MutekiFlg){
            return true;
        }
        else{
            this.Gameoverflg = 1;
        }

    },


    BomCounter :function(){

        if(this.MutekiFlg){
            return true;
        }
        else{
            return false;
        }

    },

    Gameover:function(app){
        this.x -= 8;
        this.y -= 8;
        this.rotation += 30;
    },

    
});

tm.define("Water", {
    superClass: "tm.app.CanvasElement",

    init: function(color) {
        this.superInit();
        
        this.color = "#1e90ff";
        this.width = 80;
        this.height = 140;

        this.x = 715;
        this.y = 138;

        this.WaterPower = 100;

        this.vx = 0;
        this.vy = 0;

        //this.v = tm.geom.Vector2(0, 0);
    },
    
    update: function(app) {


    },
    
    draw: function(c) {
    c.fillStyle = this.color;
    c.fillRect(0, 0, 50, -this.WaterPower, 8);
    },

    Drink : function() {
        if(this.WaterPower > 0){
            this.WaterPower -= 0.25;
            return true;
        }
        else{
            return false;
        }
    },

    Add : function(waterquantity){
        this.WaterPower += waterquantity;
        if(this.WaterPower > 100){
            this.WaterPower = 100;
        }
    }


});

tm.define("WaterMater", {
    superClass: "tm.app.Sprite",

init: function(x) {
        this.superInit("WaterMater");

        this.x = 740;
        this.y = 100;

        this.width = 80;
        this.height = 140;


    },

    update: function(app) {

    },



});

tm.define("WaterItem", {
    superClass: "tm.app.Sprite",

init: function(x) {
        this.superInit("WaterItem");


        this.width = 50;
        this.height = 50;

        this.x = SCREEN_WIDTH + this.width;
        this.y = 280;

        this.tweener
            .clear()
            .to({scaleX:-1}, 700)
            .to({scaleX:1}, 700)
            .setLoop(true)

        this.L = this.x;
        this.R = this.x + this.width;
        this.T = this.y;
        this.B = this.y + this.height; //足の当たり判定に加速度を足す。めり込み防止

        this.clashflg =0;
        this.timer = 0;
    },

    update: function(app) {

        this.L = this.x;
        this.R = this.x + this.width;
        this.T = this.y;
        this.B = this.y + this.height; //足の当たり判定に加速度を足す。めり込み防止

        this.x -= worldvx;
        if(clash(this,player) && this.clashflg == 0){
            this.tweener.clear()
                .setLoop(false)
                .to({y:this.y - 50,scaleX:1}, 150)
                .wait(500)
                .to({alpha:0}, 100)
            this.Destroyflg = true;
            player.WaterAdd(50);
            this.clashflg = 1;
        }

        if(this.Destroyflg){
            this.timer++;
            if(this.timer > 30){
                this.remove();
            }
        }
    }



});

tm.define("WaterItem50", {
    superClass: "tm.app.Sprite",

init: function(x) {
        this.superInit("WaterItem50");


        this.width = 50;
        this.height = 50;

        this.x = x;
        this.y = 280;

        this.tweener
            .clear()
            .to({scaleX:-1}, 700)
            .to({scaleX:1}, 700)
            .setLoop(true)

        this.L = this.x;
        this.R = this.x + this.width;
        this.T = this.y;
        this.B = this.y + this.height; //足の当たり判定に加速度を足す。めり込み防止

        this.clashflg =0;
        this.timer = 0;
    },

    update: function(app) {

        this.L = this.x;
        this.R = this.x + this.width;
        this.T = this.y;
        this.B = this.y + this.height; //足の当たり判定に加速度を足す。めり込み防止

        this.x -= worldvx;
        if(clash(this,player) && this.clashflg == 0){
            this.tweener.clear()
                .setLoop(false)
                .to({y:this.y - 50,scaleX:1}, 150)
                .wait(500)
                .to({alpha:0}, 100)
            this.Destroyflg = true;
            player.WaterAdd(10);
            this.clashflg = 1;
        }

        if(this.Destroyflg){
            this.timer++;
            if(this.timer > 30){
                this.remove();
            }
        }
    }
});



tm.define("Enemy", {
    superClass: "tm.app.AnimationSprite",

init: function(Level) {
        this.superInit("EnemySS");
        this.gotoAndPlay("tati");

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 120;
        this.height = 120;

        this.x = SCREEN_WIDTH;
        this.y = 220;

        this.speed = 2;

        this.vy = 0;


        this.timer = 0;
        this.Destroyflg = false;
        this.Destroytimer = 0;

    },

    update: function(app) {

        if(!this.Destroyflg){
            this.Alive();
        }
        else{
            this.Destroy();
        }
    },

    Alive: function() {
        this.x -= worldvx;

        this.L = this.x + 10;
        this.R = this.x + this.width - 10;
        this.T = this.y +10;
        this.B = this.y + this.height -10; //足の当たり判定に加速度を足す。めり込み防止
 

        if(this.x < -this.width){
            this.remove();
        }


        if(this.timer == 100){
           this.gotoAndPlay("kamae");
        }

        if(this.timer == 130){
            this.gotoAndPlay("shot");
            var bullet = Bullet(this.x).addChildTo(BulletGroup);
        }

        if(this.timer > 140){
            this.gotoAndPlay("tati");
            this.timer = 0;

        }
        this.timer++;

    },

    Destroy: function() {
        this.Destroytimer++;
        this.tweener
            .clear()
            .to({x: this.x +300, y: this.y - 200,rotation:360}, 500)

        if(this.Destroytimer > 100){
            this.remove();
        }
    },

});


tm.define("REnemy", {
    superClass: "tm.app.AnimationSprite",

init: function(Level) {
        this.superInit("REnemySS");
        this.gotoAndPlay("tati");

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 121;
        this.height = 121;

        this.x = SCREEN_WIDTH -50;
        this.y = 220;

        this.speed = 2;

        this.vy = 0;


        this.timer = 0;
        this.Destroyflg = false;
        this.Destroytimer = 0;

    },

    update: function(app) {

        if(!this.Destroyflg){
            this.Alive();
        }
        else{
            this.Destroy();
        }
    },

    Alive: function() {
        this.x -= worldvx;

        this.L = this.x + 10;
        this.R = this.x + this.width - 10;
        this.T = this.y +10;
        this.B = this.y + this.height -10; //足の当たり判定に加速度を足す。めり込み防止
 

        if(this.x < -this.width){
            this.remove();
        }


        if(this.timer == 100){
           this.gotoAndPlay("kamae");
        }

        if(this.timer == 130){
            this.gotoAndPlay("shot");
            var bullet = Bullet(this.x).addChildTo(BulletGroup);
        }

        if(this.timer == 140){
           this.gotoAndPlay("kamae");
        }

        if(this.timer == 150){
            this.gotoAndPlay("shot");
            var bullet = Bullet(this.x).addChildTo(BulletGroup);
        }

        if(this.timer == 160){
           this.gotoAndPlay("kamae");
        }

        if(this.timer == 170){
            this.gotoAndPlay("shot");
            var bullet = Bullet(this.x).addChildTo(BulletGroup);
        }

        if(this.timer > 180){
            this.gotoAndPlay("tati");
            this.timer = 0;

        }
        this.timer++;

    },

    Destroy: function() {
        this.Destroytimer++;
        this.tweener
            .clear()
            .to({x: this.x +300, y: this.y - 200,rotation:360}, 500)

        if(this.Destroytimer > 100){
            this.remove();
        }
    },

});

tm.define("Macho", {
    superClass: "tm.app.AnimationSprite",

init: function() {
        this.superInit("MachoSS");
        this.gotoAndPlay("tati");

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 200;
        this.height = 200;

        this.x = SCREEN_WIDTH + 300;
        this.y = 140;

        this.speed = 2;

        this.vy = 0;


        this.timer = 0;

        this.Destroyflg = false;
        this.Destroytimer = 0;
    },

    update: function(app) {


        if(!this.Destroyflg){
            this.Alive();
        }
        else{
            this.Destroy();
        }
    },

    Alive:function(){
        this.x -= worldvx;

        this.L = this.x + 10;
        this.R = this.x + this.width - 10;
        this.T = this.y +10;
        this.B = this.y + this.height -10; //足の当たり判定に加速度を足す。めり込み防止
 

        if(this.x < -this.width){
            this.remove();
        }

        if(this.timer == 100){
           this.gotoAndPlay("kamae");
        }

        if(this.timer == 130){
            this.gotoAndPlay("shot");
            var bomb = Bomb(this.x -25,this.y -25,10,-2).addChildTo(BulletGroup);
        }

        if(this.timer > 140){
            this.gotoAndPlay("tati");
            this.timer = 0;

        }

        this.timer++;


    },

    Destroy: function() {

        if(this.Destroytimer == 0){
            var wateritem = WaterItem50(this.x + 100).addChildTo(ItemGroup);
        }
        this.Destroytimer++;
        this.tweener
            .clear()
            .to({x: this.x +300, y: this.y - 200,rotation:360}, 500)

        if(this.Destroytimer > 100){
            this.remove();
        }
    }


});

tm.define("RMacho", {
    superClass: "tm.app.AnimationSprite",

init: function() {
        this.superInit("RMachoSS");
        this.gotoAndPlay("tati");

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 200;
        this.height = 200;

        this.x = SCREEN_WIDTH + 300;
        this.y = 140;

        this.speed = 2;

        this.vy = 0;

        this.timer = 0;
        this.Destroyflg = false;
        this.Destroytimer = 0;
    },

    update: function(app) {

        if(!this.Destroyflg){
            this.Alive();
        }
        else{
            this.Destroy();
        }
    },

    Alive: function() {
        
        this.x -= worldvx;

        this.L = this.x + 10;
        this.R = this.x + this.width - 10;
        this.T = this.y +10;
        this.B = this.y + this.height -10; //足の当たり判定に加速度を足す。めり込み防止
 
        if(this.x < -this.width){
            this.remove();
        }

        if(this.timer == 100){
           this.gotoAndPlay("kamae");
        }

        if(this.timer == 130){
            this.gotoAndPlay("shot");
            var bomb = RBomb(this.x -25,this.y -25,10,-1).addChildTo(BulletGroup);
        }

        if(this.timer > 140){
            this.gotoAndPlay("tati");
            this.timer = 0;

        }

        this.timer++;


    },

    Destroy: function() {
        if(this.Destroytimer == 0){
            var wateritem = WaterItem50(this.x + 100).addChildTo(ItemGroup);
        }
        this.Destroytimer++;


        this.tweener
            .clear()
            .to({x: this.x +300, y: this.y - 200,rotation:360}, 500)

        if(this.Destroytimer > 100){
            this.remove();
        }
    }


});

tm.define("Heri", {
    superClass: "tm.app.AnimationSprite",

init: function() {
        this.superInit("HeriSS");
        this.gotoAndPlay("tati");

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 130;
        this.height = 130;

        this.x = -this.width;
        this.y = -20;

        this.vx = 4;
        this.vy = 0;

        this.trigger = 100;

        this.timer = 0;
        this.Destroyflg = false;
    },

    update: function(app) {
        this.x -= worldvx - this.vx;


        if(this.x > SCREEN_WIDTH){
            this.remove();
        }

        if(this.timer == this.trigger){
           this.gotoAndPlay("kamae");
        }

        if(this.timer == this.trigger + 30){
            this.gotoAndPlay("shot");
            var bomb = HeriBomb(this.x -25,this.y).addChildTo(BulletGroup);
        }

        if(this.timer == this.trigger + 35){
           this.gotoAndPlay("kamae");
        }

        if(this.timer == this.trigger + 45){
            this.gotoAndPlay("shot");
            var bomb = HeriBomb(this.x -25,this.y).addChildTo(BulletGroup);
        }


        if(this.timer == this.trigger + 50){
           this.gotoAndPlay("kamae");
        }


        if(this.timer == this.trigger + 60){
            this.gotoAndPlay("shot");
            var bomb = HeriBomb(this.x -25,this.y).addChildTo(BulletGroup);
        }

        if(this.timer == this.trigger + 75){
            this.gotoAndPlay("tati");
            this.timer = 0;

        }




        this.timer++;

    },


    Destroy: function() {

    }

});



tm.define("Bullet", {
    superClass: "tm.app.Sprite",

init: function(x) {
        this.superInit("Bullet");

        this.x = x - 5;
        this.y = 250;

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 30;
        this.height = 30;

        this.L = this.x;
        this.R = this.x + this.width;
        this.T = this.y;
        this.B = this.y + this.height; //足の当たり判定に加速度を足す。めり込み防止

        this.speed = 3;

        this.vy = 0;
        this.vx = 20;

        this.clashflg = 0;

    },

    update: function(app) {
        this.x -= worldvx + this.vx;
        this.y -= this.vy;
        this.rotation 

        this.L = this.x + 20;
        this.R = this.x + this.width - 10;
        this.T = this.y +10;
        this.B = this.y + this.height - 10; //足の当たり判定に加速度を足す。めり込み防止
 
        if(clash(this,player) && this.clashflg == 0){

            //プレイやーがムテキだったら
            if(player.clash()){
                var kin = Kakin(this.x).addChildTo(EffectGroup);
                this.vx *= -1;
                this.vy = 15;
                this.rotation = 120;
                this.x += 50;
                this.y -= 20;
                this.clashflg = 1;


            }
        }

        if(this.x < 0 - this.width){
            this.remove();
        }
    },

});


//爆弾
tm.define("Bomb", {
    superClass: "tm.app.Sprite",

init: function(x,y,vx,vy) {
        this.superInit("Bomb");

        this.x = x;
        this.y = y;


        this.vx = vx;
        this.vy = vy;

        this.yuka = 250;

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 100;
        this.height = 100;

        this.L = this.x + 25;
        this.R = this.x + this.width - 30;
        this.T = this.y + 40;
        this.B = this.y + this.height - 10; //足の当たり判定に加速度を足す。めり込み防止



        this.clashflg = 0;

    },

    update: function(app) {
        this.x -= worldvx + this.vx;
        this.y += this.vy;
        this.vy += 0.8;

        this.L = this.x + 25;
        this.R = this.x + this.width - 30;
        this.T = this.y + 40;
        this.B = this.y + this.height - 10; //足の当たり判定に加速度を足す。めり込み防止


        if(this.y > this.yuka){
            var doon = Doon(this.x,this.clashflg).addChildTo(BulletGroup);
            this.remove();
        }

        if(clash(this,player) && this.clashflg == 0){
            //プレイーがムテキだったら
            if(player.BomCounter()){
                var kin = Kakin(this.x).addChildTo(EffectGroup);
                this.vx *= -2;
                this.vy = -5;
                this.clashflg = 1;
            }
        }


    },

});

//爆弾
tm.define("RBomb", {
    superClass: "tm.app.Sprite",

init: function(x,y,vx,vy) {
        this.superInit("RBomb");

        this.x = x;
        this.y = y;


        this.vx = vx;
        this.vy = -vy;

        this.yuka = 250;

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 100;
        this.height = 100;

        this.L = this.x;
        this.R = this.x + this.width;
        this.T = this.y;
        this.B = this.y + this.height; //足の当たり判定に加速度を足す。めり込み防止



        this.bomtimer = 0;
        this.bomflg = false;
        this.bomX = 0; //投下位置保存
        this.DoonX = 100; //ドーンの間隔
        this.clashflg = 0;

    },

    update: function(app) {
        this.x -= worldvx + this.vx;
        this.y += this.vy;
        this.vy += 0.8;

        this.L = this.x + 10;
        this.R = this.x + this.width - 10;
        this.T = this.y +10;
        this.B = this.y + this.height - 10;
 

        if(this.y > this.yuka){
            this.bomflg = true;

        }

        if(this.bomflg){
            if(this.bomtimer == 0){
                this.y = 800; //見えなくする
                this.bomX = this.x;
                var doon = Doon(this.bomX,this.clashflg).addChildTo(BulletGroup);
            }
            if(this.bomtimer == 7){
                var doon = Doon(this.bomX - this.DoonX,this.clashflg).addChildTo(BulletGroup);
                this.DoonX += this.DoonX; 
            }
            if(this.bomtimer == 14){
                var doon = Doon(this.bomX- this.DoonX,this.clashflg).addChildTo(BulletGroup);
                this.remove();
            }
            this.bomtimer++
        }

        if(clash(this,player) && this.clashflg == 0){

            //プレイやーがムテキだったら
            if(player.BomCounter()){
                var kin = Kakin(this.x).addChildTo(EffectGroup);
                this.vx *= -2;
                this.vy = -5;
                this.clashflg = 1;
                this.DoonX = -100;
            }

        }


    },

});

//核
tm.define("ABomb", {
    superClass: "tm.app.Sprite",

init: function(x,y,vx,vy) {
        this.superInit("ABomb");

        this.width = 600;
        this.height = 600;


        this.x = SCREEN_WIDTH /2 - 300;
        this.y = -this.height;

        this.vy = 0;

        this.origin.x = 0;
        this.origin.y = 0;

        this.yuka = -180;


        this.clashflg = 0;

    },

    update: function(app) {
        this.y += this.vy;
        this.vy += 0.05;

        if(this.y > this.yuka){
            var doon = ADoon(this.x).addChildTo(BulletGroup);
            this.remove();
        }

    },

});

//爆弾
tm.define("HeriBomb", {
    superClass: "tm.app.Sprite",

init: function(x,y) {
        this.superInit("Bomb");

        this.x = x + 85;
        this.y = y + 60;

        this.width = 100;
        this.height = 100;


        this.tweener
            .clear()
            .to({scaleX:0.3,scaleY:0.3}, 10)
            .to({scaleX:1,scaleY:1}, 600)

        this.vx = 4;
        this.vy = 0;

        this.yuka = 250;

        this.origin.x = 0;
        this.origin.y = 0;


        this.L = this.x + 25;
        this.R = this.x + this.width - 30;
        this.T = this.y + 40;
        this.B = this.y + this.height - 10;

        this.clashflg = 0;
        this.RakkSpeed = 0.5;


    },

    update: function(app) {
        this.x -= worldvx + this.vx;
        this.y += this.vy;
        this.vy += this.RakkSpeed;

        this.L = this.x + 25;
        this.R = this.x + this.width - 30;
        this.T = this.y + 40;
        this.B = this.y + this.height - 10;


        if(this.y > this.yuka){
            var doon = Doon(this.x,this.clashflg).addChildTo(BulletGroup);
            this.remove();
        }


        if(clash(this,player) && this.clashflg == 0){

            //プレイやーがムテキだったら
            if(player.BomCounter()){
                var kin = Kakin(this.x).addChildTo(EffectGroup);
                this.vx = -20;
                this.vy = 0;
                this.clashflg = 1;
                this.RakkSpeed = 0.6;
            }
        }


    },

});


tm.define("Doon", {
    superClass: "tm.app.Sprite",

init: function(x,counter) {
        this.superInit("Doon");

        this.x = x - 50;
        this.y = 160;

        this.vx = 10;
        this.vy = -3;

        this.yuka = 250;

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 200;
        this.height = 175;

        this.L = this.x;
        this.R = this.x + this.width;
        this.T = this.y;
        this.B = this.y + this.height;

        this.timer = 0;

        this.tweener
            .clear()
            //.to({y:this.y - this.height,scaleY:2}, 150)
            //.wait(200)
            //.to({x:this.x - 40,y:this.y,scaleY:1,scaleX:1.5,alpha:0}, 200)

            .to({y:this.y - this.height,scaleY:2}, 350,"easeOutQuart")
            .to({x:this.x - 40,y:this.y,scaleY:1,scaleX:1.5,alpha:0}, 300,"easeInOutCubic")
        this.counterflg = counter;
        this.clashflg = 0;

        var kemuri = Kemuri(this.x).addChildTo(EffectGroup);

    },

    update: function(app) {
        this.timer++;
        this.x -= worldvx;

        this.L = this.x + 20;
        this.R = this.x + this.width - 20;
        this.T = this.y +20;
        this.B = this.y + this.height;
 
        if(clash(this,player) && this.clashflg == 0 && this.counterflg == 0){
            //プレイやーがムテキだったら
            if(player.clash()){
                var kin = Kakin(this.x).addChildTo(EffectGroup);
                this.clashflg = 1;
            }
        }

        if(this.timer > 3){
            this.clashflg = 1;
        }



        if(this.timer > 17){
            this.remove();
        }


        //敵キャラとのあたり判定
        if(this.counterflg == 1){
            var ec = EnemyGroup.children;
            var self = this;
            ec.each(function(enemy) {
                if(clash(self,enemy)){
                    enemy.Destroyflg = true;
                   }
            });
        }
    },

});


tm.define("ADoon", {
    superClass: "tm.app.Sprite",

init: function(x) {
        this.superInit("Doon");

        this.x = -1000;
        this.y = -2600;

        this.vx = 10;
        this.vy = -3;

        this.yuka = 230;

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 3000;
        this.height = 3000;

        this.L = this.x;
        this.R = this.x + this.width;
        this.T = this.y;
        this.B = this.y + this.height;

        this.timer = 0;

        this.tweener
            .clear()
            .to({y:this.y + this.height / 2,scaleY:0.5}, 150)
            .to({y:this.y - this.height,scaleY:2}, 150)
            .wait(500)
            .to({x:this.x - 50,y:this.y,scaleY:1,scaleX:1.5,alpha:0}, 300)

        this.clashflg = 0;

        var kemuri = AKemuri().addChildTo(EffectGroup);

    },

    update: function(app) {
        this.timer++;
        this.x -= worldvx;

        this.L = this.x + 10;
        this.R = this.x + this.width - 10;
        this.T = this.y +10;
        this.B = this.y + this.height - 10;
 
        if(clash(this,player) && this.clashflg == 0){
            //プレイやーがムテキだったら
            if(player.clash()){
                var kin = Kakin(this.x).addChildTo(EffectGroup);
                this.clashflg = 1;
            }
        }

        if(this.timer > 5){
            this.clashflg = 1;
        }



        if(this.timer > 17){
            this.remove();
        }

    },

});

tm.define("Kakin", {
    superClass: "tm.app.Sprite",

init: function(x) {
        this.superInit("Kin");

        this.x = x + 20;
        this.y = 280;

        this.width = 40;
        this.height = 40;


        this.tweener
            .clear()
            .to({x: this.x +10, y: this.y - 10,scaleX:0}, 75)
            .to({x: this.x +20, y: this.y - 20,scaleX:1}, 75)
            .wait(1000)
            .to({alpha:0}, 500)


        this.timer = 0;

    },

    update: function(app) {
        this.timer++;

        if(this.timer % 50 == 0){
            this.remove();
        }
    },



});

tm.define("Kemuri", {
    superClass: "tm.app.Sprite",

init: function(x) {
        this.superInit("Kemuri");

        this.x = x-20;
        this.y = 250;

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 200;
        this.height = 200;

        this.timer = 0;

    },

    update: function(app) {
        this.timer++;
        this.x -= worldvx;

        if(this.timer > 1){
            this.remove();
        }

    },

});

tm.define("AKemuri", {
    superClass: "tm.app.Sprite",

init: function() {
        this.superInit("Kemuri");

        this.x = -500;
        this.y = -400;

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 2400;
        this.height = 2400;

        this.timer = 0;

    },

    update: function(app) {
        this.timer++;
        this.x -= worldvx;

        if(this.timer > 3){
            this.remove();
        }

    },

});


//衝突用関数ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
function clash(a,b){
    //if (((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y)) < (a.radius+b.radius)*(a.radius+b.radius)) {
    //    return true;
    //}
    if((a.L <= b.R) && (a.R >= b.L) 
    && (a.T  <= b.B) && (a.B >= b.T))
    {
            return true
    }

    return false;
    
}



function rand(n){
    return Math.floor(Math.random() * (n));
}



