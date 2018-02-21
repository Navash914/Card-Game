//=============================================================================
// Scene_CardBattle
//=============================================================================

function Scene_CardBattle() {
  this.initialize.apply(this, arguments);
}

Scene_CardBattle.prototype = Object.create(Scene_Battle.prototype);
Scene_CardBattle.prototype.constructor = Scene_CardBattle;

Scene_CardBattle.prototype.initialize = function() {
  this._checkImgShowing = false;
  this._noWindowActiveOk = false;
  Scene_Battle.prototype.initialize.call(this);
};

Scene_CardBattle.prototype.update = function() {
  Scene_Base.prototype.update.call(this);
  if (this.needsActivation()) this._playerHand.activate();
  if (this._checkImgShowing) this.updateCheckImg();
  if (this._playerHand._drawCardAnim) this._playerHand.updateDrawMovement();
  if (this._playerHand.needsDiscardAnim()) {
    var indx = this._playerHand._discardCardAnim.length - 1;
    this._playerHand.updateDiscardMovement(this._playerHand._discardCardAnim[indx]);
  }
  this.updatePlayerHand();
};

Scene_CardBattle.prototype.updatePlayerHand = function() {
  if (this._playerHand.active == true) this._playerHand.updateSelection();
  //if (this.needsHandRefresh()) this._playerHand.refresh();
};

Scene_CardBattle.prototype.needsHandRefresh = function() {
  return !this._playerHand._drawCardAnim && this._selectionWindow && 
      !this._selectionWindow.active && !this._checkImgShowing && !this._dummyWindow.active &&
      !this._playerHand.needsDiscardAnim() && !this._playerHand.active;
};

Scene_CardBattle.prototype.needsActivation = function() {
  return !this.anyWindowActive() && !this.noWindowActiveOk() && !$gameMessage.isBusy();
};

Scene_CardBattle.prototype.updateCheckImg = function() {
    if (Input.isTriggered('ok') || Input.isTriggered('cancel')) {
      this._selectionWindow.removeChild(this._selectionWindow._cardImage);
      this._selectionWindow.activate();
      this._selectionWindow.reselect();
      this._selectionWindow.show();
      this._checkImgShowing = false;
      this.setNoWindowActiveOk(false);
    }
};

Scene_CardBattle.prototype.anyWindowActive = function() {
  var active = false;
  if (this._playerHand.active) active = true;
  if (this._playerCreatures.active) active = true;
  if (this._playerGraveyardWindow.active) active = true;
  if (this._playerGraveyardSelection.active) active = true;
  if (this._player.active) active = true;
  //if (this._deckWindow.active) active = true;
  if (this._enemyHand.active) active = true;
  if (this._enemyCreatures.active) active = true;
  if (this._enemyGraveyardWindow.active) active = true;
  if (this._enemy.active) active = true;
  //if (this._enemyDeckWindow.active) active = true;
  //if (this._enemyGraveyardSelection.active) active = true;
  if (this._selectionWindow.active) active = true;
  if (this._dummyWindow.active) active = true; 
  return active;
};

Scene_CardBattle.prototype.noWindowActiveOk = function() {
  return this._noWindowActiveOk;
};

Scene_CardBattle.prototype.setNoWindowActiveOk = function(value) {
  this._noWindowActiveOk = value;
};

Scene_CardBattle.prototype.create = function() {
  Scene_Battle.prototype.create.call(this);
  this.createPlayerWindows();
  this.createEnemyWindows();
  this.createSelectionWindows();
  var index = this._windowLayer.children.indexOf(this._messageWindow);
  this._windowLayer.children.splice(index, 1);
  this.addWindow(this._messageWindow);
  this.refreshWindows();
};

Scene_CardBattle.prototype.createPlayerWindows = function() {
  this.createPlayerCreatures();
  this.createDeckWindow();
  this.createPlayerGraveyardWindow();
  this.createPlayerHand();
  this.createPlayerWindow();
};

Scene_CardBattle.prototype.createEnemyWindows = function() {
  this.createEnemyCreatures();
  this.createEnemyDeckWindow();
  this.createEnemyGraveyardWindow();
  this.createEnemyHand();
  //this.createEnemyGraveyardSelection();
  this.createEnemy();
  //this.createEnemyGraveyardInfo();
};

Scene_CardBattle.prototype.createSelectionWindows = function() {
  this.createSelectionWindow();
  this.createDummySelectWindow();
  this.createPlayerGraveyardSelection();
  this.createPlayerGraveyardInfo();
};

Scene_CardBattle.prototype.createPlayerHand = function() {
    this._playerHand = new Window_PlayerHand();
    this._playerHand.activate();
    this._playerHand.select(0);
    this._playerHand.setHandler('ok', this.onHandOk.bind(this));
    this._playerHand.setHandler('cancel', this.onHandCancel.bind(this));
    this.addWindow(this._playerHand);
};

Scene_CardBattle.prototype.createPlayerCreatures = function() {
    this._playerCreatures = new Window_PlayerCreatures();
    this._playerCreatures.setHandler('ok', this.onPlayerCreatureOk.bind(this));
    this._playerCreatures.setHandler('cancel', this.onPlayerCreatureCancel.bind(this));
    this._playerCreatures.deactivate();
    this._playerCreatures.deselect();
    this.addWindow(this._playerCreatures);
};

Scene_CardBattle.prototype.createDeckWindow = function() {
  this._deckWindow = new Window_Deck();
  this.addWindow(this._deckWindow);
};

Scene_CardBattle.prototype.createPlayerGraveyardWindow = function() {
  this._playerGraveyardWindow = new Window_PlayerGraveyard();
  this._playerGraveyardWindow.setHandler('ok', this.onGraveyardOk.bind(this));
  this._playerGraveyardWindow.deactivate();
  this._playerGraveyardWindow.deselect();
  this.addWindow(this._playerGraveyardWindow);
};

Scene_CardBattle.prototype.createPlayerGraveyardSelection = function() {
  this._playerGraveyardSelection = new Window_PlayerGraveyardSelection();
  this._playerGraveyardSelection.setHandler('ok', this.onGraveSelectOk.bind(this));
  this._playerGraveyardSelection.setHandler('cancel', this.onGraveSelectCancel.bind(this));
  this._playerGraveyardSelection.deactivate();
  this._playerGraveyardSelection.deselect(0);
  this._playerGraveyardSelection.hide();
  this.addWindow(this._playerGraveyardSelection);
};

Scene_CardBattle.prototype.createPlayerGraveyardInfo = function() {
  var x = Graphics.boxWidth / 2;
  var y = 0;
  var width = x;
  var height = Graphics.boxHeight;
  this._playerGraveyardInfo = new Window_PlayerGraveyardInfo(x, y, width, height);
  this._playerGraveyardInfo.hide();
  this.addWindow(this._playerGraveyardInfo);
};

Scene_CardBattle.prototype.createPlayerWindow = function() {
  var x = this._playerCreatures.x + this._playerCreatures.windowWidth();
  var y = this._playerCreatures.y;
  this._player = new Window_Player(x, y);
  this._player.setHandler('ok', this.onPlayerOk.bind(this));
  //this._playerHand.setHandler('cancel', this.onHandCancel.bind(this));
  this._player.deactivate();
  this._player.deselect();
  this.addWindow(this._player);
};

Scene_CardBattle.prototype.createEnemyHand = function() {
    this._enemyHand = new Window_EnemyHand();
    this._enemyHand.deactivate();
    this._enemyHand.deselect();
    //this._enemyHand.setHandler('ok', this.onHandOk.bind(this));
    //this._enemyHand.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._enemyHand);
};

Scene_CardBattle.prototype.createEnemyCreatures = function() {
    this._enemyCreatures = new Window_EnemyCreatures();
    this._enemyCreatures.deactivate();
    this._enemyCreatures.deselect();
    this.addWindow(this._enemyCreatures);
};
  
Scene_CardBattle.prototype.createEnemyDeckWindow = function() {
  this._enemyDeckWindow = new Window_EnemyDeck();
  this.addWindow(this._enemyDeckWindow);
};
  
Scene_CardBattle.prototype.createEnemyGraveyardWindow = function() {
  this._enemyGraveyardWindow = new Window_EnemyGraveyard();
  this._enemyGraveyardWindow.setHandler('ok', this.onEnemyGraveyardOk.bind(this));
  this._enemyGraveyardWindow.deactivate();
  this._enemyGraveyardWindow.deselect();
  this.addWindow(this._enemyGraveyardWindow);
};

/*Scene_CardBattle.prototype.createEnemyGraveyardSelection = function() {
  this._enemyGraveyardSelection = new Window_EnemyGraveyardSelection();//this._graveyard);
  //this._enemyGraveyardSelection.setHandler('cancel', this.onGraveSelectCancel.bind(this));
  this._enemyGraveyardSelection.deactivate();
  this._enemyGraveyardSelection.deselect(0);
  this._enemyGraveyardSelection.hide();
  this.addWindow(this._enemyGraveyardSelection);
};*/

Scene_CardBattle.prototype.createEnemy = function() {
  var x = this._enemyCreatures.x + this._enemyCreatures.windowWidth();
  var y = this._enemyCreatures.y;
  this._enemy = new Window_Enemy(x, y);
  this._enemy.setHandler('ok', this.onEnemyOk.bind(this));
  //this._playerHand.setHandler('cancel', this.onHandCancel.bind(this));
  this._enemy.deactivate();
  this._enemy.deselect();
  this.addWindow(this._enemy);
};

Scene_CardBattle.prototype.refreshWindows = function() {
  if (!!this._playerHand) this._playerHand.refresh();
  if (!!this._playerGraveyardWindow) this._playerGraveyardWindow.refresh();
  if (!!this._playerCreatures) this._playerCreatures.refresh();
  if (!!this._deckWindow) this._deckWindow.refresh();
  if (!!this._playerGraveyardSelection) this._playerGraveyardSelection.refresh();
  if (!!this._player) this._player.refresh();
  if (!!this._enemyHand) this._enemyHand.refresh();
  if (!!this._enemyCreatures) this._enemyCreatures.refresh();
  if (!!this._enemyGraveyardWindow) this._enemyGraveyardWindow.refresh();
  if (!!this._enemyDeckWindow) this._enemyDeckWindow.refresh();
  if (!!this._enemy) this._enemy.refresh();
};

Scene_CardBattle.prototype.hideBaseWindows = function() {
  if (this._playerHand) this._playerHand.hide();
  if (this._playerGraveyardWindow) this._playerGraveyardWindow.hide();
  if (this._playerCreatures) this._playerCreatures.hide();
  if (this._deckWindow) this._deckWindow.hide();
  if (this._player) this._player.hide();

  if (this._enemyCreatures) this._enemyCreatures.hide();
  if (this._enemyHand) this._enemyHand.hide();
  if (this._enemyGraveyardWindow) this._enemyGraveyardWindow.hide();
  if (this._enemyDeckWindow) this._enemyDeckWindow.hide();
  if (this._enemy) this._enemy.hide();
};

Scene_CardBattle.prototype.showBaseWindows = function() {
  if (this._playerHand) this._playerHand.show();
  if (this._playerGraveyardWindow) this._playerGraveyardWindow.show();
  if (this._playerCreatures) this._playerCreatures.show();
  if (this._deckWindow) this._deckWindow.show();
  if (this._player) this._player.show();

  if (this._enemyCreatures) this._enemyCreatures.show();
  if (this._enemyHand) this._enemyHand.show();
  if (this._enemyGraveyardWindow) this._enemyGraveyardWindow.show();
  if (this._enemyDeckWindow) this._enemyDeckWindow.show();
  if (this._enemy) this._enemy.show();
};

Scene_CardBattle.prototype.hideGraveWindows = function() {
  if (this._playerGraveyardSelection) {
    this._playerGraveyardSelection.hide();
    this._playerGraveyardSelection.deactivate();
    this._playerGraveyardSelection.deselect();
  }
  if (this._playerGraveyardInfo) this._playerGraveyardInfo.hide();
};

Scene_CardBattle.prototype.showGraveWindows = function() {
  if (this._playerGraveyardSelection) {
    this._playerGraveyardSelection.refresh();
    this._playerGraveyardSelection.show();
    this._playerGraveyardSelection.activate();
    this._playerGraveyardSelection.select(0);
  }
  if (this._playerGraveyardInfo) this._playerGraveyardInfo.show();
};

Scene_CardBattle.prototype.createSelectionWindow = function() {
    this._selectionWindow = new Window_CardSelection();
    this._selectionWindow.deactivate();
    this._selectionWindow.deselect();
    this._selectionWindow.setHandler('ok', this.onSelectionOk.bind(this));
    this._selectionWindow.setHandler('check', this.onSelectionCheck.bind(this));
    this._selectionWindow.setHandler('ability', this.onSelectionAbility.bind(this));
    this._selectionWindow.setHandler('cancel', this.onSelectionCancel.bind(this));
    this._selectionWindow.hide();
    this.addWindow(this._selectionWindow);
};

Scene_CardBattle.prototype.createDummySelectWindow = function() {
    this._dummyWindow = new Window_DummyWindow();
    this._dummyWindow.deactivate();
    this._dummyWindow.deselect();
    this._dummyWindow.setHandler('ok', this.onDummyOk.bind(this));
    this._dummyWindow.setHandler('cancel', this.onDummyCancel.bind(this));
    this._dummyWindow.hide();
    this.addWindow(this._dummyWindow);
};

Scene_CardBattle.prototype.onHandOk = function() {
  var hand = this._playerHand;
  var index = hand.index();
  var card = hand._hand[index];
  this.activateSelectionWindow(hand, 'hand', card, false, 0, 0);
};

Scene_CardBattle.prototype.onHandCancel = function() {
  SceneManager.goto(Scene_Map);
};

Scene_CardBattle.prototype.onPlayerCreatureOk = function() {
  var creature = this._playerCreatures;
  var index = creature.index();
  var card = creature._creatures[index];
  var shiftX = 0.5 * creature.itemWidth();
  var shiftY = 0.5 * creature.itemHeight();
  this.activateSelectionWindow(creature, 'playerCreature', card, true, shiftX, shiftY);
};

Scene_CardBattle.prototype.onPlayerCreatureCancel = function() {
  this._playerCreatures.deactivate();
  this._playerCreatures.deselect();
  this._playerHand.activate();
  this._playerHand.reselect();
};

Scene_CardBattle.prototype.onGraveyardOk = function() {
  if (this._playerHand._graveyard.length < 1) return;
  this.activateGraveyardSelection(this._playerGraveyardWindow, false, 'player');
};

Scene_CardBattle.prototype.onPlayerOk = function() {
  var card = this._player._nexusCard;
  var shiftX = 72, shiftY = 72;
  this.activateSelectionWindow(this._player, 'player', card, true, shiftX, shiftY);
};

Scene_CardBattle.prototype.onSelectionOk = function() {
  var src = this._playerHand;
  var index = src.index();
  var card = src._hand[index];
  if (card.type === 'Creature') {
    this.placeCreature(src, index, card);
    this.onSelectionCancel();
  } else if (card.type === 'Spell') {
    this.processSpellTarget(card);
  }
  this.refreshWindows();
  //this.onSelectionCancel();
};

Scene_CardBattle.prototype.onSelectionAbility = function() {
  var monster = this._player._nexusCard;
  var card = $dataItems[monster._enemyId];
  this.processSpellTarget(card);
  this.refreshWindows();
  //this.onSelectionCancel();
};

Scene_CardBattle.prototype.onSelectionCheck = function() {
  this.setNoWindowActiveOk(true);
  var src = this.getPreviousWindow();
  var arr = this.getSource(src);
  var index = src.index();
  if (this._selectionWindow.isNexus()) {
    var filename = $dataItems[arr._enemyId].name + '_large';
  } else if (this._selectionWindow.isCreature()) {
    var filename = $dataItems[arr[index]._enemyId].name + '_large';
  } else {
    var filename = arr[index].name + '_large';
  }
  this._selectionWindow._cardImage.bitmap = ImageManager.loadPicture(filename);
  this._selectionWindow.addChild(this._selectionWindow._cardImage);
  this._checkImgShowing = true;
};

Scene_CardBattle.prototype.onSelectionCancel = function() {
  this._selectionWindow.hide();
  this._selectionWindow.deactivate();
  this._selectionWindow.deselect();
  var prevWindow = this.getPreviousWindow();
  prevWindow.activate();
  prevWindow.reselect();
};

Scene_CardBattle.prototype.onDummyOk = function() {
  var targetIndex = this._dummyWindow.index();
  var selectType = this._dummyWindow.selectionType();
  if (selectType === 'player') {
    var target = SceneManager._scene._playerCreatures._creatures[targetIndex];
  } else if (selectType === 'player') {
    var target = SceneManager._scene._playerCreatures._creatures[targetIndex];
  }
  var card = this._dummyWindow._card;
  this.onDummyCancel();
  this.onSelectionCancel();
  this.useSpellCard(target, targetIndex, card);
  this.refreshWindows();
  //this.onSelectionCancel();
};

Scene_CardBattle.prototype.onDummyCancel = function() {
  this._selectionWindow.show();
  this._selectionWindow.activate();
  this._selectionWindow.reselect();
  this._dummyWindow.deactivate();
  this._dummyWindow.deselect();
  this._dummyWindow.hide();
};

Scene_CardBattle.prototype.onGraveSelectOk = function() {
  var retrieve = this._playerGraveyardSelection._retrieve;
  console.log(retrieve);
  if (retrieve) {
    var index = this._playerGraveyardSelection.index();
    index = this._playerHand._graveyard.length - 1 - index;
    var card = this._playerHand._graveyard[index];
    var playedCard = this._playerHand._hand[this._playerHand.index()];
    this._playerHand._hand.push(card);
    this._playerHand._graveyard.splice(index, 1);
    this.refreshWindows();
    this.onGraveSelectCancel();
    this.useSpellCard(undefined, undefined, playedCard);
    this.onSelectionCancel();
    this.refreshWindows();
  } else {
    this.onGraveSelectCancel();
  }
};

Scene_CardBattle.prototype.onGraveSelectCancel = function() {
  this.hideGraveWindows();
  this.showBaseWindows();
  var prevWindow = this._playerGraveyardSelection._prevWindow
  if (prevWindow === this._selectionWindow) this._selectionWindow.show();
  prevWindow.activate();
  prevWindow.reselect();
  this.refreshWindows();
};

Scene_CardBattle.prototype.onEnemyGraveyardOk = function() {
  if (this._enemyHand._graveyard.length < 1) return;
  this.activateGraveyardSelection(this._enemyGraveyardWindow, false, 'enemy');
};

Scene_CardBattle.prototype.onEnemyOk = function() {
  var card = this._enemy._nexusCard;
  var shiftX = 72, shiftY = 72;
  this.activateSelectionWindow(this._enemy, 'enemy', card, true, shiftX, shiftY);
};

Scene_CardBattle.prototype.activateSelectionWindow = function(part, selectionType, obj, absY, shiftX, shiftY) {
  this._selectionWindow.setSelectionType(selectionType);
  var index = part.index();
  var rect = part.itemRect(index);
  var x = part.x + rect.x + shiftX;
  var y = part.y + rect.y + shiftY;
  this._selectionWindow.refresh(x, y, obj, absY, index);
  part.deactivate();
  this._selectionWindow.activate();
  this._selectionWindow.select(0);
  this._selectionWindow.show();
};

Scene_CardBattle.prototype.activateDummyWindow = function(obj) {
  var selectType = this._dummyWindow.selectionType();
  if (selectType === 'player') {
    var x = this._playerCreatures.x;
    var y = this._playerCreatures.y;
  } else if (selectType === 'enemy') {
    var x = this._enemyCreatures.x;
    var y = this._enemyCreatures.y;
  }
  this._dummyWindow.refresh(x, y, obj);
  this._selectionWindow.deactivate();
  this._selectionWindow.hide();
  this._dummyWindow.activate();
  this._dummyWindow.select(0);
  this._dummyWindow.show();
};

Scene_CardBattle.prototype.activateGraveyardSelection = function(prevWindow, retrieve, group) {
  this._playerGraveyardSelection.setRetrieve(retrieve);
  this._playerGraveyardSelection.setPrevWindow(prevWindow);
  this._playerGraveyardSelection.setGroup(group);
  prevWindow.deactivate();
  this.hideBaseWindows();
  if (prevWindow === this._selectionWindow) this._selectionWindow.hide();
  this.showGraveWindows();
  this._playerGraveyardSelection.activate();
  this._playerGraveyardSelection.select(0);
};


Scene_CardBattle.prototype.placeCreature = function(src, index, card) {
  src._hand.splice(index, 1);
  this._playerCreatures.add(card);
  this._playerHand._sp -= card.cost;
  this.refreshWindows();
};

Scene_CardBattle.prototype.checkItemScope = function(list, card) {
    return list.contains(card.scope);
};

Scene_CardBattle.prototype.isForNone = function(card) {
    return this.checkItemScope([0], card);
};

Scene_CardBattle.prototype.isForOpponent = function(card) {
    return this.checkItemScope([1, 2, 3, 4, 5, 6], card);
};

Scene_CardBattle.prototype.isForAlly = function(card) {
    return this.checkItemScope([7, 8, 9, 10, 11], card);
};

Scene_CardBattle.prototype.processSpellTarget = function(card) {
  if (card.targetEval != '') {
    switch (card.targetEval) {
      case 'graveyard':
        this.activateGraveyardSelection(this._selectionWindow, true, 'player');
        break;
      default:
        card.targetEval = '';
        this.processSpellTarget(card);
        break;
    }
  } else if (this.isForAlly(card)) {
    this._dummyWindow.setSelectionType('player');
    this.activateDummyWindow(card);
  } else if (this.isForOpponent(card)) {
    this._dummyWindow.setSelectionType('enemy');
    this.activateDummyWindow(card);
  } else if (this.isForNone(card)) {
    this.useSpellCard(undefined, undefined, card);
    this.onSelectionCancel();
  } else return;
};

Scene_CardBattle.prototype.useSpellCard = function(target, targetIndex, card) {
  if (card.type != 'Nexus') {
    var index = this._playerHand._hand.indexOf(card);
    this._playerHand.discard(index);
  } else {
    this._player._usedAbility = true;
  }
  this._playerHand._sp -= card.cost;
  if (target === undefined || targetIndex === undefined) this.processSpellEffectsNoTarget(card);
  else this.processSpellEffects(target, targetIndex, card);
};

Scene_CardBattle.prototype.processSpellEffects = function(target, targetIndex, card) {
  if (card.effectEval === '') return;
    var creatures = SceneManager._scene._playerCreatures._creatures;
    var hand = SceneManager._scene._playerHand._hand;
    var deck = SceneManager._scene._playerHand._deck;
    var graveyard = SceneManager._scene._playerHand._graveyard;
    var enemyCreatures = SceneManager._scene._enemyCreatures._creatures;
    var index = targetIndex;
    var targetCard = $dataItems[target._enemyId];
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    var code = card.effectEval;
    try {
      eval(code);
    } catch (e) {
      console.log("Error in Card Effect Eval");
    }
};

Scene_CardBattle.prototype.processSpellEffectsNoTarget = function(card) {
  if (card.effectEval === '') return;
    var creatures = SceneManager._scene._playerCreatures._creatures;
    var handWindow = SceneManager._scene._playerHand;
    var hand = handWindow._hand;
    var deck = handWindow._deck;
    var graveyardWindow = handWindow._graveyard;
    var enemyCreatures = SceneManager._scene._enemyCreatures._creatures;
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    var code = card.effectEval;
    try {
      eval(code);
    } catch (e) {
      console.log("Error in Card Effect Eval");
    }
};

Scene_CardBattle.prototype.getPreviousWindow = function() {
  switch (this._selectionWindow.selectionType()) {
    case 'hand':
      return this._playerHand;
      break;
    case 'playerCreature':
      return this._playerCreatures;
      break;
    case 'enemyCreatures':
      return this._enemyCreatures;
    case 'player':
      return this._player;
      break;
    case 'enemy':
      return this._enemy;
      break;
    default:
      return this._playerHand;
      break;
  }
};

Scene_CardBattle.prototype.getSource = function(src) {
  switch (src) {
    case this._playerHand:
      return this._playerHand._hand;
      break;
    case this._playerCreatures:
      return this._playerCreatures._creatures;
      break;
    case this._enemyCreatures:
      return this._enemyCreatures._creatures;
    case this._player:
      return this._player._nexusCard;
      break;
    case this._enemy:
      return this._enemy._nexusCard;
      break;
    default:
      return this._playerHand._hand;
      break;
  }
};
