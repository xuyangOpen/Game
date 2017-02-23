/**
 * Created by wanght on 15/5/9.
 * @Author wanght
 * @Email whtoo@qq.com
 */
//背景墙
var bgSize = null;
var obSize = {width:120,height:287};
var minLimit = {between:48,width:64};
var betweenOffSetX  = 120;
var leftW = 0;//除去左边障碍物后视屏剩下的宽度
var GameBgLayer = cc.Layer.extend({
    ctor:function () {
        this._super();//
        bgSize = cc.director.getWinSize();
        var centerX = bgSize.width / 2;
        var centerY = bgSize.height / 2;
        var rnd = Math.ceil(Math.random() * 2 + 1);
        var resStr = 'res.StartBackground_png'+rnd;
        cc.log(resStr);
        var spriteBg = new cc.Sprite(eval(resStr));
        spriteBg.attr({
            x: centerX,
            y: centerY,
            scale: 1.0,
            rotation: 0
        });

        this.addChild(spriteBg,0,1);

        return true;

    }

});

//猴子
function PlayerSprite(){

          this.sfCache = null;
          this.player = null;
          var self = this;
          this.init=function () {

              self.sfCache = cc.spriteFrameCache;
              self.sfCache.addSpriteFrames(res.ShakePlist, res.ShakePng);
              self.sfCache.addSpriteFrames(res.KickPlist, res.KickPng);
              self.sfCache.addSpriteFrames(res.WalkPlist, res.WalkPng);
              self.sfCache.addSpriteFrames(res.YaoPlist, res.YaoPng);

              self.player = new cc.Sprite('#d0001.png');

              var playSize = self.player.getContentSize();
              self.player.setScale(1, 1);
              self.player.x = bgSize.width / 2;
              self.player.y = obSize.height + playSize.height / 2;

          };
    this.walkAction=function (flag) {
        self.player.stopAllActions();
              var animFrames = [];
              var str = "";
              var frame;
              for (var i = 1; i < 10; i++) {
                  str = "z000" + i + ".png";
                  frame = self.sfCache.getSpriteFrame(str);
                  animFrames.push(frame);
              }
              var animation = new cc.Animation(animFrames, flag);
        return cc.animate(animation).repeatForever();
          };
    this.yaoAction=function (flag) {
        self.player.stopAllActions();
              var animFrames = [];
              var str = "";
              var frame;
              for (var i = 1; i < 10; i++) {
                  str = "d00" + (i < 10 ? ("0" + i) : i) + ".png";
                  frame = self.sfCache.getSpriteFrame(str);
                  animFrames.push(frame);
              }
              var animation = new cc.Animation(animFrames, flag);
        return cc.animate(animation).repeatForever();
          };
    this.kickAction= function (flag) {
        self.player.stopAllActions();
              var animFrames = [];
              var str = "";
              var frame;
              for (var i = 1; i < 10; i++) {
                  str = "t000" + i + ".png";
                  frame = self.sfCache.getSpriteFrame(str);
                  animFrames.push(frame);
              }
              var animation = new cc.Animation(animFrames, flag);
        return animate(animation).repeatForever();
          };
    this.shakeAction= function (flag) {
        self.player.stopAllActions();
              var animFrames = [];
              var str = "";
              var frame;
              for (var i = 1; i < 10; i++) {
                  str = "dq000" + i + ".png";
                  frame = self.sfCache.getSpriteFrame(str);
                  animFrames.push(frame);
              }
              var animation = new cc.Animation(animFrames, flag);
              return cc.animate(animation).repeatForever();
          }
        this.walk=function(flag){
            this.player.runAction(this.walkAction(flag));
        },
        this.shake=function(flag){
            this.player.runAction(this.shakeAction(flag));
        },
        this.yao=function(flag){
            this.player.runAction(this.yaoAction(flag));
        }
        this.kick=function(flag){
            this.player.runAction(this.kickAction(flag));
        }

};

var StickSprite = cc.Sprite.extend({
    stickH:0,
    updtH:0.05,
    originalH:287,
    tend:0,
    delegate:null,
    ctor:function(){
        this._super();
        this.initWithFile(res.StickBlack_png);
        return true;
    },
    getRealH:function(){
        return this.getScaleY() * this.getContentSize().height;
    }

});

var GameView = cc.Layer.extend({
    gameBg:null,
    gameOverLayer:null,
    guideText:null,
    ps:null,
    audioEngine:cc.audioEngine,
    obLayer:null,
    stickSprite:null,
    tipLayer:null,
    self:null,
    _start:true,
    gameScore:0,
    gameBestScore:0,
    oldStick:null,

    ctor:function(){
        this._super();
        this.self = this;
        this.gameBg = new GameBgLayer();
        this.addChild(this.gameBg,0,1);

        this.guideText = new cc.LabelTTF('','宋体',42);
        this.addChild(this.guideText,1,2);

        this.ps = new PlayerSprite();
        this.ps.init();
        var npc = this.ps.player;
        this.addChild(npc);
        this.ps.yao(0.1);

        this.audioEngine.playMusic(res.bg_mp3,true);

        this.obLayer = new ObStaclesLayer();
        this.addChild(this.obLayer,0,3);

        this.gameOverLayer = new GameOverLayer(cc.color(77,77,77,165));
        this.gameOverLayer.delegate = this;
        this.tipLayer = new TipLayer();
        this.tipLayer.x = 0;
        this.tipLayer.y = bgSize.height - this.tipLayer.getContentSize().height;

        var bestScore =   cc.sys.localStorage.getItem("bestS")? cc.sys.localStorage.getItem("bestS"):0;
        this.gameBestScore = bestScore;

        return true;
    },
    nextGen:function(){
        if(this.stickSprite != null){
            this.oldStick = this.stickSprite;

        }
        this.stickSprite = new StickSprite();
        this.stickSprite.anchorX = 0.5;
        this.stickSprite.anchorY = 0;
        this.stickSprite.scaleY = 0;
        this.stickSprite.delegate = this;
        this.addChild(this.stickSprite);

        this.obLayer.generateOb();

        var prevObCenterX = this.obLayer.prevPosX;
        var moveBy = new cc.MoveBy(prevObCenterX/ 500,cc.p(-prevObCenterX,0));
        var cloneMoveBy = new cc.MoveBy(prevObCenterX / 500,cc.p( -prevObCenterX+this.ps.player.getContentSize().width *0.5,0));
        this.stickSprite.x = this.obLayer.prevOb.getContentSize().width * this.obLayer.prevOb.getScaleX();
        this.stickSprite.y = obSize.height;
        this.audioEngine.playEffect(res.vitory_mp3);
        this.ps.player.runAction(cloneMoveBy);
        this.obLayer.runAction(moveBy);

        if(this.oldStick != null){
            var seq = cc.sequence(moveBy.clone(),new cc.CallFunc(this.removeStick,this));
            this.oldStick.runAction(seq);
        }

    },
    removeStick:function(target,data){
        if(this.oldStick){
            this.oldStick.stopAllActions();
            this.oldStick.removeFromParent(true);
        }
    },
    startX:function(){
        cc.log('bind this');
        this.schedule(this.updateDB,0.02);
    },
    stopX:function(){
        this.unschedule(this.updateDB);
        this._start = false;
            //schedule的响应事件对js的function包裹消耗是非常敏感的
            cc.log(this.stickSprite.getRealH());
            var data = this.stickSprite.getRealH();
            var callFunc = new cc.CallFunc(this.onEndGrow,this,data);
            this.stickSprite.runAction
            (
                cc.sequence
                (
                    cc.delayTime(0.3),
                    cc.rotateBy(0.1, 90),
                    callFunc
                )
            );

    },
    updateDB:function(dt){
        var self = this.stickSprite;
        var scaleY = self.getScaleY();
        self.setScaleY(scaleY+0.05);
        cc.log("a"+scaleY);

    },
    onTouchBegan:function (touch, event) {
        var self = event._currentTarget;
        cc.log("I "+event._currentTarget);
        if (self._start) {
            cc.log("I picked a tile!!");
            self.startX();
            return true;
        }
        return false;
    },
    onToucheEnded:function(touch,event){
        var self = event._currentTarget;
        cc.log("touch End!!");
        self.stopX();
        return true;
    },
    startGame:function(){
        var self = this;


        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:self.onTouchBegan,
            onTouchEnded:self.onToucheEnded
        });

        this.nextGen();
        cc.eventManager.addListener(listener,self);

        this.gameScore = 0;
        this.tipLayer.scoreLb.setString(0);
        this.tipLayer.popMenu(this);
    },
    endGame:function(){
        cc.eventManager.removeAllListeners();
        this.gameOverLayer.setScoreS(this.gameScore,this.gameBestScore);
        this.tipLayer.dismissMenu(this);

    },
    toHome:function(){
        gameLayer.obLayer.beginInit();
        if(gameLayer.obLayer.nextOb){
            gameLayer.obLayer.nextOb.removeFromParent(true);
            gameLayer.obLayer.nextOb = null;
        }
        if(gameLayer.oldStick){
            gameLayer.oldStick.removeFromParent(true);
            gameLayer.oldStick = null;
        }
        gameLayer.stickSprite.removeFromParent(true);
        gameLayer.tipLayer.dismissMenu(gameLayer);
        gameLayer.gameOverLayer.dismissMenu(gameLayer);
        menuLayer.popUp();

        gameLayer.ps.player.x = bgSize.width /2;
        gameLayer.ps.player.y = obSize.height +  gameLayer.ps.player.height * 0.5;
        gameLayer.ps.player.stopAllActions();
        gameLayer.ps.player.rotation = 0;
        gameLayer.ps.yao(0.1);

        gameLayer._start = true;

    },
    onEndGrow:function(realH,data){
        cc.log(data);
        var leftX = betweenOffSetX;
        var rightX = leftX + this.obLayer.getRealW(this.obLayer.nextOb);
        var moveBy = null;
        cc.log('leftW'+rightX);
        var seq = null;
        this.obLayer.prevPosX = (betweenOffSetX + this.obLayer.getRealW(this.obLayer.prevOb));
        this.audioEngine.playEffect(res.bump_mp3);
        if(data < leftX || data > rightX ){
            var jumpFall = new cc.MoveBy(data / 500,cc.p(50,-(this.ps.player.y + this.ps.player.getContentSize().height)));

            var rotate = new cc.RotateBy(90 / 500,90);
            var callFunc = new cc.callFunc(this.playDead,this);
            var stickFunc = new cc.callFunc(this.stickFall,this);
            moveBy = cc.moveBy(data / 500,cc.p(data,0));
            seq = cc.sequence(moveBy,stickFunc,cc.spawn(jumpFall,rotate,callFunc));


            if(this.gameScore > this.gameBestScore){
                this.gameBestScore = this.gameScore;
                cc.sys.localStorage.setItem('bestS',this.gameScore);

            }
            this.endGame();

        }
        else{
            //new cc.Sequence 和 cc.sequence 在单action时行为不同，
            //Sequence类有bug会导致单度action被double
            this.gameScore += 1;


            var line = rightX - this.ps.player.getContentSize().width * 0.5;

            moveBy = cc.moveBy( line/ 500,cc.p(line,0));
             seq =  cc.sequence(moveBy,cc.callFunc(this.playVic,this));
        }

        this.ps.player.runAction(seq);

    },
    stickFall:function(){
        var rotate = new cc.RotateBy(90 / 500,90);
        this.stickSprite.runAction(rotate);
    },
    playDead:function(){
        this.audioEngine.playEffect(res.fall_mp3);
        this.audioEngine.playEffect(res.dead_mp3);

        this.gameOverLayer.popMenu(this);


    },
    playVic:function(){
        this.audioEngine.playEffect(res.vitory_mp3);
        this._start = true;
        this.obLayer.stopAllActions();
        this.ps.player.stopAllActions();
        this.nextGen();

        this.tipLayer.scoreLb.setString(this.gameScore);
        var scaleTip = new cc.ScaleTo(0.1,3,3);
        var scaleB = new cc.ScaleTo(0.2,1,1);
        var seq = cc.sequence(scaleTip,scaleB);
        this.tipLayer.scoreLb.runAction(seq);

    }

});

var TipLayer = cc.Layer.extend({
    goldTxt:null,
    goldIcon:null,
    scoreLb:null,
    tipPic:null,
    ctor:function(){
        this._super();
        //初始化的layer默认anchor在(0，0)
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        var node = ccs.load(res.score_json).node;
        this.height = node.getContentSize().height;
        this.tipPic = node.getChildByName("tipPic");
        this.scoreLb = node.getChildByName("scoreLb");
        node.anchorX = 0.5;
        node.anchorY = 0.5;

        node.x = this.getContentSize().width * 0.5;
        node.y = this.getContentSize().height * 0.5;
        cc.log(this.getContentSize().height+"ddd");
        this.addChild(node);

        return true;
    },
    popMenu:function(superLayer){
        superLayer.addChild(this);
    },
    dismissMenu:function(superLayer){
        this.removeFromParent(true);
    }
})

//障碍物层
var ObStaclesLayer = cc.Layer.extend({
    prevOb:null,
    nextOb:null,
    prevPosX:null,
    nextW:null,
    offSetX:0,
    ctor:function(){
        this._super();
        this.prevOb = new cc.Sprite(res.StickBlack_png);
        this.prevOb.anchorX = this.prevOb.anchorY = 0.5;
        this.beginInit();
        this.addChild(this.prevOb);
       return true;
   },
    beginInit:function(){
        var centerX = bgSize.width / 2;
        this.x =0;
        var scaleWTimes = obSize.width / this.prevOb.getContentSize().width;
        this.prevOb.attr({
            x: centerX,
            y: obSize.height / 2 ,
            scaleX: scaleWTimes,
            rotation: 0
        });

        this.prevPosX = this.prevOb.x - (this.getRealW(this.prevOb) * 0.5 );
        this.offSetX = this.prevPosX;
    },
    generateOb:function(){
        cc.log(this.prevPosX);
        this.offSetX = this.prevPosX;
        if(this.nextOb != null){
            var pre = this.prevOb;
            this.prevOb = this.nextOb;
            pre.removeFromParent(true);
            pre = null;
        }

        leftW = bgSize.width - this.getRealW(this.prevOb);

        var rndBetween = (leftW-minLimit.width * 2) * Math.random();
        rndBetween = rndBetween > minLimit.between?rndBetween:minLimit.between;
        betweenOffSetX = rndBetween;
        cc.log("xs"+betweenOffSetX);
        this.nextOb = new cc.Sprite(res.StickBlack_png);
        this.nextW = (leftW - rndBetween) % minLimit.width + minLimit.width;
        var scaleWTimes = this.nextW / this.prevOb.getContentSize().width;
        var centerX = this.prevOb.x + this.getRealW(this.prevOb) * 0.5 + rndBetween + this.nextW * 0.5;
        leftW = betweenOffSetX + this.nextW;
        this.nextOb.attr({
            x: centerX,
            y: obSize.height / 2 ,
            scaleX: scaleWTimes,
            rotation: 0
        });
        this.addChild(this.nextOb);

    },
    getRealW:function(item){
        return  item.getContentSize().width * item.getScaleX();
    }

});