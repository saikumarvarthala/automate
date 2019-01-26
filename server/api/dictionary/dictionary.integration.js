/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newDictionary;

describe('Dictionary API:', function() {
  describe('GET /api/dictionaries', function() {
    var dictionarys;

    beforeEach(function(done) {
      request(app)
        .get('/api/dictionaries')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          dictionarys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      dictionarys.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/dictionaries', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/dictionaries')
        .send({
          name: 'New Dictionary',
          info: 'This is the brand new dictionary!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newDictionary = res.body;
          done();
        });
    });

    it('should respond with the newly created dictionary', function() {
      newDictionary.name.should.equal('New Dictionary');
      newDictionary.info.should.equal('This is the brand new dictionary!!!');
    });
  });

  describe('GET /api/dictionaries/:id', function() {
    var dictionary;

    beforeEach(function(done) {
      request(app)
        .get(`/api/dictionaries/${newDictionary._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          dictionary = res.body;
          done();
        });
    });

    afterEach(function() {
      dictionary = {};
    });

    it('should respond with the requested dictionary', function() {
      dictionary.name.should.equal('New Dictionary');
      dictionary.info.should.equal('This is the brand new dictionary!!!');
    });
  });

  describe('PUT /api/dictionaries/:id', function() {
    var updatedDictionary;

    beforeEach(function(done) {
      request(app)
        .put(`/api/dictionaries/${newDictionary._id}`)
        .send({
          name: 'Updated Dictionary',
          info: 'This is the updated dictionary!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedDictionary = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDictionary = {};
    });

    it('should respond with the updated dictionary', function() {
      updatedDictionary.name.should.equal('Updated Dictionary');
      updatedDictionary.info.should.equal('This is the updated dictionary!!!');
    });

    it('should respond with the updated dictionary on a subsequent GET', function(done) {
      request(app)
        .get(`/api/dictionaries/${newDictionary._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let dictionary = res.body;

          dictionary.name.should.equal('Updated Dictionary');
          dictionary.info.should.equal('This is the updated dictionary!!!');

          done();
        });
    });
  });

  describe('PATCH /api/dictionaries/:id', function() {
    var patchedDictionary;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/dictionaries/${newDictionary._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Dictionary' },
          { op: 'replace', path: '/info', value: 'This is the patched dictionary!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedDictionary = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedDictionary = {};
    });

    it('should respond with the patched dictionary', function() {
      patchedDictionary.name.should.equal('Patched Dictionary');
      patchedDictionary.info.should.equal('This is the patched dictionary!!!');
    });
  });

  describe('DELETE /api/dictionaries/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/dictionaries/${newDictionary._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when dictionary does not exist', function(done) {
      request(app)
        .delete(`/api/dictionaries/${newDictionary._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
