/**
 * Created by wanght on 15/5/9.
 * @Author wanght
 * @Email whtoo@qq.com
 */

var gameOverPtr = null;
var GameOverLayer = cc.LayerColor.extend({
    scoreLb:null,
    bestLb:null,
    homeBtn:null,
    gameCBtn:null,
    gameMBtn:null,
    shareBtn:null,
    restartBtn:null,
    delegate:null,
    ctor:function(color,width,height){
        gameOverPtr = this;
        cc.LayerColor.prototype.ctor.call(this,color,width,height);
        var node = ccs.load(res.gameEnd_json).node;

        this.scoreLb = node.getChildByName("scoreLb");
        this.bestLb = node.getChildByName("bestLb");
        this.homeBtn = node.getChildByName("homeBtn");
        this.gameCBtn = node.getChildByName("gameCBtn");
        this.gameMBtn = node.getChildByName("gameMBtn");
        this.shareBtn = node.getChildByName("shareBtn");
        this.restartBtn = node.getChildByName("restartBtn");

        this.getBtnAction(this.homeBtn);
        this.getBtnAction(this.gameCBtn);
        this.getBtnAction(this.gameMBtn);
        this.getBtnAction(this.shareBtn);
        this.getBtnAction(this.restartBtn);

        this.addChild(node);

    },
    setScoreS:function(score,best){
      this.scoreLb.setString(score);
      this.bestLb.setString(best);
        this.tipBest();
    },
    tipBest:function(){
        var scaleBig = new cc.ScaleTo(0.1,2,2);
        var scale = new cc.ScaleTo(0.1,1,1);
        this.bestLb.runAction(cc.sequence(scaleBig,scale));
    },
    popMenu:function(superLayer){
        superLayer.addChild(this);
    },
    dismissMenu:function(superLayer){
        this.removeFromParent(true);
    },
    getBtnAction:function(btn){
        btn.clicked = false;
        //cocos studio里面的button时ccui
        //用cc.eventManager会有问题
        btn.addTouchEventListener(this.touchHandler,btn);
    },
    touchHandler:function (sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_BEGAN:
                    var btn = sender;
                    if( btn.clicked == false){
                        var time = 0.05;
                        var scale = new cc.ScaleTo(time,0.8,0.8);
                        var dropDown = new cc.MoveBy(time,cc.p(0,-12));
                        var scaleB = new cc.ScaleTo(time,1,1);
                        var popB = new cc.MoveBy(time,cc.p(0,12));
                        var spawn = cc.spawn(scale,dropDown);
                        var spawnB = cc.spawn(scaleB,popB);
                        var callBack = null;
                        var seq = null;
                        if(btn.name == "restartBtn"){
                            callBack = new cc.CallFunc(gameOverPtr.resetGame,gameOverPtr);
                            seq = cc.sequence(spawn,spawnB,callBack)
                        }
                        else if(btn.name =="homeBtn"){
                            callBack = new cc.CallFunc(gameOverPtr.delegate.toHome,gameOverPtr);
                            seq = cc.sequence(spawn,spawnB,callBack)
                        }
                        else{
                            seq = cc.sequence(spawn,spawnB);
                        }

                        btn.runAction(seq);
                    }


                    break;

                case ccui.Widget.TOUCH_MOVED:

                    break;

                case ccui.Widget.TOUCH_ENDED:
                    var btn = sender;
                    btn.clicked = false;
                    break;

                case ccui.Widget.TOUCH_CANCELED:
                    var btn = sender;
                    btn.clicked = false;
                    break;

                default:
                    break;
            }
    },
    resetGame:function(){
        cc.eventManager.removeListeners(gameOverPtr.delegate);
        gameOverPtr.delegate.startGame();
        gameOverPtr.delegate._start = true;
        gameOverPtr.delegate.ps.player.y = this.delegate.ps.player.getContentSize().width * 0.5+ obSize.height;
        gameOverPtr.delegate.ps.player.x = gameOverPtr.delegate.obLayer.getRealW(gameOverPtr.delegate.obLayer.prevOb) -  gameOverPtr.delegate.ps.player.width * 0.5;

        gameOverPtr.dismissMenu(gameOverPtr.delegate);

        gameOverPtr.delegate.ps.player.stopAllActions()
        gameOverPtr.delegate.ps.player.rotation = 0;
        gameOverPtr.delegate.ps.yao()

        if(gameOverPtr.delegate.oldStick ){
            gameOverPtr.delegate.oldStick.removeFromParent(true);
        }
},


});