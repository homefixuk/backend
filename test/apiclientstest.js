var should = require('should');
var assert = require('assert');
var request = require('supertest');
var env = process.env.NODE_ENV || 'dev'
var config = require('../config')[env]
var mongoose = require('mongoose');
var ApiClient = require('../models/apiclient');


describe('API Client Test', function () {

    var url = 'http://localhost:3000/api/v1/ApiClient/';
    var testClientId;
    var testClientApiKey;
    var testCreateClientId;

    before(function (done) {
        mongoose.connect(config.mongoUrl,function(err){

            if(err) throw error;

            var apiclient = new ApiClient({'description':'test-setup-client'});
            apiclient.save(function(err, newClient){
                if(err){
                    throw err
                }else{
                    testClientId = newClient._id;
                    testClientApiKey = newClient.apiKey;
                }
            })

            done();

        });
        
    });


    describe('Get Client',function(){
        it('should get an existing client',function(done){

            request(url)
                .get(testClientId)
                .end(function(err,res){
                    if(err){
                        throw err;
                    }
                    res.should.have.property('status',200);
                    res.body.should.have.property('description','test-setup-client')
                    res.body.should.have.property('apiKey',testClientApiKey);
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
                .post('')
                .send(client)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status',201);
                    res.body.should.have.property('apiKey');
                    res.body.should.have.property('description');
                    testCreateClientId = res.body._id;
                    done();
                });
        });
    });

    after(function(done){
        ApiClient.find({_id:testClientId}).remove().exec();
        ApiClient.find({_id:testCreateClientId}).remove().exec();
        done();
    })
});

