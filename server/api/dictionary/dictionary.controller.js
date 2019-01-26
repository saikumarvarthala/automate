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
import Dictionary from './dictionary.model';

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
