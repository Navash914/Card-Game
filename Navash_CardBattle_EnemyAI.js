/*
 *
 * Navash_CardBattle_EnemyAI.js
 *
 * AI for the player to play against.
 *
 * Author: Naveed Ashfaq
 *
 */

// For now, AI plays random moves to be able to simulate a full game.

var Opponents = Opponents || {};

Opponents.scene = function() {
	return SceneManager._scene;
};

Opponents.hand = function() {
	return this.scene()._enemyHand._hand;
};

Opponents.graveyard = function() {
	return this.scene()._enemyHand._graveyard;
};

Opponents.sp = function() {
	return this.scene()._enemyHand._sp;
};

Opponents.hp = function() {
	return this.scene()._enemy._nexusCard.hp;
};

Opponents.creatures = function() {
	return this.scene()._enemyCreatures._creatures;
};

Opponents.playerCreatures = function() {
	return this.scene()._playerCreatures._creatures;
};

Opponents.handCreatures = function() {
	var hand = this.hand();
	var creatures = [];
	for (var i=0; i<hand.length; i++) {
		if (hand[i].type == 'Creature') creatures.push(hand[i]);
	}
	return creatures;
};

Opponents.handSpells = function() {
	var hand = this.hand();
	var spells = [];
	for (var i=0; i<hand.length; i++) {
		if (hand[i].type == 'Spell') spells.push(hand[i]);
	}
	return spells;
};

Opponents.startTurn = function() {
	//$gameTemp.reserveCommonEvent(1);
	//var interpreter = SceneManager._scene._interpreter;
	//interpreter.setupReservedCommonEvent();
	//SceneManager._scene.changeTurn('player');
};


var Robert = Object.create(Opponents);

Robert.startTurn = function() {
	this.summonCreaturePhase();
	this.castSpellPhase();
	this.attackPhase();
	SceneManager._scene.changeTurn('player');
};

Robert.summonCreaturePhase = function() {
	var hand = this.hand();
	var creatures = this.handCreatures();
	if (creatures.length < 1) return;
	var sp = this.sp();
	var summonCosts = creatures.map(x => x.cost);
	if (sp < Math.min(summonCosts)) return;
	var arenaCreatures = this.creatures();
	if (arenaCreatures.length == 5) return;
	var weight = 0;
	weight += arenaCreatures.length;
	weight += Math.floor(Math.random()*10);
	if (weight < 7) this.placeCreature(creatures, summonCosts, sp);
	if (Math.floor(Math.random()*10) < weight) return this.summonCreaturePhase();
};

Robert.castSpellPhase = function() {
	var hand = this.hand();
	var spells = this.handSpells();
	if (spells.length < 1) return;
	var sp = this.sp();
	var summonCosts = spells.map(x => x.cost);
	if (sp < Math.min(summonCosts)) return;
	var arenaCreatures = this.creatures();
	var oppCreatures = this.playerCreatures();
	if (!this.canCastAnySpell(spells, arenaCreatures, oppCreatures)) return;
	var weight = 0;
	weight += arenaCreatures.length;
	weight += Math.floor(Math.random()*10);
	if (weight > 5) this.castSpell(spells, summonCosts, sp);
	if (Math.floor(Math.random()*10) < 5) return this.castSpellPhase();
};

Robert.attackPhase = function() {
	var creatures = this.creatures();
	if (creatures.length < 1) return;
	var defender = this.scene().anyDefenderPresent('player');
	if (defender) {
		var attacked = false;
		var targetDefender = this.getFirstDefender();
		for (var i=0; i<creatures.length; i++) {
			if (creatures[i].canAttackCreatures()) {
				var user = creatures[i];
				this.scene().useCreatureAttack(user, i, targetDefender, this.playerCreatures().indexOf(targetDefender));
				console.log("Attacked " + $dataItems[targetDefender._enemyId].name);
				attacked = true;
				break;
			}
		}
		if (attacked) return this.attackPhase();
		else return;
	}
	if (this.canWin(creatures)) this.allAttackPlayer(creatures);
	else this.attackRandom();
};

Robert.placeCreature = function(creatures, costs, sp) {
	var cLength = creatures.length;
	var done = false;
	var tries = 0;
	while (!done) {
		tries++;
		if (tries > 20) break;
		var rand = Math.floor(Math.random()*cLength);
		if (sp < costs[rand]) continue;
		else {
			var card = creatures[rand];
			var index = this.hand().indexOf(card);
			this.scene().placeCreature(this.scene()._enemyHand, index, this.scene()._enemyCreatures, card);
			console.log("Placed " + card.name);
			done = true;
		}
	}
};

Robert.castSpell = function(spells, costs, sp) {
	var sLength = spells.length;
	var done = false;
	var tries = 0;
	while (!done) {
		tries++;
		if (tries > 20) break;
		var rand = Math.floor(Math.random()*sLength);
		if (sp < costs[rand]) continue;
		else if (this.canCast(spells[rand])) {
			var card = spells[rand];
			var target = this.getSpellTarget(card);
			if (!target) this.scene().useSpellCard(undefined, undefined, card);
			var index = (target._tag == 'enemy') ? this.scene()._enemyCreatures._creatures.indexOf(target) : this.scene()._playerCreatures._creatures.indexOf(target);
			this.scene().useSpellCard(target, index, card);
			console.log("Casted " + card.name);
			done = true;
		}
	}
};

Robert.canCastAnySpell = function(spells, creatures, playerCreatures) {
	var condition = false;
	var scene = this.scene();
	for (var i=0; i<spells.length; i++) {
		var spell = spells[i];
		if (scene.isForOpponent(spell)) {
			if (playerCreatures.length > 0 && spell.sp <= this.sp()) condition = true;
		} else if (scene.isForAlly(spell)) {
			if (creatures.length > 0 && spell.sp <= this.sp()) condition = true;
		}
	}
	return condition;
};

Robert.canCast = function(spellCard) {
	return this.scene()._selectionWindow.processCanSpellUse(spellCard);
};

Robert.getSpellTarget = function(spellCard) {
	var team;
	var target = undefined;
	if (this.scene().isForOpponent(spellCard)) team = this.playerCreatures();
	else if (this.scene().isForAlly(spellCard)) team = this.creatures();
	else if (this.scene().isForNone(spellCard)) team = 'none';
	else team = undefined;
	if (team == 'null' || team == undefined) return undefined;
	var condition = false, tries = 0;
	while (tries < 20) {
		tries++;
		var rand = Math.floor(Math.random()*team.length);
		condition = this.scene()._dummyWindow.processCardSpecialTargets(team[rand], spellCard);
		if (condition) {
			target = team[rand];
			break;
		}
	}
	return target;
};

Robert.getFirstDefender = function() {
	var targets = this.playerCreatures();
	var target;
	for (var i=0; i<targets.length; i++) {
		if (targets[i].isDefender()) {
			target = targets[i];
			break;
		}
	}
	return target;
};

Robert.canWin = function(creatures) {
	var damage = 0;
	for (var i=0; i<creatures.length; i++) {
		if (creatures[i].canAttackPlayer()) damage += creatures[i].atk;
	}
	if (damage >= this.scene()._player._nexusCard.hp) return true;
	else return false;
};

Robert.allAttackPlayer = function(creatures) {
	var target = this.scene()._player._nexusCard;
	for (var i=0; i<creatures.length; i++) {
		if (creatures[i].canAttackPlayer()) this.scene().useCreatureAttack(creatures[i], i, target, 0);
	}
};

Robert.attackRandom = function() {
	var targets = this.playerCreatures();
	var player = this.scene()._player._nexusCard;
	var users = this.creatures();
	for (var i=0; i<users.length; i++) {
		if (!users[i].canAttackNormal()) continue;
		var tries = 0;
		var user = users[i];
		while (tries < 20) {
			tries++;
			if (!user.canAttackCreatures()) {
				this.scene().useCreatureAttack(user, i, player, 0);
				break;
			} else {
				var rand = Math.floor(Math.random()*(targets.length+1));
				if (rand == targets.length) { // player
					if (!user.canAttackPlayer()) continue;
					else {
						this.scene().useCreatureAttack(user, i, player, 0);
						console.log("Attacked Player with " + $dataItems[user._enemyId].name);
						break;
					}
				} else { // Monster
					var index = Math.floor(Math.random()*targets.length);
					var target = targets[index];
					this.scene().useCreatureAttack(user, i, target, index);
					console.log("Attacked " + $dataItems[target._enemyId].name + " with " + $dataItems[user._enemyId].name);
					break;
				}
			}

		}
	}
};

Robert.canAttack = function(monster) {
  var scene = this.scene();
  var enemyCreatures = scene._playerCreatures._creatures;
  if (!monster.canMove()) return false;
  if (monster.isStateAffected(12) && enemyCreatures.length < 1) return false;
  if (monster.isStateAffected(14)) return false;
  if (monster._attackCount < 1) return false;
  return true;
};
