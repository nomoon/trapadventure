game.TitleScreen = me.ScreenObject.extend({
	init: function() {
		this.parent(true);

		this.title = null;
		this.font = null;
		this.scrollerfont = null;
		this.scrollertween = null;

		this.scroller = "ANDREW, I WILL KILL YOU AND HIDE THE BODY...";
		this.scrollerpos = 600;
	},

	onResetEvent: function() {
		if (this.title == null) {
			this.title = me.loader.getImage("title_screen");
			this.fonth = new me.BitmapFont("32x32_pinkfont", 32);
			this.fonti = new me.BitmapFont("32x32_font", 32);
			this.scrollerfont = new me.BitmapFont("16x16_font", 16);
		}

		this.scrollerpos = 800;

		this.scrollertween = new me.Tween(this).to({
			scrollerpos: -800
		}, 10000).onComplete(this.scrollover.bind(this)).start();

		me.input.bindKey(me.input.KEY.ENTER, "enter", true);

		me.audio.playTrack("trololo", 0.8);
	},

	scrollover: function() {
		this.scrollerpos = 800;
		this.scrollertween.to({
			scrollerpos: -800
		}, 10000).onComplete(this.scrollover.bind(this)).start();
	},

	update: function() {
		if (me.input.isKeyPressed('enter')) {
			me.state.change(me.state.PLAY);
		}
		return true;
	},

	draw: function(context) {
		context.drawImage(this.title, 0, 0);

		this.fonth.draw(context, "&NICKI MINAJ'S\nTRAP ADVENTURE!", 96, 64);
		this.fonti.draw(context, "PRESS ENTER TO PLAY", 20, 224);

		this.scrollerfont.draw(context, this.scroller, this.scrollerpos, 320);
	},

	onDestroyEvent: function() {
		me.input.unbindKey(me.input.KEY.ENTER);
		this.scrollertween.stop();
		me.audio.stopTrack();
	}
});
