/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let globalId = '' ;

suite('Functional Tests', function() {
  
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */

  test('#example Test GET /api/books', function(done){
    //this.timeout(10000);
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        console.log('res: ', res.body[0]);
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    before(function() {
        
      chai.request(server).post('/api/books')
        .send({"title":"beforeTest"})
        .end(function (err, res) {
          //done();
      });
  
      chai.request(server).get('/api/books')
        .end(function (err, res) {
          globalId = res.body[0]._id;
          console.log('globalId: ', globalId);
          //done();
      });
  
  });


    suite('POST /api/books with title => create book object/expect book object', function() {
      before(function() {
        
        chai.request(server).post('/api/books')
          .send({"title":"beforeTest"})
          .end(function (err, res) {
            //done();
        });
    
        chai.request(server).get('/api/books')
          .end(function (err, res) {
            globalId = res.body[0]._id;
            console.log('globalId: ', globalId);
            //done();
        });
    
    });
      
      test('Test POST /api/books with title', function(done) {
        //this.timeout(10000);
        chai.request(server).post('/api/books')
        .send({title:"FirstBook"})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'FirstBook');
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server).post('/api/books')
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'missing required field title');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      before(function() {
        
        chai.request(server).post('/api/books')
          .send({"title":"beforeTest"})
          .end(function (err, res) {
            //done();
        });
    
        chai.request(server).get('/api/books')
          .end(function (err, res) {
            globalId = res.body[0]._id;
            console.log('globalId: ', globalId);
            //done();
        });
    
    });
      
      test('Test GET /api/books',  function(done){
        chai.request(server).get('/api/books')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server).get('/api/books/false')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'no book exists');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        //this.timeout(10000);
        chai.request(server).get(`/api/books/${globalId}`)
        .end(function (err, res) {
          console.log('resresGlobalId: ', globalId);
          console.log('resres: ', res.body);
          assert.equal(res.status, 200);
          assert.exists(res.body.title);
          assert.exists(res.body._id);
          assert.exists(res.body.comments);
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server).post(`/api/books/${globalId}`)
        .send({comment: 'commentTest'})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.exists(res.body.title);
          assert.exists(res.body._id);
          assert.exists(res.body.comments);
          done();
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server).post(`/api/books/${globalId}`)
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'missing required field comment');
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server).post(`/api/books/notInDb`)
        .send({comment: 'commentTest2'})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'no book exists');
          done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server).delete(`/api/books/${globalId}`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'delete successful');
          done();
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server).delete(`/api/books/notInDb`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'no book exists');
          done();
        });
      });

    });

  });

});
