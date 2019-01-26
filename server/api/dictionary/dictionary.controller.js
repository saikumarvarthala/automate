/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/dictionaries              ->  index
 * POST    /api/dictionaries              ->  create
 * GET     /api/dictionaries/:id          ->  show
 * PUT     /api/dictionaries/:id          ->  upsert
 * PATCH   /api/dictionaries/:id          ->  patch
 * DELETE  /api/dictionaries/:id          ->  destroy
 */

import { applyPatch } from 'fast-json-patch';
import { resolve } from 'q';
// import Dictionary from './dictionary.model';

var Dictionary = require("oxford-dictionary");
var config = {
    app_id : "e2ad1469",
    app_key : "a65d8b4a99cc7919a807c1630e2e0de8",
    source_lang : "en"
};
var dict = new Dictionary(config);

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if(entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function patchUpdates(patches) {
    return function(entity) {
        try {
            applyPatch(entity, patches, /*validate*/ true);
        } catch(err) {
            return Promise.reject(err);
        }

        return entity.save();
    };
}

function removeEntity(res) {
    return function(entity) {
        if(entity) {
            return entity.remove()
                .then(() => res.status(204).end());
        }
    };
}

function handleEntityNotFound(res) {
    return function(entity) {
        if(!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode).send(err);
    };
}

// Gets a list of Dictionarys
export function index(req, res) {
    return Dictionary.find().exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Dictionary from the DB
export function show(req, res) {
    return Dictionary.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Dictionary in the DB
export function create(req, res) {
    return Dictionary.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given Dictionary in the DB at the specified ID
export function upsert(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Dictionary.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing Dictionary in the DB
export function patch(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Dictionary.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Dictionary from the DB
export function destroy(req, res) {
    return Dictionary.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

    export function definition(req, res) {
        var dic= dict.definitions(req.body.word);
        dic.then(function(value){
            res.json(value)
        },function(err){
            res.json(err);
        })
    }
    export function synonym(req, res) {
        var sys =  dict.synonyms(req.body.word);
        sys.then(function(value){
            res.json(value)
        },function(err){
            res.json(err);
        })
    }

    export function antonym(req, res) {
        var ant =  dict.antonyms(req.body.word);
        ant.then(function(value){
            res.json(value)
        },function(err){
            res.json(err);
        })
    }

    export function example(req, res) {
        var example =  dict.examples(req.body.word);
        example.then(function(value){
            res.json(value)
        },function(err){
            res.json(err);
        })
    }
    export async function allWordDetails(req, res) {
        var definition  = await dict.definitions(req.body.word);
        var antonym     = await dict.antonyms(req.body.word);
        var synonym     = await dict.synonyms(req.body.word);
        var example     = await dict.examples(req.body.word);
        var obj={
            defintion: definition,
            antonyms : antonym,
            synonyms : synonym,
            example  : example
        }
        res.json(obj);
    }
    export function wordOfTheDay(req, res) {
        var obj={
            "discriminating":"showing or indicating careful judgment and discernment",
            "superb"	    : "surpassingly good",
            "compunction"	: "a feeling of deep regret, usually for some misdeed",
            "ashen"	        : "pale from illness or emotion",
            "prevail"	    : "be larger in number, quantity, power, status or importance",
            "ellipsis"      : "omission or suppression of parts of words or sentences",
            "pharisaical"	: "excessively or hypocritically pious",
            "cohere"	    : "cause to form a united, orderly, and consistent whole",
            "opulence"	    : "wealth as evidenced by sumptuous living",
            "conserve"	    : "keep in safety and protect from harm, loss, or destruction",
            "quadrennium"	: "a period of four years",
            "privy"	        : "informed about something secret or not generally known",
            "conifer"	    : "a type of tree or shrub bearing cones",
            "specify"	    : "be particular about",
            "icon"	        : "a visual representation produced on a surface",
            "forecast"	    : "a prediction about how something will develop",
            "intervening"	: "occurring or falling between events or points in time",
            "import"	    : "bring in from abroad",
            "reduce"	    : "make smaller",
            "taint"	        : "place under suspicion or cast doubt upon",
            "inventory"	    : "a detailed list of all the items in stock",
            "contrived"	    : "showing effects of planning or manipulation",
            "laud"	        : "praise, glorify, or honor",
            "tensile"	    : "of or relating to physical stress or strain",
            "embark"	    : "go on board",
            "vagary"	    : "an unexpected and inexplicable change in something",
            "fanciful"	    : "indulging in or influenced by the imagination",
            "feral"	        : "wild and menacing",
            "scour"	        : "rub hard or scrub",
            "exodus"	    : "a journey by a group to escape from a hostile environment",
            "expurgate"	    : "edit by omitting or modifying parts considered indelicate",
            "reassure"	    : "cause to feel confident",
            "appurtenance"	: "equipment consisting of miscellaneous articles",
            "thereby"	    : "by that means or because of that",
            "lackluster"	: "lacking brilliance or vitality",
            "astral"	    : "being or relating to or resembling or emanating from stars",
            "gather"	    : "assemble or get together",
            "chastise"	    : "censure severely",
            "predecessor"	: "one who precedes you in time",
            "lethal"	    : "of an instrument of certain death"
            }
        // Random Key
        var random=Math.floor(Math.random()*Object.keys(obj).length)
        res.json(Object.keys(obj)[random]+":"+obj[Object.keys(obj)[random]])
    }