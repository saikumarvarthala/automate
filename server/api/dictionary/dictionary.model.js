import mongoose from 'mongoose';
import {registerEvents} from './dictionary.events';

var DictionarySchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(DictionarySchema);
export default mongoose.model('Dictionary', DictionarySchema);
