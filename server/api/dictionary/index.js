var express = require('express');
var controller = require('./dictionary.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

router.post('/definition',controller.definition);
router.post('/synonyms',controller.synonyms);
router.post('/antonyms',controller.antonyms);


module.exports = router;
