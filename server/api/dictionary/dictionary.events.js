/**
 * Dictionary model events
 */

import {EventEmitter} from 'events';
var DictionaryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DictionaryEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Dictionary) {
  for(var e in events) {
    let event = events[e];
    Dictionary.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    DictionaryEvents.emit(event + ':' + doc._id, doc);
    DictionaryEvents.emit(event, doc);
  };
}

export {registerEvents};
export default DictionaryEvents;
