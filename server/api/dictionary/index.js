var express = require('express');
var controller = require('./dictionary.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);


//apis for automate.io
router.post('/definition',controller.definition);
router.post('/synonym',controller.synonym);
router.post('/antonym',controller.antonym);
router.post('/example',controller.example);
router.post('/all/deatils/of/word',controller.allWordDetails);
router.get('/word/of/the/day',controller.wordOfTheDay);


module.exports = router;
