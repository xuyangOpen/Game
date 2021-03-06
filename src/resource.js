var res = {
    HelloWorld_png : "res/HelloWorld.png",
    StartBackground_png0 : "res/texture/background0.png",
    StartBackground_png1 : "res/texture/background1.png",
    StartBackground_png2 : "res/texture/background2.png",
    StartBackground_png3 : "res/texture/background3.png",
    Btnn_png : "res/texture/start_normal.png",
    Btns_png : "res/texture/start_select.png",
    ButtonStart_png : "res/texture/arrow.png",
    StickBlack_png : "res/texture/stick_black.png",
    Restart_png : "res/texture/shuaxin.png",
    Home_png : "res/texture/zhuye.png",
    ScoreBg:"res/texture/scoreBg.png",
    overScoreBg:"res/texture/overSoreBg.png",
    ShareBtn:"res/texture/notify.png",
    arrow_png:"res/texture/arrow.png",
    redSig_png:"res/texture/redsig.png",
    guideText:"res/texture/guide_text.png",
    //
    KickPlist : "res/texture/kick.plist",
    KickPng : "res/texture/kick.png",

    ShakePlist : "res/texture/shake.plist",
    ShakePng : "res/texture/shake.png",

    WalkPlist : "res/texture/walk.plist",
    WalkPng : "res/texture/walk.png",

    YaoPlist : "res/texture/yao.plist",
    YaoPng : "res/texture/yao.png",
    LauDai1_png: "res/texture/laudai1.png",
    LauDai2_png: "res/texture/laudai2.png",
    Matrroi1_png:"res/texture/mattroi1.png",
    Matrroi2_png:"res/texture/mattroi2.png",
    Matrroi3_png:"res/texture/mattroi3.png",
    FontFelt:"res/fonts/FontFelt.ttf",
    bg_mp3:"res/sound/bg_0.mp3",
    btn_mp3:"res/sound/button.mp3",
    vitory_mp3:"res/sound/victory.wav",
    fall_mp3:"res/sound/fall.wav",
    dead_mp3:"res/sound/dead.wav",
    bump_mp3:"res/sound/sound-bump.mp3",
    restart_png:"res/texture/btn_replay.png",
    home_png:"res/texture/btn_home.png",
    gameCen_png:"res/texture/btn_gameCenter.png",
    rate_png:"res/texture/btn_rate.png",
    share_png:"res/texture/btn_share.png",
    gameEnd_json:"res/GameOverLayer.json",
    score_json:"res/ScoreLayer.json"
};

var g_fonts = [{
    type:"font",
    name:"FontFelt",
    srcs:["res/fonts/FontFelt.ttf"]
}];

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
for (var k in g_fonts){
    g_resources.push(g_fonts[k]);
}
