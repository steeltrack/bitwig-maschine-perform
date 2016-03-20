/**
 * Callbacks for observers and other listeners.
 */

/**
 * Generic boolean check.
 */
function checkBoolean(index, note, varToStore) {
  return function(boolCheck) {
    reactBoolean(boolCheck, index, note, varToStore);
  }
}

/**
 * Generic boolean check for clips.
 */
function checkBooleanClip(index, note, varToStore) {
  return function(clipIndex, boolCheck) {
    reactBoolean(boolCheck, index, note, varToStore);
  }
}

/**
 * React to boolean checks by storing values or setting leds.
 */
function reactBoolean(boolCheck, index, note, varToStore) {
  if (varToStore != null) {
    varToStore[index] = boolCheck;
  }
  if (note != null) {
    var state = (boolCheck) ? 'on' : 'off';
    leds.setSingle(note, state);
  }
}

/**
 * Generic label observer function.
 */
function getLabelObserverFunc(index, varToStore, position) {
  return function(value) {
    varToStore[index] = value;
    var message = (value == '' || value == 'none ') ? '______' : value;
    messages.writeMessage(messages.fixLength(message, 7), position);
  }
}

/**
 * Check the transport position.
 */
function checkPosition() {
  return function(value) {

    // Get subdivision value so we can key off it to blink leds.
    var subDivision = value.substr(4, 5);

    // Iterate over tracks to see if they are recording.
    for (var i = 0; i < 8; i++) {
      var state = 'off';
      // Check if clip is queued to record and blink tempo * 4.
      if (m.trackRecordingQueued[i]) {
        state = (subDivision % 2 == 1) ? 'on' : 'off';
        leds.setSingle(mapping.trackRecord.min + i, state);
      }
      // Check if clip is recording blink tempo * 2.
      else if (m.trackRecording[i]) {
        state = (subDivision < 3) ? 'on' : 'off';
        leds.setSingle(mapping.trackRecord.min + i, state);
      }
    }
  }
}

/**
 * Check if transport is playing.
 */
function checkTransportPlaying() {
  return function(playing) {
    if (playing) {
      leds.setSingle(mapping.nav.start, 'on');
      m.stopped = false;
    }
    else {
      // Turn off all applicable lights if stopped.
      leds.setGroup(mapping.group.min, mapping.group.max, 'off');
      leds.setGroup(mapping.trackRecord.min, mapping.trackRecord.max, 'off');
      leds.setSingle(mapping.nav.start, 'off');
      m.stopped = true;
    }
  }
}

/**
 * Get the value and send to the vpots displays.
 */
function checkPotValue(index, varToStore) {
  return function(value) {
    if (varToStore[index] != value) {
      varToStore[index] = value;
      messages.sendVpotLinear(index, value);
    }
  }
}