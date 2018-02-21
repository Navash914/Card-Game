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
      this.makePlayerCreatureCommands();
      break;
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
  this.addCommand('Attack', 'attack', true);
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
  this.addCommand('Check', 'check', true);
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

Window_CardSelection.prototype.processCanCreatureUse = function(card) {
  var condition = true;
  if (card.requireEval !== '') {
    var creatures = SceneManager._scene._playerCreatures._creatures;
    var hand = SceneManager._scene._playerHand._hand;
    var deck = SceneManager._scene._playerHand._deck;
    var graveyard = SceneManager._scene._playerHand._graveyard;
    var enemyCreatures = SceneManager._scene._enemyCreatures._creatures;
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    var code = card.requireEval;
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
    var creatures = SceneManager._scene._playerCreatures._creatures;
    var hand = SceneManager._scene._playerHand._hand;
    var deck = SceneManager._scene._playerHand._deck;
    var graveyard = SceneManager._scene._playerHand._graveyard;
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
};

Window_DummyWindow.prototype.maxCols = function() {
  var selection = this.selectionType();
  var playerCreatures = SceneManager._scene._playerCreatures._creatures.length;
  var enemyCreatures = SceneManager._scene._enemyCreatures._creatures.length
  switch (selection) {
    case 'player':
      return playerCreatures;
      break;
    case 'enemy':
      return enemyCreatures;
      break;
    case 'all':
      return Math.max(playerCreatures, enemyCreatures);
      break;
    default:
      return playerCreatures;
      break;
  }
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

Window_DummyWindow.prototype.makeCommandList = function(index) {
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
  if (card.specialTargetEval !== '') {
    var creatures = SceneManager._scene._playerCreatures._creatures;
    var handWindow = SceneManager._scene._playerHand;
    var hand = handWindow._hand;
    var deck = handWindow._deck;
    var graveyard = handWindow._graveyard;
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
  return condition;
};

//=============================================================================
// Window_EnemyDummyWindow
//=============================================================================

/*function Window_EnemyDummyWindow() {
    this.initialize.apply(this, arguments);
};

Window_EnemyDummyWindow.prototype = Object.create(Window_Command.prototype);
Window_EnemyDummyWindow.prototype.constructor = Window_EnemyDummyWindow;

Window_EnemyDummyWindow.prototype.initialize = function() {
  //var h = Graphics.boxHeight;
  var x = SceneManager._scene.;
  var y = 0;
  this._selection = 'player';
  this._card;
  //this._graveyardSelection = SceneManager._scene._playerHand._graveyard;
  Window_Command.prototype.initialize.call(this, x, y);
  this.height = Graphics.boxHeight / 4;
  this.opacity = 0;
};*/
