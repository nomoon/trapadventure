
var game = {
  "onload" : function () {
    if (!me.video.init("screen", 640, 384, true, 2, true)) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    if (document.location.hash === "#debug") {
      window.onReady(function () {
        me.plugin.register.defer(debugPanel, "debug");
      });
    }

    me.audio.init("mp3");

    me.loader.onload = this.loaded.bind(this);

    me.loader.preload(game.resources);

    me.state.change(me.state.LOADING);
  },

  "loaded" : function () {
    cm.setDebug(true);
    me.state.set(me.state.MENU, new game.TitleScreen());
    me.state.set(me.state.PLAY, new game.PlayScreen());
    me.state.transition("fade", "#FFFFFF", 250);

    me.entityPool.add("mainPlayer", game.PlayerEntity);
    me.entityPool.add("Beez", game.Beez);
    me.entityPool.add("swagBullet", game.swagBullet);

    me.input.bindKey(me.input.KEY.LEFT,  "left");
    me.input.bindKey(me.input.KEY.RIGHT, "right");
    me.input.bindKey(me.input.KEY.UP,    "jump", true);
    me.input.bindKey(me.input.KEY.DOWN,  "duck", true);
    me.input.bindKey(me.input.KEY.SPACE, "shoot", true);

    me.state.change(me.state.MENU);
  }
};
