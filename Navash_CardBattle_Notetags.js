/*
 *
 * Navash_CardBattle_Notetags.js
 *
 * Reads all notetags from the program to
 * create card functionality.
 *
 * Author: Naveed Ashfaq
 *
 */

var databaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!databaseLoaded.call(this)) return false;
  if (!this._loadComplete) {
    this.processTypeTags($dataItems);
    this.processRequirementTags($dataItems);
    this.processTargetTags($dataItems);
    this.processEffectTags($dataItems);
    this.processEnemyTags($dataEnemies);
    this.processSpecialEffectTags($dataItems);
    this.processSpecialEffectTags($dataEnemies);
    this.processStateTags($dataStates);
    this._loadComplete = true;
  }
  return true;
};

DataManager.processTypeTags = function(group) {
  var note1 = /<(?:CARD TYPE):[ ](.*)>/i;
  var note2 = /<(?:ELEMENT):[ ](\d+)>/i;
  var note3 = /<(?:COST):[ ](\d+)>/i;
  var note4 = /<(?:SP):[ ](\d+)>/i;

  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.type = '';
    obj.ele = 0;
    obj.cost = 0;
    obj.sp = 0;

    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(note1)) {
        obj.type = String(RegExp.$1);
      } else if (line.match(note2)) {
        obj.ele = Number(RegExp.$1);
      } else if (line.match(note3)) {
        obj.cost = Number(RegExp.$1);
      } else if (line.match(note4)) {
        obj.sp = Number(RegExp.$1);
      }
    } // End of notedata for loop
  } // End of all item for loop
};

DataManager.processEnemyTags = function(group) {
  var note1 = /<(?:ATTACK COUNT):[ ](\d+)>/i;

  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.attackCount = 1;

    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(note1)) {
        obj.attackCount = parseInt(RegExp.$1);
      }
    } // End of notedata for loop
  } // End of all item for loop
};

DataManager.processStateTags = function(group) {
  var note1 = /<(?:STATE TYPE):[ ](.*)>/i;

  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.type = '';

    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(note1)) {
        obj.type = String(RegExp.$1);
      }
    } // End of notedata for loop
  } // End of all item for loop
};

DataManager.processRequirementTags = function(group) {
  var noteStart = /<(?:USE REQUIREMENTS*)>/i;
  var noteEnd = /<\/(?:USE REQUIREMENTS*)>/i;
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.requirementEval = '';
    var evalMode = 'none';

    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(noteStart)) {
        evalMode = 'require eval';
      } else if (line.match(noteEnd)) {
        evalMode = 'none';
      } else if (evalMode === 'require eval') {
        obj.requirementEval = obj.requirementEval + line + '\n';
      } 
    } // End of notedata for loop
  } // End of all item for loop
};

DataManager.processTargetTags = function(group) {
  var noteStart1 = /<(?:USE TARGETS*)>/i;
  var noteEnd1 = /<\/(?:USE TARGETS*)>/i;
  var noteStart2 = /<(?:SPECIAL TARGETS*)>/i;
  var noteEnd2 = /<\/(?:SPECIAL TARGETS*)>/i;
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.target = obj.scope;
    obj.targetEval = '';
    obj.specialTargetEval = '';
    var evalMode = 'none';

    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(noteStart1)) {
        evalMode = 'target eval';
      } else if (line.match(noteStart2)) {
        evalMode = 'special target eval';
      } else if (line.match(noteEnd1)) {
        evalMode = 'none';
      } else if (line.match(noteEnd2)) {
        evalMode = 'none';
      } else if (evalMode === 'target eval') {
        obj.targetEval = line;
      } else if (evalMode === 'special target eval') {
        obj.specialTargetEval = obj.specialTargetEval + line + '\n';
      }
    } // End of notedata for loop
  } // End of all item for loop
};

DataManager.processEffectTags = function(group) {
  var noteStart = /<(?:USE EFFECTS*)>/i;
  var noteEnd = /<\/(?:USE EFFECTS*)>/i;
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.effectEval = '';
    var evalMode = 'none';

    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(noteStart)) {
        evalMode = 'effect eval';
      } else if (line.match(noteEnd)) {
        evalMode = 'none';
      } else if (evalMode === 'effect eval') {
        obj.effectEval = obj.effectEval + line + '\n';
      } 
    } // End of notedata for loop
  } // End of all item for loop
};

DataManager.processSpecialEffectTags = function(group) {
  var noteStart = /<(?:ON SUMMON)>/i;
  var noteEnd = /<\/(?:ON SUMMON)>/i;
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.onSummonEval = '';
    var evalMode = 'none';

    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(noteStart)) {
        evalMode = 'on summon eval';
      } else if (line.match(noteEnd)) {
        evalMode = 'none';
      } else if (evalMode === 'on summon eval') {
        obj.onSummonEval = obj.onSummonEval + line + '\n';
      } 
    } // End of notedata for loop
  } // End of all item for loop
};
