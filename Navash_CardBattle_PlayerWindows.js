/*
 *
 * Navash_CardBattle_PlayerWindows.js
 *
 * Draws and creates functionality for
 * windows related to the player.
 *
 * Author: Naveed Ashfaq
 *
 */

Window_Base.prototype.drawGaugeEx = function(dx, dy, dw, dh, rate, color1, color2) {
  var color3 = this.gaugeBackColor();
  var fillW = Math.floor(dw * rate).clamp(0, dw);
  var gaugeH = dh;
  var gaugeY = dy;

    color3.paintOpacity = this.translucentOpacity();
    this.contents.fillRect(dx, gaugeY - 1, dw, gaugeH, color3);
    fillW = Math.max(fillW - 2, 0);
    gaugeH -= 2;
    dx += 1;

  this.contents.gradientFillRect(dx, gaugeY, fillW, gaugeH, color1, color2);
};
//=============================================================================
// Window_PlayerCreatures
//=============================================================================

function Window_PlayerCreatures() {
    this.initialize.apply(this, arguments);
};

Window_PlayerCreatures.prototype = Object.create(Window_Command.prototype);
Window_PlayerCreatures.prototype.constructor = Window_PlayerCreatures;

Window_PlayerCreatures.prototype.initialize = function() {
  var w = Graphics.boxWidth * 2 / 3;
  var h = Graphics.boxHeight / 4;
  var x = Graphics.boxWidth * 1 / 6;
  var y = Graphics.boxHeight / 2;
  this._creatures = [];
  this._creaturePics = [];
  this._discardCardAnim = [];
  this._speedX = 30;
  this._speedY = 10;
	Window_Command.prototype.initialize.call(this, x, y);
  this.x = (Graphics.boxWidth - this.width)/2;
  //this.width = w;
	this.height = h;
  var textLayer = this.removeChildAt(2);
  this.addChild(textLayer);
  /*this.createPieces();
  this.allocatePieces();
	this.refresh();
	this.activate();
	this.select(0);
  */
};

Window_PlayerCreatures.prototype.drawItem = function(index) {
    //this.drawItemRect(index);
    //Window_Command.prototype.drawItem.call(this, index);
    this.clearCreaturePics(index);
    this.drawCreaturePics(index);
    this.drawCreatureDetails(index);
    this.drawStateIcons(index);
};

Window_PlayerCreatures.prototype.clearCreaturePics = function(index) {
  var creaturePics = this._creaturePics;
  if (index >= creaturePics.length) return;
  if (creaturePics[index]) this.removeChild(this._creaturePics[index]);
  //this._creaturePics = [];
};

Window_PlayerCreatures.prototype.drawCreaturePics = function(index) {
  if (index >= this._creatures.length) return;
  var creatures = this._creatures;
  var i = index;
  if (this._creaturePics[i] && this.children.contains(this._creaturePics[i])) this.removeChild(this._creaturePics[i]);
  var rect = this.itemRect(i);
  var filename = $dataEnemies[creatures[i].enemyId()].name;
  var img = ImageManager.loadPicture(filename);
  this._creaturePics[i] = new Sprite_Base();
  this._creaturePics[i].bitmap = ImageManager.loadPicture(filename);
  this._creaturePics[i].x = rect.x + this.standardPadding();
  this._creaturePics[i].y = this.standardPadding();
  this._creaturePics[i].scale.x = this.itemWidth()/108; 
  this._creaturePics[i].scale.y = this.itemHeight()/144;
  this.addChildAt(this._creaturePics[i], this.children.length - 2);
};

Window_PlayerCreatures.prototype.drawCreatureDetails = function(index) {
  if (index >= this._creatures.length) return;
  var monster = this._creatures[index];
  var hp = monster.hp;
  var atk = monster.atk;
  this.resetFontSettings();
  var rect = this.itemRect(index);
  var x = rect.x + this.textPadding();
  var y = rect.y + 0.25*this.itemHeight();
  var align = 'center';
  var maxW = this.itemWidth() - 2*this.textPadding();
  var text = "HP: " + hp;
  this.drawText(text, x, y, maxW, align);
  y += this.lineHeight();
  text = "ATK: " + atk;
  this.drawText(text, x, y, maxW, align);
};

Window_PlayerCreatures.prototype.drawStateIcons = function(index) {
  if (index >= this._creatures.length) return;
  var monster = this._creatures[index];
  var rect = this.itemRect(index);
  this.drawTopRightIcon(monster, rect);
  this.drawBottomLeftIcon(monster, rect);
  this.drawBottomRightIcon(monster, rect);
};

Window_PlayerCreatures.prototype.drawTopRightIcon = function(monster, rect) {
  var x = rect.x + rect.width - this.textPadding() - 32;
  var y = rect.y + this.textPadding();
  var sick = 14;
  var fatigued = 18;
  var ailment = this.getAilment(monster);
  var sickIcon = $dataStates[sick].iconIndex;
  var fatiguedIcon = $dataStates[fatigued].iconIndex;
  if (ailment) var ailmentIcon = ailment.iconIndex;
  if (monster.isStateAffected(sick)) this.drawIcon(sickIcon, x, y);
  else if (monster.isStateAffected(fatigued)) this.drawIcon(fatiguedIcon, x, y);
  else if (ailment) this.drawIcon(ailmentIcon, x, y);
};

Window_PlayerCreatures.prototype.drawBottomLeftIcon = function(monster, rect) {
  var x = rect.x + this.textPadding();
  var y = rect.y + rect.height - this.textPadding() - 32;
  var atkBuffIcon = 34;
  if (monster._buffs[2] > 0) this.drawIcon(atkBuffIcon, x, y);
};

Window_PlayerCreatures.prototype.drawBottomRightIcon = function(monster, rect) {
  var x = rect.x + rect.width - this.textPadding() - 32;
  var y = rect.y + rect.height - this.textPadding() - 32;
  var property = this.getProperty(monster);
  if (!property) return;
  var propertyIcon = property.iconIndex;
  if (propertyIcon) this.drawIcon(propertyIcon, x, y);
};

Window_PlayerCreatures.prototype.getAilment = function(monster) {
  var states = monster.states();
  if (!states) return;
  var affectedAilments = [];
  for (var i=0; i<states.length; i++) {
    var state = states[i];
    if (state.type == 'Ailment') affectedAilments.push(state);
  }
  if (affectedAilments.length < 1) return;
  var priority = affectedAilments.map(x => x.priority);
  var index = priority.reduce((maxIndex, x, i, arr) => x >= arr[maxIndex] ? i : maxIndex, 0);
  return affectedAilments[index];
};

Window_PlayerCreatures.prototype.getProperty = function(monster) {
  var states = monster.states();
  if (!states) return;
  var properties = [];
  for (var i=0; i<states.length; i++) {
    var state = states[i];
    if (state.type == 'Property') properties.push(state);
  }
  if (properties.length < 1) return;
  var priority = properties.map(x => x.priority);
  var index = priority.reduce((maxIndex, x, i, arr) => x >= arr[maxIndex] ? i : maxIndex, 0);
  return properties[index];
};

Window_PlayerCreatures.prototype.clearCreatureDetails = function() {
  this.contents.clear();
};

Window_PlayerCreatures.prototype.needsDiscardAnim = function() {
  return this._discardCardAnim.length > 0;
};

Window_PlayerCreatures.prototype.updateDiscardMovement = function(index) {
  this.deactivate();
  var sprite = this._creaturePics[index];
  var destX = SceneManager._scene._playerGraveyardWindow.x - this.x;
  var destY = SceneManager._scene._playerGraveyardWindow.y - this.y;
  if (sprite.x > destX && sprite.y < destY) {
    sprite.x += this._speedX;
    sprite.y += this._speedY;
  } else {
    var card = $dataItems[this._creatures[index]._enemyId];
    SceneManager._scene._playerHand._graveyard.push(card);
    this._creatures.splice(index, 1);
    if (SceneManager._scene.getPreviousWindow() == this) this.activate();
    this._discardCardAnim.pop();
    SceneManager._scene.refreshWindows();
    //SceneManager._scene._deckWindow.refresh();
  }
};

Window_PlayerCreatures.prototype.discard = function(index) {
  if (this._creatures[index] === undefined) return;
  this.clearCreatureDetails();
  var srcX = this._creaturePics[index].x;
  var srcY = this._creaturePics[index].y;
  var destX = SceneManager._scene._playerGraveyardWindow.x - this.x;
  var destY = SceneManager._scene._playerGraveyardWindow.y - this.y;
  this._speedX = (destX - srcX) / 12;
  this._speedY = (destY - srcY) / 12;
  this._discardCardAnim.push(index);
};

Window_PlayerCreatures.prototype.windowWidth = function() {
    //var dim = this.maxCols();
    //dim = dim.clamp(1, 5);
    //return dim * this.itemWidth() + 2 * this.standardPadding() + this.spacing() * (dim-1);
    return 624;
};

Window_PlayerCreatures.prototype.maxCols = function() {
    return 5;
};

Window_PlayerCreatures.prototype.spacing = function() {
    return 12;
};

Window_PlayerCreatures.prototype.itemWidth = function() {
  return 108;
};

Window_PlayerCreatures.prototype.itemHeight = function() {
    return this.height - this.standardPadding() * 2;
};

Window_PlayerCreatures.prototype.itemTextAlign = function() {
    return 'center';
};

Window_PlayerCreatures.prototype.makeCommandList = function(index) {
		for (var i = 0; i < 5; ++i) {
			var keyName = i.toString();
			var enabled = this.isKeyEnabled(i);
			this.addCommand(keyName, 'ok', enabled);
		}
};

Window_PlayerCreatures.prototype.add = function(card) {
  //var creature = $dataEnemies[card.id];
  var creature = new Game_Enemy(card.id, 0, 0);
  creature._tag = 'player';
  this._creatures.push(creature);
  this.refresh();
};

/*Window_PlayerCreatures.prototype.processOk = function() {
    if (this.isCurrentItemEnabled()) {
        //this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    } else {
        this.playBuzzerSound();
    }
};*/

Window_PlayerCreatures.prototype.isKeyEnabled = function(index) {
  var creatureLength = this._creatures.length;
  if (index < creatureLength) return true;
	return false;
};

Window_PlayerCreatures.prototype.drawItemRect = function(index) {
		var rect = this.itemRect(index);
		var color = this.gaugeBackColor();
		this.drawRect(rect.x+1, rect.y+1, rect.width-2, rect.height-2, color);
};

Window_PlayerCreatures.prototype.drawRect = function(dx, dy, dw, dh, color) {
    this.changePaintOpacity(false);
    this.contents.fillRect(dx, dy, dw, dh, color);
    this.changePaintOpacity(true);
};

Window_PlayerCreatures.prototype.cursorDown = function(wrap) {
    //var index = this.index();
    this.deactivate();
    this.deselect();
    SceneManager._scene._playerHand.activate();
    SceneManager._scene._playerHand.reselect();
};

Window_PlayerCreatures.prototype.cursorUp = function(wrap) {
    var index = this.index();
    this.deactivate();
    this.deselect();
    SceneManager._scene._enemyCreatures.activate();
    SceneManager._scene._enemyCreatures.select(index);
};

Window_PlayerCreatures.prototype.cursorRight = function(wrap) {
    var index = this.index();
    if (index == 4) {
    this.deactivate();
    this.deselect();
    SceneManager._scene._player.activate();
    SceneManager._scene._player.select(0);
    } else {
    Window_Command.prototype.cursorRight.call(this, wrap);
    }
};

//=============================================================================
// Window_PlayerHand
//=============================================================================

function Window_PlayerHand() {
    this.initialize.apply(this, arguments);
};

Window_PlayerHand.prototype = Object.create(Window_Command.prototype);
Window_PlayerHand.prototype.constructor = Window_PlayerHand;

Window_PlayerHand.prototype.initialize = function() {
  var h = Graphics.boxHeight / 4;
  var x = Graphics.boxWidth * 1 / 6;
  var y = Graphics.boxHeight * 3 / 4;
  this._hand = [];
  this._deck = [];
  this._handPic = [];
  this._graveyard = [];
  this._discardCardAnim = [];
  this._sp = 0;
  this.createDeck();
  this.shuffleDeck();
  this.drawInitialHand();
  Window_Command.prototype.initialize.call(this, x, y);
  this.height = h;
  this.opacity = 0;
  //this.drawHandCards();
  //this.width = w;
  this.refresh();
};

Window_PlayerHand.prototype.sp = function() {
  return this._sp;
};

Window_PlayerHand.prototype.addSp = function(value) {
  this._sp += Math.floor(value);
  this._sp = Math.max(0, this._sp);
  this.refresh();
  SceneManager._scene._player.refresh();
};

Window_PlayerHand.prototype.reselect = function() {
  var index = this._index;
  index = index.clamp(0, this.maxCols()-1);
  this.select(index);
};

Window_PlayerHand.prototype.refresh = function() {
  this.width = this.windowWidth();
  this.x = (Graphics.boxWidth - this.width)/2;
  this.clearHand();
  Window_Command.prototype.refresh.call(this);
  this.drawHandCards();
};

Window_PlayerHand.prototype.updateSelection = function() {
  var index = this.index();
  var baseScaleX = this.getBaseScaleX();
  var baseScaleY = this.getBaseScaleY();
  for (var i=0; i<this._handPic.length; i++) {
    var baseX = this.getBaseX(i);
    var baseY = this.getBaseY(i);
    var layer = this.children.indexOf(this._handPic[i]);
    if (i == index) {
      this._handPic[i].x = baseX - 0.05*this.itemWidth();
      this._handPic[i].y = baseY - 0.05*this.itemHeight();
      this._handPic[i].scale.x = baseScaleX * 1.1;
      this._handPic[i].scale.y = baseScaleY * 1.1;
      if (layer != this.children.length - 1) {
        this.children.splice(layer, 1);
        this.addChild(this._handPic[i]);
      }
    } else {
      this._handPic[i].x = baseX + 0.05*this.itemWidth();
      this._handPic[i].y = baseY + 0.05*this.itemHeight();
      this._handPic[i].scale.x = baseScaleX * 0.9;
      this._handPic[i].scale.y = baseScaleY * 0.9;
      var baseIndex = 6+i;
      if (layer != baseIndex) {
        this.children.splice(layer, 1);
        this.children.splice(baseIndex-1, 0, this._handPic[i]);
      }
    }
  }
};

Window_PlayerHand.prototype.updateDrawMovement = function() {
  this.deactivate();
  if (!this._newCard || this.children.indexOf(this._newCard) < 0) {
  var img = ImageManager.loadPicture('Deck_Back');
  this._newCard = this._newCard || new Sprite(img);
  if (this.children.indexOf(this._newCard) < 0) {
    this.addChild(this._newCard);
  }
  }
  if (!this._moveStarted) {
    this._newCard.x = SceneManager._scene._deckWindow.x + this.standardPadding() - this.x;
    this._newCard.y = this.standardPadding();
  }
  this._moveStarted = true;
  var speed = 10;
  var maxIndex = this._hand.length - 1;
  var dest = this.windowWidth() + this.spacing() - this.standardPadding();
  if (this._newCard.x > dest) {
    this._newCard.x -= speed;
  } else {
    if (SceneManager._scene.getPreviousWindow() == this) this.activate();
    this._moveStarted = false;
    this.removeChild(this._newCard);
    this._newCard = undefined;
    this._drawCardAnim = false;
    this.refresh();
    this.drawCard(--this._drawNum);
  }
};

Window_PlayerHand.prototype.needsDiscardAnim = function() {
  return this._discardCardAnim.length > 0;
};

Window_PlayerHand.prototype.updateDiscardMovement = function(index) {
  this.deactivate();
  var sprite = this._handPic[index];
  var speed = 30;
  var dest = SceneManager._scene._playerGraveyardWindow.x - this.x;
  if (sprite.x > dest) {
    sprite.x -= speed;
  } else {
    this._graveyard.push(this._hand[index]);
    this._hand.splice(index, 1);
    if (SceneManager._scene.getPreviousWindow() == this) this.activate();
    this._discardCardAnim.pop();
    SceneManager._scene.refreshWindows();
    //SceneManager._scene._deckWindow.refresh();
  }
};

Window_PlayerHand.prototype.getBaseScaleX = function() {
  return this.itemWidth()/108;
};

Window_PlayerHand.prototype.getBaseScaleY = function() {
  return this.itemHeight()/144;
};

Window_PlayerHand.prototype.getBaseX = function(index) {
  var rect = this.itemRect(index);
  return rect.x + this.standardPadding();
};

Window_PlayerHand.prototype.getBaseY = function(index) {
  return this.standardPadding();
};

Window_PlayerHand.prototype.drawInitialHand = function() {
  var drawNum = 7;
  for (var i=0; i<drawNum; i++) {
    this._hand[i] = this._deck[this._deck.length - 1];
    this._deck.pop();
  }
  SceneManager._scene.refreshWindows();
};

Window_PlayerHand.prototype.drawHandCards = function() {
  var hand = this._hand;
  for (var i=0; i<hand.length; i++) {
    var rect = this.itemRect(i);
    var filename = this._hand[i].name;
    var img = ImageManager.loadPicture(filename);
    this._handPic[i] = new Sprite(img);
    this._handPic[i].x = rect.x + this.standardPadding();
    this._handPic[i].y = this.standardPadding();
    this._handPic[i].scale.x = this.itemWidth()/108; 
    this._handPic[i].scale.y = this.itemHeight()/144;
    this.addChild(this._handPic[i]);
  }
};

Window_PlayerHand.prototype.clearHand = function() {
  var handPics = this._handPic;
  for (var i=0; i<handPics.length; i++) {
    if (handPics[i]) this.removeChild(this._handPic[i]);
  }
  this._handPic = [];
};

Window_PlayerHand.prototype.createDeck = function() {
  for (var i=0; i<60; i++) {
    var id = (i%10) + 1;
    var card = $dataItems[id];
    if (card.type === 'Nexus') this.makeNexusCard(card);
    else this._deck.push(card);
  }
  SceneManager._scene.refreshWindows();
};

Window_PlayerHand.prototype.makeNexusCard = function(card) {
  var monster = new Game_Enemy(card.id, 0, 0);
  this._nexusCard = monster;
  this._sp = card.sp;
};

Window_PlayerHand.prototype.shuffleDeck = function() {
  var deck = [];
  for (var i=0; i<this._deck.length; i++) {
    deck[i] = this._deck[i];
  }
  var maxLength = deck.length;
  for (var i=0; i<maxLength; i++) {
    var rand = Math.floor(Math.random() * deck.length);
    this._deck[i] = deck[rand];
    deck.splice(rand, 1);
  }
};

Window_PlayerHand.prototype.windowWidth = function() {
    var dim = this.maxCols();
    dim = dim.clamp(1, 5);
    return dim * this.itemWidth() + 2 * this.standardPadding() + this.spacing(true) * (dim-1);
};

Window_PlayerHand.prototype.maxCols = function() {
    return Math.max(1, this._hand.length);
};

Window_PlayerHand.prototype.spacing = function(forcePositive) {
    if (forcePositive === undefined) forcePositive = false;
    if (forcePositive) return 5;
    if (this._hand.length > 5) {
      var w = this.windowWidth() - 2 * this.standardPadding();
      var iW = this.itemWidth();
      var n = this._hand.length;
      //return (w - n * iW)/(2 * n - 2);
      return (w - n * iW)/(n-1);
    } else {
      return 5;
    }
};

Window_PlayerHand.prototype.itemWidth = function() {
  return 108;
};

Window_PlayerHand.prototype.itemHeight = function() {
    return this.height - 2 * this.standardPadding();
};

Window_PlayerHand.prototype.itemTextAlign = function() {
    return 'center';
};

Window_PlayerHand.prototype.drawItem = function() {

};

Window_PlayerHand.prototype.makeCommandList = function(index) {
    for (var i = 0; i < this.maxCols(); ++i) {
      var keyName = i.toString();
      var enabled = this._hand.length > 0;
      this.addCommand(keyName, 'ok', enabled);
    }
};

/*Window_PlayerCreatures.prototype.processOk = function() {
    if (this.isCurrentItemEnabled()) {
        //this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    } else {
        this.playBuzzerSound();
    }
};*/

Window_PlayerHand.prototype.isKeyEnabled = function(keyName) {
  return true;
};

Window_PlayerHand.prototype.discard = function(index) {
  if (this._hand[index] === undefined) return;
  this._discardCardAnim.push(index);

  //this._graveyard.push(this._hand[index]);
  //this._hand.splice(index, 1);

  //SceneManager._scene.refreshWindows();
};

Window_PlayerHand.prototype.drawCard = function(n) {
  if (this._deck.length <= 0) return;
  this._drawNum = n;
  if (n <= 0) return;
  this._hand.push(this._deck[this._deck.length-1]);
  this._drawCardAnim = true;
  this._deck.pop();
};

Window_PlayerHand.prototype.cursorUp = function(wrap) {
    var index = this.index();
    var maxIndex = this.maxCols();
    var divIndex = maxIndex/5;
    index = Math.round(index/divIndex);
    //var cLength = SceneManager._scene._playerCreatures._creatures.length;
    var cLength = 4;
    index = index.clamp(0, cLength);
    this.deactivate();
    //this.deselect();
    SceneManager._scene._playerCreatures.activate();
    SceneManager._scene._playerCreatures.select(index);
};

Window_PlayerHand.prototype.cursorLeft = function(wrap) {
    var index = this.index();
    if (index > 0) Window_Command.prototype.cursorLeft.call(this, wrap);
    else {
      this.deactivate();
      this.deselect();
      SceneManager._scene._playerGraveyardWindow.activate();
      SceneManager._scene._playerGraveyardWindow.select(0);
    }
};

//=============================================================================
// Window_PlayerDeck
//=============================================================================

function Window_Deck() {
    this.initialize.apply(this, arguments);
};

Window_Deck.prototype = Object.create(Window_Base.prototype);
Window_Deck.prototype.constructor = Window_Deck;

Window_Deck.prototype.initialize = function() {
  var w = 108 + this.standardPadding() * 2;
  var h = Graphics.boxHeight / 4;
  var x = Graphics.boxWidth - w - this.standardPadding();
  var y = Graphics.boxHeight - h;
  Window_Base.prototype.initialize.call(this, x, y, w, h);
  //this.opacity = 0;
  this._deckBack = new Sprite();
  this.drawDeckBack();
};

Window_Deck.prototype.refresh = function() {
  this.contents.clear();
  this.drawDeckBack();
};

Window_Deck.prototype.drawDeckBack = function() {
  var filename = this.getFileName();
  var img = ImageManager.loadPicture(filename);
  this._deckBack.bitmap = img;
  this._deckBack.x = this.standardPadding();
  this._deckBack.y = this.standardPadding();
  this.addChild(this._deckBack);
};

Window_Deck.prototype.getFileName = function() {
  if (!SceneManager._scene._playerHand) return 'Deck_Back';
  var length = SceneManager._scene._playerHand._deck.length;
  if (length == 0) return 'Deck_Back_Empty';
  if (length <= 10) return 'Deck_Back';
  if (length <= 25) return 'Deck_Back_Low';
  if (length <= 40) return 'Deck_Back_High';
  return 'Deck_Back_Full';
};

//=============================================================================
// Window_PlayerGraveyard
//=============================================================================

function Window_PlayerGraveyard() {
    this.initialize.apply(this, arguments);
};

Window_PlayerGraveyard.prototype = Object.create(Window_Command.prototype);
Window_PlayerGraveyard.prototype.constructor = Window_PlayerGraveyard;

Window_PlayerGraveyard.prototype.initialize = function() {
  var h = Graphics.boxHeight / 4;
  var x = this.standardPadding();
  var y = Graphics.boxHeight * 3 / 4;
  this._topImg = new Sprite();
  Window_Command.prototype.initialize.call(this, x, y);
  this.height = h;
  this._topImg.x = this.standardPadding();
  this._topImg.y = this.standardPadding();
  this._topImg.scale.x = this.itemWidth()/108; 
  this._topImg.scale.y = this.itemHeight()/144;
  //this.addChild(this._topImg);
  this.opacity = 0;
};

Window_PlayerGraveyard.prototype.windowWidth = function() {
  return this.itemWidth() + this.standardPadding() * 2;
};

Window_PlayerGraveyard.prototype.itemWidth = function() {
  return 108;
};

Window_PlayerGraveyard.prototype.itemHeight = function() {
  return this.height - 2 * this.standardPadding();
};

Window_PlayerGraveyard.prototype.maxCols = function() {
  return 1;
};

Window_PlayerGraveyard.prototype.makeCommandList = function() {
  this.addCommand('Graveyard', 'ok', this.isCommandAvailable());
};

Window_PlayerGraveyard.prototype.isCommandAvailable = function() {
  if (!SceneManager._scene._playerHand) return false;
  if (SceneManager._scene._playerHand._graveyard.length < 1) return false;
  return true;
};

Window_PlayerGraveyard.prototype.drawItem = function() {
  this.removeChild(this._topImg);
  if (!SceneManager._scene._playerHand) return;
  var grave = SceneManager._scene._playerHand._graveyard;
  if (grave.length < 1) return;
  var item = grave[grave.length-1];
  var filename = item.name;
  var img = ImageManager.loadPicture(filename);
  this._topImg.bitmap = img;
  this.addChild(this._topImg);
};

Window_PlayerGraveyard.prototype.cursorLeft = function(wrap) {
    this.deactivate();
    this.deselect();
    var cardLength = SceneManager._scene._playerHand._hand.length;
    var selection = cardLength - 1;
    //selection += (cardLength > 1)? 1 : 0;
    SceneManager._scene._playerHand.activate();
    SceneManager._scene._playerHand.select(selection);
};

Window_PlayerGraveyard.prototype.cursorRight = function(wrap) {
    this.deactivate();
    this.deselect();
    //var cardLength = SceneManager._scene._playerHand._hand.length;
    //var selection = (cardLength > 1)? -1 : 0;
    SceneManager._scene._playerHand.activate();
    SceneManager._scene._playerHand.select(0);
};

/*Window_PlayerGraveyard.prototype.getFileName = function() {
  if (!SceneManager._scene._playerHand) return 'Deck_Back';
  var length = SceneManager._scene._playerHand._deck.length;
  if (length == 0) return 'Deck_Back_Empty';
  if (length <= 10) return 'Deck_Back';
  if (length <= 25) return 'Deck_Back_Low';
  if (length <= 40) return 'Deck_Back_High';
  return 'Deck_Back_Full';
};
*/


//=============================================================================
// Window_PlayerGraveyardSelection
//=============================================================================

function Window_PlayerGraveyardSelection() {
    this.initialize.apply(this, arguments);
};

Window_PlayerGraveyardSelection.prototype = Object.create(Window_Command.prototype);
Window_PlayerGraveyardSelection.prototype.constructor = Window_PlayerGraveyardSelection;

Window_PlayerGraveyardSelection.prototype.initialize = function() {
  var h = Graphics.boxHeight;
  var x = 0;
  var y = 0;
  this._retrieve = false;
  this._prevWindow;
  this._group = 'player';
  //this._graveyardSelection = SceneManager._scene._playerHand._graveyard;
  Window_Command.prototype.initialize.call(this, x, y);
  this.height = h;
};

Window_PlayerGraveyardSelection.prototype.windowWidth = function() {
  return Graphics.boxWidth / 2;
};

Window_PlayerGraveyardSelection.prototype.maxCols = function() {
  return 1;
};

Window_PlayerGraveyardSelection.prototype.setRetrieve = function(value) {
  this._retrieve = value;
};

Window_PlayerGraveyardSelection.prototype.setPrevWindow = function(prevWindow) {
  this._prevWindow = prevWindow;
};

Window_PlayerGraveyardSelection.prototype.setGroup = function(group) {
  this._group = group;
  this.refresh();
};

Window_PlayerGraveyardSelection.prototype.makeCommandList = function() {
  var grave;
  switch (this._group) {
    case 'player':
      grave = SceneManager._scene._playerHand._graveyard;
      break;
    case 'enemy':
      grave = SceneManager._scene._enemyHand._graveyard;
      break;
    default:
      grave = SceneManager._scene._playerHand._graveyard;
      break;
  }
  for (var i=grave.length-1; i>=0; i--) {
    var cmdName = grave[i].name;
    this.addCommand(cmdName, 'ok', true);
  }
  this.addCommand('Cancel', 'cancel', true);
};

//=============================================================================
// Window_Player
//=============================================================================

function Window_Player() {
    this.initialize.apply(this, arguments);
};

Window_Player.prototype = Object.create(Window_Command.prototype);
Window_Player.prototype.constructor = Window_Player;

Window_Player.prototype.initialize = function(x, y) {
  this._sX = x;
  this._hpImg = new Sprite();
  this._spImg = new Sprite();
  this._abilityImg = new Sprite();
  this._nexusCard = SceneManager._scene._playerHand._nexusCard;
  this._usedAbility = false;
  var h = Graphics.boxHeight/4;
  Window_Command.prototype.initialize.call(this, x, y);
  this.height = h;
  //this.drawActorFace($gameActors.actor(1), 0, 0, 144, 144);
  this.refresh();
};

Window_Player.prototype.windowWidth = function() {
  return Graphics.boxWidth - this._sX - this.standardPadding();
};

Window_Player.prototype.maxCols = function() {
  return 1;
};

Window_Player.prototype.maxItems = function() {
  return 1;
};

Window_Player.prototype.makeCommandList = function() {
  this.addCommand('Ok', 'ok', true);
};

Window_Player.prototype.itemWidth = function() {
  return this.windowWidth() - 2*this.standardPadding();
};

Window_Player.prototype.itemHeight = function() {
  return this.height - 2*this.standardPadding();
};

Window_Player.prototype.drawItem = function(index) {
  this.removeAllChilds();
  this.drawActor();
  this.drawContents();
  //this.drawSp();
  //this.drawAbility();
};

Window_Player.prototype.removeAllChilds = function() {
  this.removeChild(this._hpImg);
  this.removeChild(this._spImg);
  this.removeChild(this._abilityImg);
};

Window_Player.prototype.drawActor = function() {
  var actor = $gameActors.actor(1);
  var faceName = actor.faceName();
  var faceIndex = actor.faceIndex();
  var x = 0, y = 0;
  var w = 144, h = 144;
  this.drawFace(faceName, faceIndex, x, y, w, h);
};

Window_Player.prototype.drawContents = function() {
  var filename = 'HP';
  var img = ImageManager.loadPicture(filename);
  var x = 144 + this.textPadding() + this.standardPadding();
  var y = this.standardPadding();
  this._hpImg.bitmap = img;
  this._hpImg.x = x;
  this._hpImg.y = y;
  this.addChild(this._hpImg);
  var w = this.windowWidth() - x - 2 * this.standardPadding();
  var hp = this._nexusCard.hp;
  this.drawText(hp, x+0.5*w-10, y-this.standardPadding(), 0.25*w, 'right');
  this.drawIcon(247, x+0.75*w-8, y-this.standardPadding());
  y += this.lineHeight();
  this.drawHpGauge(x-10, y-this.lineHeight()/2, w, 22);
  y += this.lineHeight();
  this.drawSp(x, y);
};

Window_Player.prototype.drawHpGauge = function(x, y, w, h) {
  var nexus = this._nexusCard;
  var rate = nexus.hp/nexus.mhp;
  var color1 = this.textColor(11);
  var color2 = this.textColor(3);
  this.drawGaugeEx(x, y, w, h, rate, color1, color2);
};

Window_Player.prototype.drawSp = function(x, y) {
  var filename = 'SP';
  var img = ImageManager.loadPicture(filename);
  this._spImg.bitmap = img;
  this._spImg.x = x;
  this._spImg.y = y;
  this.addChild(this._spImg);
  var w = this.windowWidth() - x - 2 * this.standardPadding();
  var sp = SceneManager._scene._playerHand.sp();
  this.drawText(sp, x+0.5*w-10, y-this.standardPadding(), 0.25*w, 'right');
  this.drawIcon(248, x+0.75*w-8, y-this.standardPadding());
  y += this.lineHeight() + this.textPadding();
  x += this.standardPadding();
  this.drawAbility(x, y);
};

Window_Player.prototype.drawAbility = function(x, y) {
  this.removeChild(this._abilityImg);
  var not = (this._usedAbility)? 'Not_' : '';
  var filename = 'Ability_Available';
  filename = not + filename;
  this._abilityImg.bitmap = ImageManager.loadPicture(filename);
  this._abilityImg.x = x;
  this._abilityImg.y = y;
  this.addChild(this._abilityImg);
};

Window_Player.prototype.lineHeight = function() {
  return 30;
};

Window_Player.prototype.cursorLeft = function(wrap) {
  this.deactivate();
  this.deselect();
  SceneManager._scene._playerCreatures.activate();
  SceneManager._scene._playerCreatures.select(4);
};

Window_Player.prototype.cursorUp = function(wrap) {
  var index = this.index();
  this.deactivate();
  this.deselect();
  //SceneManager._scene._enemy.setCursorFixed(true);
  SceneManager._scene._enemy.activate();
  SceneManager._scene._enemy.select(index);
  //SceneManager._scene._enemy.setCursorFixed(false);
};

Window_Player.prototype.cursorDown = function(wrap) {
  this.deactivate();
  this.deselect();
  SceneManager._scene._playerHand.activate();
  SceneManager._scene._playerHand.reselect();
};
//Window_Player.prototype.standardPadding = function() {
//  return 0;
//};
