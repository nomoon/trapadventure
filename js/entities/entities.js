game.PlayerEntity = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    settings.image = "minaj_r";
    settings.spritewidth = 32;
    settings.spriteheight = 60;
    this.parent(x, y, settings);

    this.type = "player";
    this.alwaysUpdate = true;
    this.updateColRect(5, 22, 10, 49);
    this.setVelocity(4, 0);
    this.setMaxVelocity(4, 20.5);
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
  },

  update: function() {
    if (this.alive) {
      if (me.input.isKeyPressed('left')) {
        this.flipX(true);
        this.vel.x -= this.accel.x * me.timer.tick;
      }else if (me.input.isKeyPressed('right')) {
        this.flipX(false);
        this.vel.x += this.accel.x * me.timer.tick;
      }else{
        this.vel.x = 0;
      }

      if (me.input.isKeyPressed('duck')) {
        if (!this.jumping && !this.falling) {
          var colLayer, myTile, myTileProperty;
          colLayer = me.game.currentLevel.getLayerByName("collision");
          myTile = colLayer.getTile(this.left + (this.width / 2), this.bottom);
          if (myTile === null || colLayer.tileset.getTileProperties(myTile.tileId).isPlatform) {
            this.pos.y = this.pos.y + 2;
          }
        }
      }

      if (me.input.isKeyPressed('jump')) {
        if (!this.jumping && !this.falling) {
          me.audio.play('jump', false, null, 0.8);
          this.jumpfactor = 0.8;
          this.vel.y = -this.maxVel.y * me.timer.tick * this.jumpfactor;
          this.jumping = true;
        }
      }

      if (me.input.isKeyPressed('shoot')) {
        var direction = this.renderable.lastflipX ? 'left' : 'right',
            startx = direction == 'left' ? -16 : 16
            shot = new game.swagBullet(this.pos.x + startx, this.pos.y + 24, {dir: direction});
        me.game.add(shot, this.z+1);
        me.game.sort();
      }

      // check for collision
      var res = me.game.collide(this);
      if (res) {
        if (res.obj.type == me.game.ENEMY_OBJECT) {
          if ((res.y > 0) && !this.jumping) {
            if (Math.floor((Math.random()*4)+1) == 1){
              me.audio.play('nicki-callme');
            }else{
              me.audio.play('nicki-ungh');
            }
            this.falling = false;
            this.jumpfactor += 0.05;
            this.vel.y = -this.maxVel.y * me.timer.tick * this.jumpfactor;
            this.jumping = true;
          }else{
            me.audio.play('nicki-iownthat');
            this.renderable.flicker(45);
            this.alive = false;
            this.flipY(true);
            this.collidable = false;
            this.setVelocity(0,8);
          }
        }
      }
    }

    this.updateMovement();

    if (this.top > me.game.viewport.bottom) {
      me.audio.play("nicki-onthefloor");
      me.state.change(me.state.PLAY);
      me.game.remove(this);
    }

    if (this.vel.x!=0 || this.vel.y!=0) {
      this.parent();
      return true;
    }

    return false;
  }
});

/* --------------------------
BEEZ
------------------------ */
game.Beez = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    settings.image = "beez";
    settings.spritewidth = 32;
    settings.spriteheight = 32;
    this.parent(x, y, settings);

    if (settings.height > settings.width) {
      this.upbee = true;
      this.startY = y;
      this.endY = y + settings.height - settings.spriteheight;
      this.setVelocity(0, 2);
    } else {
      this.startX =  x;
      this.endX = x + settings.width - settings.spritewidth;
      this.setVelocity(1, 0);
    }

    if (settings.width == settings.height) {
      this.stationary = true;
    }

    this.pos.x = x;
    this.walkLeft = true;

    this.collidable = true;
    this.updateColRect(5, 22, 11, 16);
    this.alwaysUpdate = true;
    this.type = me.game.ENEMY_OBJECT;
  },

  onCollision: function(res, obj) {
    if (this.alive && (res.y > 0) && obj.falling) {
      this.renderable.flicker(45);
      this.alive = false;
      me.game.HUD.updateItemValue("score", 250);
    }
  },

  update: function() {
    if (this.alive) {
      if(!this.stationary){
        if (!this.upbee) {
          if (this.walkLeft && this.pos.x <= this.startX) {
            this.walkLeft = false;
          } else if (!this.walkLeft && this.pos.x >= this.endX) {
            this.walkLeft = true;
          }

          this.flipX(this.walkLeft);
          this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
        } else {
          if (this.walkLeft && this.pos.y <= this.startY) {
            this.walkLeft = false;
          } else if (!this.walkLeft && this.pos.y >= this.endY) {
            this.walkLeft = true;
          }

          this.flipX(this.walkLeft);
          this.vel.y += (this.walkLeft) ? -this.accel.y * me.timer.tick : this.accel.y * me.timer.tick;
        }
      }
    }else{
      this.flipY(true);
      this.collidable = false;
      this.setVelocity(0,8);
      if (this.top > me.game.viewport.bottom) {
        me.game.remove(this);
      }
    }

    this.updateMovement();

    if (this.vel.x!=0 || this.vel.y!=0 || this.stationary) {
      // update object animation
      this.parent();
      return true;
    }
    return false;
  }
});

/*-------------
Bullet!
*/
game.swagBullet = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    settings.image = "swag";
    settings.spriteheight = 32;
    settings.spritewidth = 32;
    this.parent(x, y, settings);

    this.updateColRect(-1, 0, 4, 24);
    this.alive = true;
    this.collidable = true;
    this.gravity = 0;
    this.direction = settings.dir;

    if (this.direction == "left"){
      this.vel.x = -6;
    }else{
      this.vel.x = 6;
    }
  },

  update: function(){
    var res = me.game.collide(this);
    if (res) {
      if (res.obj.type == me.game.ENEMY_OBJECT){
        res.obj.renderable.flicker(45);
        res.obj.alive = false;
        me.game.HUD.updateItemValue("score", 100);
      }
      if (res.obj.type !== "player") {
        me.game.remove(this);
      }
    }

    if (this.vel.x == 0) {
      me.game.remove(this);
    }

    this.updateMovement();
    return false;
  },

  onCollision: function(res, obj){
    if (obj.type !== "player") {
      me.game.remove(this);
    }
  }
});

/*--------------
a score HUD Item
--------------------- */

game.ScoreObject = me.HUD_Item.extend({
  init: function(x, y) {
      this.parent(x, y);
      this.font = new me.BitmapFont("16x16_scorefont", 16);
      this.font.set("right");
  },

  draw: function(context, x, y) {
      this.font.draw(context, "/" + this.value, this.pos.x + x, this.pos.y + y);
  }
});

