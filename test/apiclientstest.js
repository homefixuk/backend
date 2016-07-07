var should = require('should');
var assert = require('assert');
var request = require('supertest');
var env = process.env.NODE_ENV || 'dev'
var config = require('../config')[env]
var mongoose = require('mongoose');
var ApiClient = require('../models/apiclient');
var User = require('../models/user');


describe('API Client Test', function () {

    var url = 'http://localhost:3000/api/v1';
    var testClientId;
    var testClientApiKey;
    var testCreateClientId;
    var newUserId;

    before(function (done) {
        mongoose.connect(config.mongoUrl, function (err) {
            if (err) throw error;
            var apiclient = new ApiClient({'description': 'test-setup-client'});
            apiclient.save(function (err, newClient) {
                if (err) {
                    throw err
                } else {
                    testClientId = newClient._id;
                    testClientApiKey = newClient.apiKey;
                    done();
                }
            });
            
        });
    });


    describe('Get Client', function () {
        it('should get an existing client', function (done) {
            
            request(url)
                .get('/ApiClient/' + testClientId)
                .end(function (err, res) {
                    if (err) {
                        console.log('Error',err);
                    }
                    res.should.have.property('status', 200);
                    res.body.should.have.property('description', 'test-setup-client')
                    res.body.should.have.property('apiKey', testClientApiKey);
                    done();
                })
        })
    });

    describe('Create Client', function () {
        it('should return new api client', function (done) {
            var client = {
                description: 'test-api-client'
            };
            request(url)
                .post('/ApiClient')
                .send(client)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 201);
                    res.body.should.have.property('apiKey');
                    res.body.should.have.property('description');
                    testCreateClientId = res.body._id;
                    done();
                });
        });
    });

    describe('ApiClients should be able to signup new Users', function () {

        it('should return a new user', function (done) {
                var user = {
                    apikey: testClientApiKey
                }
                request(url)
                    .post('/signup')
                    .send(user)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        console.log('Response:',res.body)
                        res.status.should.equal(302);
                        res.header['location'].should.include('/unauthorized');                        
                        newUserId = res.body._id;
                        done();
                    })
            }
        )

    });

    after(function (done) {
        ApiClient.find({_id: testClientId}).remove().exec();
        ApiClient.find({_id: testCreateClientId}).remove().exec();
        User.find({_id:newUserId}).remove().exec();
        done();
    })
});

