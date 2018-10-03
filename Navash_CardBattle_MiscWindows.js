/*
 *
 * Navash_CardBattle_MiscWindows.js
 *
 * Draws and creates functionality for miscellaneous
 * windows, usually meant for command selection.
 *
 * Author: Naveed Ashfaq
 *
 */

//=============================================================================
// Window_CardSelection
//=============================================================================

function Window_CardSelection() {
    this.initialize.apply(this, arguments);
};

Window_CardSelection.prototype = Object.create(Window_Command.prototype);
Window_CardSelection.prototype.constructor = Window_CardSelection;

Window_CardSelection.prototype.initialize = function() {
  //var h = Graphics.boxHeight;
  var x = 0;
  var y = 0;
  this._selection = 'hand';
  this._card;
  this._cardIndex = 0;
  this._cardImage = new Sprite();
  //this._graveyardSelection = SceneManager._scene._playerHand._graveyard;
  Window_Command.prototype.initialize.call(this, x, y);
  this.height = this.maxItems() * this.lineHeight() + 2 * this.standardPadding();
};

Window_CardSelection.prototype.refresh = function(x, y, obj, absY, index) {
  if (index) this._cardIndex = index;
  if (obj) this._card = obj;
  Window_Command.prototype.refresh.call(this);
  this.height = this.maxItems() * this.lineHeight() + 2 * this.standardPadding();
  Window_Command.prototype.refresh.call(this);
  if (x) this.x = x;
  if (y) {
    if (absY) this.y = y;
    else this.y = y - this.height;
  }
  this._cardImage.x = 478 - this.x;
  this._cardImage.y = 144 - this.y;
};

Window_CardSelection.prototype.card = function() {
  return this._card;
};

Window_CardSelection.prototype.selectionType = function() {
  return this._selection;
};

Window_CardSelection.prototype.setSelectionType = function(type) {
  this._selection = type;
};

Window_CardSelection.prototype.isCreature = function() {
  return (this._selection != 'hand');
};

Window_CardSelection.prototype.isNexus = function() {
  return (this._selection === 'player' || this._selection === 'enemy');
};

//Window_CardSelection.prototype.windowWidth = function() {
//  return this.itemWidth() + 2 * this.standardPadding();
//};

Window_CardSelection.prototype.maxCols = function() {
  return 1;
};

Window_CardSelection.prototype.makeCommandList = function() {
  switch (this.selectionType()) {
    case 'hand':
      this.makeHandCommands();
      break;
    case 'playerCreature':
    case 'playerCreatures':
      this.makePlayerCreatureCommands();
      break;
    case 'enemyCreature':
    case 'enemyCreatures':
      this.makeEnemyCreatureCommands();
      break;
    case 'player':
      this.makePlayerCommands();
      break;
    case 'enemy':
      this.makeEnemyCommands();
      break;
    default:
      break;
  }
  this.addCommand('Cancel', 'cancel', true);
};

Window_CardSelection.prototype.makeHandCommands = function() {
  this.addCommand('Use', 'ok', this.canUse(this.card()));
  this.addCommand('Check', 'check', true);
};

Window_CardSelection.prototype.makePlayerCreatureCommands = function() {
  this.addCommand('Attack', 'attack', this.canAttack());
  this.addCommand('Check', 'check', true);
};

Window_CardSelection.prototype.makeEnemyCreatureCommands = function() {
  this.addCommand('Check', 'check', true);
};

Window_CardSelection.prototype.makePlayerCommands = function() {
  this.addCommand('Use Ability', 'ability', this.canUse(this.card()));
  this.addCommand('Check Nexus', 'check', true);
};

Window_CardSelection.prototype.makeEnemyCommands = function() {
  this.addCommand('Check Nexus', 'check', true);
};

Window_CardSelection.prototype.canUse = function(card) {
  if (!card) return false;
  if (this.isCreature()) card = $dataItems[card._enemyId];
  if (card.cost > SceneManager._scene._playerHand._sp) return false;
  switch (card.type) {
    case 'creature':
    case 'Creature':
      return this.processCanCreatureUse(card);
      break;
    case 'spell':
    case 'Spell':
      return this.processCanSpellUse(card);
      break;
    case 'nexus':
    case 'Nexus':
      return this.processCanNexusUse(card);
      break;
    default:
      return false;
      break;
  }
};

Window_CardSelection.prototype.canAttack = function(card) {
  var scene = SceneManager._scene;
  var enemyCreatures = scene._enemyCreatures._creatures;
  var monsterIndex = scene._playerCreatures.index();
  var monster = scene._playerCreatures._creatures[monsterIndex];
  if (!monster.canMove()) return false;
  if (monster.isStateAffected(12) && enemyCreatures.length < 1) return false;
  if (monster.isStateAffected(14)) return false;
  if (monster._attackCount < 1) return false;
  return true;
};

Window_CardSelection.prototype.processCanCreatureUse = function(card) {
  var condition = true;
  if (card.requirementEval !== '') {
    var handWindow = SceneManager._scene._playerHand;
    var enemyHandWindow = SceneManager._scene._enemyHand;
    var creatures = SceneManager._scene._playerCreatures._creatures;
    var hand = handWindow._hand;
    var enemyHand = enemyHandWindow._hand;
    var deck = handWindow._deck;
    var enemyDeck = enemyHandWindow._deck; 
    var graveyard = handWindow._graveyard;
    var enemyGraveyard = enemyHandWindow._graveyard;
    var enemyCreatures = SceneManager._scene._enemyCreatures._creatures;
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    var code = card.requirementEval;
    try {
      eval(code);
    } catch (e) {
      console.log("Error in Card Require Eval");
    }
  }
  if (SceneManager._scene._playerCreatures._creatures.length >= 5) condition = false;
  return condition;
};

Window_CardSelection.prototype.processCanSpellUse = function(card) {
  var condition = true;
  if (card.requirementEval !== '') {
    var handWindow = SceneManager._scene._playerHand;
    var enemyHandWindow = SceneManager._scene._enemyHand;
    var creatures = SceneManager._scene._playerCreatures._creatures;
    var hand = handWindow._hand;
    var enemyHand = enemyHandWindow._hand;
    var deck = handWindow._deck;
    var enemyDeck = enemyHandWindow._deck; 
    var graveyard = handWindow._graveyard;
    var enemyGraveyard = enemyHandWindow._graveyard;
    var enemyCreatures = SceneManager._scene._enemyCreatures._creatures;
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    var code = card.requirementEval;
    try {
      eval(code);
    } catch (e) {
      console.log("Error in Card Require Eval");
    }
  }
  return condition;
};

Window_CardSelection.prototype.processCanNexusUse = function(card) {
  var condition = this.processCanSpellUse(card);
  if (SceneManager._scene._player._usedAbility) condition = false;
  return condition;
};

//=============================================================================
// Window_PlayerGraveyardInfo
//=============================================================================

function Window_PlayerGraveyardInfo() {
    this.initialize.apply(this, arguments);
};

Window_PlayerGraveyardInfo.prototype = Object.create(Window_Base.prototype);
Window_PlayerGraveyardInfo.prototype.constructor = Window_PlayerGraveyardInfo;

Window_PlayerGraveyardInfo.prototype.initialize = function(x, y, width, height) {
  Window_Base.prototype.initialize.call(this, x, y, width, height);
};


//=============================================================================
// Window_DummyWindow
//=============================================================================


function Window_DummyWindow() {
    this.initialize.apply(this, arguments);
};

Window_DummyWindow.prototype = Object.create(Window_Command.prototype);
Window_DummyWindow.prototype.constructor = Window_DummyWindow;

Window_DummyWindow.prototype.initialize = function() {
  //var h = Graphics.boxHeight;
  var x = 0;
  var y = 0;
  this._selection = 'player';
  this._card;
  //this._graveyardSelection = SceneManager._scene._playerHand._graveyard;
  Window_Command.prototype.initialize.call(this, x, y);
  this.height = Graphics.boxHeight / 4;
  this.opacity = 0;
  this.contentsOpacity = 0;
};

Window_DummyWindow.prototype.maxCols = function() {
  var selection = this.selectionType();
  var playerCreatures = SceneManager._scene._playerCreatures._creatures.length;
  var enemyCreatures = SceneManager._scene._enemyCreatures._creatures.length;
  var cols = 1;
  switch (selection) {
    case 'player':
      cols = playerCreatures;
      break;
    case 'enemy':
      cols = enemyCreatures;
      break;
    case 'all':
      cols = Math.max(playerCreatures, enemyCreatures);
      break;
    default:
      cols = playerCreatures;
      break;
  }
  return Math.max(1, cols);
};

Window_DummyWindow.prototype.selectionType = function() {
  return this._selection;
};

Window_DummyWindow.prototype.setSelectionType = function(type) {
  this._selection = type;
};

Window_DummyWindow.prototype.refresh = function(x, y, obj) {
  if (obj) this._card = obj;
  Window_Command.prototype.refresh.call(this);
  if (x) this.x = x;
  if (y) this.y = y;
};

Window_DummyWindow.prototype.itemWidth = function() {
  return 108;
};

Window_DummyWindow.prototype.itemHeight = function() {
  return 144;
};

Window_DummyWindow.prototype.windowWidth = function() {
  return 624;
};

Window_DummyWindow.prototype.spacing = function() {
  return 12;
};

Window_DummyWindow.prototype.makeCommandList = function() {
    for (var i = 0; i < this.maxCols(); ++i) {
      var keyName = '';
      var enabled = this.isKeyEnabled(i);
      this.addCommand(keyName, 'ok', enabled);
    }
};

Window_DummyWindow.prototype.isKeyEnabled = function(index) {
  //return true;
  var selectionType = this.selectionType();
  if (selectionType === 'player') var card = SceneManager._scene._playerCreatures._creatures[index];
  else if (selectionType === 'enemy') var card = SceneManager._scene._enemyCreatures._creatures[index];
  var playingCard = this._card;
  if (!playingCard || !card) return false;
  return this.processCardSpecialTargets(card, playingCard);
};

Window_DummyWindow.prototype.processCardSpecialTargets = function(target, card) {
  var condition = true;
  if (this.selectionType() === 'enemy' && card.type === 'Creature') {
    var userIndex = SceneManager._scene._playerCreatures.index();
    var user = SceneManager._scene._playerCreatures._creatures[userIndex];
  }
  if (card.specialTargetEval !== '') {
    var handWindow = SceneManager._scene._playerHand;
    var enemyHandWindow = SceneManager._scene._enemyHand;
    var creatures = SceneManager._scene._playerCreatures._creatures;
    var hand = handWindow._hand;
    var enemyHand = enemyHandWindow._hand;
    var deck = handWindow._deck;
    var enemyDeck = enemyHandWindow._deck; 
    var graveyard = handWindow._graveyard;
    var enemyGraveyard = enemyHandWindow._graveyard;
    var enemyCreatures = SceneManager._scene._enemyCreatures._creatures;
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    var code = card.specialTargetEval;
    try {
      eval(code);
    } catch (e) {
      console.log("Error in Card Special Target Eval");
    }
  }
  if (this.selectionType() === 'enemy' && card.type === 'Creature') {
    if (user.isStateAffected(11)) condition = false;
    if (SceneManager._scene.anyDefenderPresent('enemy') && !user.isStateAffected(16) && !target.isStateAffected(15)) condition = false;
  }
  return condition;
};

Window_DummyWindow.prototype.cursorRight = function(wrap) {
  if (this.selectionType() === 'enemy' && this.index() === this.maxCols()-1 && SceneManager._scene._selectionWindow.isCreature()) {
    this.deactivate();
    SceneManager._scene._dummyEnemy.activate();
    SceneManager._scene._dummyEnemy.select(0);
  } else {
    Window_Command.prototype.cursorRight.call(this, wrap);
  }
};

//=============================================================================
// Window_DummyEnemy
//=============================================================================

function Window_DummyEnemy() {
    this.initialize.apply(this, arguments);
};

Window_DummyEnemy.prototype = Object.create(Window_Command.prototype);
Window_DummyEnemy.prototype.constructor = Window_DummyEnemy;

Window_DummyEnemy.prototype.initialize = function(x, y) {
  this._sX = x;
  this._enemy = SceneManager._scene._enemy._nexusCard; // Game_Enemy
  this._nexusCard = this._enemy;
  //this._attackingCreature;
  var h = Graphics.boxHeight/4;
  Window_Command.prototype.initialize.call(this, x, y);
  this.height = h;
  this.opacity = 0;
  this.contentsOpacity = 0;
};

Window_DummyEnemy.prototype.refresh = function() {
  var attackIndex = SceneManager._scene._playerCreatures.index();
  this._attackingCreature = SceneManager._scene._playerCreatures._creatures[attackIndex];
  Window_Command.prototype.refresh.call(this)
};

Window_DummyEnemy.prototype.windowWidth = function() {
  return Graphics.boxWidth - this._sX - this.standardPadding();
};

Window_DummyEnemy.prototype.maxCols = function() {
  return 1;
};

Window_DummyEnemy.prototype.maxItems = function() {
  return 1;
};

Window_DummyEnemy.prototype.makeCommandList = function() {
  this.addCommand('', 'ok', this.isEnemyAttackable());
};

Window_DummyEnemy.prototype.isEnemyAttackable = function() {
  if (!this._attackingCreature) return false;
  if (this._attackingCreature.isStateAffected(12)) return false;
  if (SceneManager._scene.anyDefenderPresent('enemy') && !this._attackingCreature.isStateAffected(16)) return false;
  return true;
};

Window_DummyEnemy.prototype.itemWidth = function() {
  return this.windowWidth() - 2*this.standardPadding();
};

Window_DummyEnemy.prototype.itemHeight = function() {
  return this.height - 2*this.standardPadding();
};

Window_DummyEnemy.prototype.cursorLeft = function(wrap) {
  var scene = SceneManager._scene;
  var enemyCreatures = scene._enemyCreatures._creatures;
  var canAttackCreature = SceneManager._scene.canAttackCreature(this._attackingCreature);
  if (enemyCreatures.length > 0 && canAttackCreature) {
    this.deactivate();
    this.deselect();
    scene._dummyWindow.activate();
    if (scene._dummyWindow.index() >= 0) scene._dummyWindow.reselect();
    else scene._dummyWindow.select(scene._dummyWindow.maxCols()-1);
  }
};
