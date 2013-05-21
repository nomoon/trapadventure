game.PlayScreen = me.ScreenObject.extend({
  /**
   *  action to perform on state change
   */
  onResetEvent: function() {
    me.levelDirector.loadLevel("area01"); // TODO

    me.game.addHUD(0, 0, 640, 60);
    me.game.HUD.addItem("score", new game.ScoreObject(620, 10));
    me.game.sort();

    if(me.audio.getCurrentTrack() == null)
      me.audio.playTrack("starships", 0.8);
  },


  /**
   *  action to perform when leaving this screen (state change)
   */
  onDestroyEvent: function() {
    me.game.disableHUD();
  }
});
