BattleManager.checkBattleEnd = function() {
    /*if (this._phase) {
        if (this.checkAbort()) {
            return true;
        } else if ($gameParty.isAllDead()) {
            this.processDefeat();
            return true;
        } else if ($gameTroop.isAllDead()) {
            this.processVictory();
            return true;
        }
    }*/
    return false;
};

/*
var BattleManager_processVictory = BattleManager.processVictory;
BattleManager.processVictory = function() {
    BattleManager_processVictory.call(this);
};
*/

/*
function Scene_Battle() {
    this.initialize.apply(this, arguments);
}

Scene_Battle.prototype = Object.create(Scene_Base.prototype);
Scene_Battle.prototype.constructor = Scene_Battle;

Scene_Battle.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_Battle.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createDisplayObjects();
};

Scene_Battle.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    this.startFadeIn(this.fadeSpeed(), false);
    BattleManager.playBattleBgm();
    BattleManager.startBattle();
};

Scene_Battle.prototype.update = function() {
    var active = this.isActive();
    $gameTimer.update(active);
    $gameScreen.update();
    this.updateStatusWindow();
    this.updateWindowPositions();
    if (active && !this.isBusy()) {
        this.updateBattleProcess();
    }
    Scene_Base.prototype.update.call(this);
};

Scene_Battle.prototype.updateBattleProcess = function() {
    if (!this.isAnyInputWindowActive() || BattleManager.isAborting() ||
            BattleManager.isBattleEnd()) {
        BattleManager.update();
        this.changeInputWindow();
    }
};

Scene_Battle.prototype.isAnyInputWindowActive = function() {
    return (this._partyCommandWindow.active ||
            this._actorCommandWindow.active ||
            this._skillWindow.active ||
            this._itemWindow.active ||
            this._actorWindow.active ||
            this._enemyWindow.active);
};

Scene_Battle.prototype.changeInputWindow = function() {
    if (BattleManager.isInputting()) {
        if (BattleManager.actor()) {
            this.startActorCommandSelection();
        } else {
            this.startPartyCommandSelection();
        }
    } else {
        this.endCommandSelection();
    }
};

Scene_Battle.prototype.stop = function() {
    Scene_Base.prototype.stop.call(this);
    if (this.needsSlowFadeOut()) {
        this.startFadeOut(this.slowFadeSpeed(), false);
    } else {
        this.startFadeOut(this.fadeSpeed(), false);
    }
    this._statusWindow.close();
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
};

Scene_Battle.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    $gameParty.onBattleEnd();
    $gameTroop.onBattleEnd();
    AudioManager.stopMe();

    ImageManager.clearRequest();
};

Scene_Battle.prototype.needsSlowFadeOut = function() {
    return (SceneManager.isNextScene(Scene_Title) ||
            SceneManager.isNextScene(Scene_Gameover));
};

Scene_Battle.prototype.updateStatusWindow = function() {
    if ($gameMessage.isBusy()) {
        this._statusWindow.close();
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    } else if (this.isActive() && !this._messageWindow.isClosing()) {
        this._statusWindow.open();
    }
};

Scene_Battle.prototype.updateWindowPositions = function() {
    var statusX = 0;
    if (BattleManager.isInputting()) {
        statusX = this._partyCommandWindow.width;
    } else {
        statusX = this._partyCommandWindow.width / 2;
    }
    if (this._statusWindow.x < statusX) {
        this._statusWindow.x += 16;
        if (this._statusWindow.x > statusX) {
            this._statusWindow.x = statusX;
        }
    }
    if (this._statusWindow.x > statusX) {
        this._statusWindow.x -= 16;
        if (this._statusWindow.x < statusX) {
            this._statusWindow.x = statusX;
        }
    }
};

Scene_Battle.prototype.createAllWindows = function() {
    this.createLogWindow();
    this.createStatusWindow();
    this.createPartyCommandWindow();
    this.createActorCommandWindow();
    this.createHelpWindow();
    this.createSkillWindow();
    this.createItemWindow();
    this.createActorWindow();
    this.createEnemyWindow();
    this.createMessageWindow();
    this.createScrollTextWindow();
};

Scene_Battle.prototype.createLogWindow = function() {
    this._logWindow = new Window_BattleLog();
    this.addWindow(this._logWindow);
};

Scene_Battle.prototype.createStatusWindow = function() {
    this._statusWindow = new Window_BattleStatus();
    this.addWindow(this._statusWindow);
};

Scene_Battle.prototype.createPartyCommandWindow = function() {
    this._partyCommandWindow = new Window_PartyCommand();
    this._partyCommandWindow.setHandler('fight',  this.commandFight.bind(this));
    this._partyCommandWindow.setHandler('escape', this.commandEscape.bind(this));
    this._partyCommandWindow.deselect();
    this.addWindow(this._partyCommandWindow);
};

Scene_Battle.prototype.createActorCommandWindow = function() {
    this._actorCommandWindow = new Window_ActorCommand();
    this._actorCommandWindow.setHandler('attack', this.commandAttack.bind(this));
    this._actorCommandWindow.setHandler('skill',  this.commandSkill.bind(this));
    this._actorCommandWindow.setHandler('guard',  this.commandGuard.bind(this));
    this._actorCommandWindow.setHandler('item',   this.commandItem.bind(this));
    this._actorCommandWindow.setHandler('cancel', this.selectPreviousCommand.bind(this));
    this.addWindow(this._actorCommandWindow);
};

Scene_Battle.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help();
    this._helpWindow.visible = false;
    this.addWindow(this._helpWindow);
};

Scene_Battle.prototype.createSkillWindow = function() {
    var wy = this._helpWindow.y + this._helpWindow.height;
    var wh = this._statusWindow.y - wy;
    this._skillWindow = new Window_BattleSkill(0, wy, Graphics.boxWidth, wh);
    this._skillWindow.setHelpWindow(this._helpWindow);
    this._skillWindow.setHandler('ok',     this.onSkillOk.bind(this));
    this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
    this.addWindow(this._skillWindow);
};

Scene_Battle.prototype.createItemWindow = function() {
    var wy = this._helpWindow.y + this._helpWindow.height;
    var wh = this._statusWindow.y - wy;
    this._itemWindow = new Window_BattleItem(0, wy, Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
};

Scene_Battle.prototype.createActorWindow = function() {
    this._actorWindow = new Window_BattleActor(0, this._statusWindow.y);
    this._actorWindow.setHandler('ok',     this.onActorOk.bind(this));
    this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
    this.addWindow(this._actorWindow);
};

Scene_Battle.prototype.createEnemyWindow = function() {
    this._enemyWindow = new Window_BattleEnemy(0, this._statusWindow.y);
    this._enemyWindow.x = Graphics.boxWidth - this._enemyWindow.width;
    this._enemyWindow.setHandler('ok',     this.onEnemyOk.bind(this));
    this._enemyWindow.setHandler('cancel', this.onEnemyCancel.bind(this));
    this.addWindow(this._enemyWindow);
};

Scene_Battle.prototype.createMessageWindow = function() {
    this._messageWindow = new Window_Message();
    this.addWindow(this._messageWindow);
    this._messageWindow.subWindows().forEach(function(window) {
        this.addWindow(window);
    }, this);
};

Scene_Battle.prototype.createScrollTextWindow = function() {
    this._scrollTextWindow = new Window_ScrollText();
    this.addWindow(this._scrollTextWindow);
};

Scene_Battle.prototype.refreshStatus = function() {
    this._statusWindow.refresh();
};

Scene_Battle.prototype.startPartyCommandSelection = function() {
    this.refreshStatus();
    this._statusWindow.deselect();
    this._statusWindow.open();
    this._actorCommandWindow.close();
    this._partyCommandWindow.setup();
};

Scene_Battle.prototype.commandFight = function() {
    this.selectNextCommand();
};

Scene_Battle.prototype.commandEscape = function() {
    BattleManager.processEscape();
    this.changeInputWindow();
};

Scene_Battle.prototype.startActorCommandSelection = function() {
    this._statusWindow.select(BattleManager.actor().index());
    this._partyCommandWindow.close();
    this._actorCommandWindow.setup(BattleManager.actor());
};

Scene_Battle.prototype.commandAttack = function() {
    BattleManager.inputtingAction().setAttack();
    this.selectEnemySelection();
};

Scene_Battle.prototype.commandSkill = function() {
    this._skillWindow.setActor(BattleManager.actor());
    this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
    this._skillWindow.refresh();
    this._skillWindow.show();
    this._skillWindow.activate();
};

Scene_Battle.prototype.commandGuard = function() {
    BattleManager.inputtingAction().setGuard();
    this.selectNextCommand();
};

Scene_Battle.prototype.commandItem = function() {
    this._itemWindow.refresh();
    this._itemWindow.show();
    this._itemWindow.activate();
};

Scene_Battle.prototype.selectNextCommand = function() {
    BattleManager.selectNextCommand();
    this.changeInputWindow();
};

Scene_Battle.prototype.selectPreviousCommand = function() {
    BattleManager.selectPreviousCommand();
    this.changeInputWindow();
};

Scene_Battle.prototype.selectActorSelection = function() {
    this._actorWindow.refresh();
    this._actorWindow.show();
    this._actorWindow.activate();
};

Scene_Battle.prototype.onActorOk = function() {
    var action = BattleManager.inputtingAction();
    action.setTarget(this._actorWindow.index());
    this._actorWindow.hide();
    this._skillWindow.hide();
    this._itemWindow.hide();
    this.selectNextCommand();
};

Scene_Battle.prototype.onActorCancel = function() {
    this._actorWindow.hide();
    switch (this._actorCommandWindow.currentSymbol()) {
    case 'skill':
        this._skillWindow.show();
        this._skillWindow.activate();
        break;
    case 'item':
        this._itemWindow.show();
        this._itemWindow.activate();
        break;
    }
};

Scene_Battle.prototype.selectEnemySelection = function() {
    this._enemyWindow.refresh();
    this._enemyWindow.show();
    this._enemyWindow.select(0);
    this._enemyWindow.activate();
};

Scene_Battle.prototype.onEnemyOk = function() {
    var action = BattleManager.inputtingAction();
    action.setTarget(this._enemyWindow.enemyIndex());
    this._enemyWindow.hide();
    this._skillWindow.hide();
    this._itemWindow.hide();
    this.selectNextCommand();
};

Scene_Battle.prototype.onEnemyCancel = function() {
    this._enemyWindow.hide();
    switch (this._actorCommandWindow.currentSymbol()) {
    case 'attack':
        this._actorCommandWindow.activate();
        break;
    case 'skill':
        this._skillWindow.show();
        this._skillWindow.activate();
        break;
    case 'item':
        this._itemWindow.show();
        this._itemWindow.activate();
        break;
    }
};

Scene_Battle.prototype.onSkillOk = function() {
    var skill = this._skillWindow.item();
    var action = BattleManager.inputtingAction();
    action.setSkill(skill.id);
    BattleManager.actor().setLastBattleSkill(skill);
    this.onSelectAction();
};

Scene_Battle.prototype.onSkillCancel = function() {
    this._skillWindow.hide();
    this._actorCommandWindow.activate();
};

Scene_Battle.prototype.onItemOk = function() {
    var item = this._itemWindow.item();
    var action = BattleManager.inputtingAction();
    action.setItem(item.id);
    $gameParty.setLastItem(item);
    this.onSelectAction();
};

Scene_Battle.prototype.onItemCancel = function() {
    this._itemWindow.hide();
    this._actorCommandWindow.activate();
};

Scene_Battle.prototype.onSelectAction = function() {
    var action = BattleManager.inputtingAction();
    this._skillWindow.hide();
    this._itemWindow.hide();
    if (!action.needsSelection()) {
        this.selectNextCommand();
    } else if (action.isForOpponent()) {
        this.selectEnemySelection();
    } else {
        this.selectActorSelection();
    }
};

Scene_Battle.prototype.endCommandSelection = function() {
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
    this._statusWindow.deselect();
};*/


Game_BattlerBase.prototype.param = function(paramId) {
    var value = this.paramBase(paramId) + this.paramBuffRate(paramId);
    var maxValue = this.paramMax(paramId);
    var minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
};

Game_Battler.prototype.addBuff = function(paramId, value) {
    this._buffs[paramId] += value;
};

Game_BattlerBase.prototype.paramBuffRate = function(paramId) {
    return this._buffs[paramId];
};

Game_BattlerBase.prototype.isMaxBuffAffected = function(paramId) {
    return false;
};

Game_BattlerBase.prototype.isMaxDebuffAffected = function(paramId) {
    return false;
};





Window_Selectable.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (SceneManager._scene instanceof Scene_CardBattle) {
        if (!this.isWindowChanging()) {
            this.updateArrows();
            this.processCursorMove();
            this.processHandling();
            this.processWheel();
            this.processTouch();
            this._stayCount++;
        }
        this.updatePrevWindow();
    } else {
    this.updateArrows();
    this.processCursorMove();
    this.processHandling();
    this.processWheel();
    this.processTouch();
    this._stayCount++;
    }
};

Window_Selectable.prototype.updatePrevWindow = function() {
    this._previousWindow = this.currentActiveWindow();
};

Window_Selectable.prototype.isWindowChanging = function() {
    if (this._previousWindow === undefined) this.updatePrevWindow();
    return this._previousWindow != this.currentActiveWindow();
};

Window_Selectable.prototype.currentActiveWindow = function() {
    var scene = SceneManager._scene;
  if (scene._playerHand.active) return scene._playerHand;
  if (scene._playerCreatures.active) return scene._playerCreatures;
  if (scene._playerGraveyardWindow.active) return scene._playerGraveyardWindow;
  if (scene._playerGraveyardSelection.active) return scene._playerGraveyardSelection;
  if (scene._player.active) return scene._player;
  if (scene._enemyHand.active) return scene._enemyHand;
  if (scene._enemyCreatures.active) return scene._enemyCreatures;
  if (scene._enemyGraveyardWindow.active) return scene._enemyGraveyardWindow;
  if (scene._enemy.active) return scene._enemy;
  //if (scene._enemyGraveyardSelection.active) return scene._enemyGraveyardSelection;
  if (scene._selectionWindow.active) return scene._selectionWindow;
  if (scene._dummyWindow.active) return scene._dummyWindow; 
};

var game_enemy_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId, x, y) {
    var obj = $dataEnemies[enemyId];
    this._attackCount = obj.attackCount;
    game_enemy_setup.call(this, enemyId, x, y);
};

Game_Enemy.prototype.refreshStats = function() {
    this._cacheBaseParam = {};
    this.refresh();
};

Game_Enemy.prototype.addAttackCount = function(value) {
    value = Math.floor(value);
    this._attackCount += value;
    this.refresh();
};

Game_Enemy.prototype.resetAttackCount = function() {
    this._attackCount = this.enemy().attackCount;
    this.refresh();
};

//Game_Enemy.prototype.clearBuffs = function() {
//    this._buffs = [0,0,0,0,0,0,0,0];
//    this.refresh();
//};


Game_Enemy.prototype.canAttackNormal = function() {
    if (!this.canMove) return false;
    if (this.isStateAffected(14) || this.isStateAffected(18)) return false;
    return true;
};

Game_Enemy.prototype.canAttackCreatures = function() {
    if (!this.canAttackNormal()) return false;
    if (this.isStateAffected(11)) return false;
    return true;
};

Game_Enemy.prototype.canAttackPlayer = function() {
    if (!this.canAttackNormal()) return false;
    if (this.isStateAffected(12)) return false;
    return true;
};

Game_Enemy.prototype.isDefender = function() {
    return this.isStateAffected(15);
};
