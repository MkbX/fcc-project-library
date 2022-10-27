/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {

  const mongoose = require('mongoose');
  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on("connected", ()=> console.log('Connected to database!'));
  db.on("error", (error)=> console.log('Error: ', error));

  const bookSchema = new mongoose.Schema({
    title: String,
    comments: [String],
  commentcount: {type: Number, default: 0 /*function(){return this.comments.length;}*/}
  });

  /*bookSchema.virtual('commentcount').get(()=>{
    return this.comments.length;
  });*/

  const bookCollection = new mongoose.model('Book', bookSchema);

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      bookCollection.find({}, (err, data)=>{
        if(err) {
          return res.json(err);
        }
        console.log('data: ', data);
        res.json(data/*data.map(e=>{e=e.toObject();e.commentcount = e.comments.length;return e;})*/);
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!req.body.title) {
        res.json('missing required field title');
      } else {
        let postedBook = new bookCollection({
          title: title,
          comments: []
        });
        postedBook.save((err, doc)=>{
          if(err) {
            return res.json(err);
          }
          console.log('Saved doc: ' , doc);
  
        });
        res.json({title: postedBook.title, _id: postedBook._id });
      }
      
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      bookCollection.deleteMany({})
      .then(()=>res.json('complete delete successful'))
      .catch(error=>res.json(error));
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      console.log('isValidObjectId: ',mongoose.Types.ObjectId.isValid(bookid));
      if(!mongoose.Types.ObjectId.isValid(bookid)) {
        res.json('no book exists');
      } else {
        bookCollection.findById({_id: bookid}, (err, data)=>{
          if(err) {
            return console.log(err);
          }
          let foundId = (data == null) ? {_id: 'false'}: data.toObject();
          console.log(foundId);
          if(bookid != foundId._id) {
            res.json('no book exists');
          } else {
            console.log('data: ', data);
          /*let dataWithCommentcount = data.toObject();
          dataWithCommentcount.commentcount = dataWithCommentcount.comments.length;*/
          res.json(/*dataWithCommentcount*/data);
  
          }          
          
        });

      }
      
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!mongoose.Types.ObjectId.isValid(bookid)) {
        res.json('no book exists');
      } else {
        bookCollection.findById({_id: bookid}, (err, data)=>{
          if(err) {
            return console.log('foundId error: ', err);
          }
          console.log('foundId: ', data);
          /*foundId.commentcount = foundId.comments.length;
          console.log('data.toObject2: ', foundId);
          console.log('dfgh:', foundId);*/
          let foundId = (data == null) ? {_id: 'false'}: data.toObject();
        if(!comment) {
          res.json('missing required field comment');
        } else if(bookid != foundId._id) {
          res.json('no book exists');
        } else {
          console.log('data.toObject3: ', foundId);
          data.comments.push(comment);
          data.commentcount++;
          data.save((err, doc)=>{
            if(err) {
              return console.log(err);
            }
            console.log('Saved doc.comments++: ' , doc);
    
          });
          /*foundId.commentcount = foundId.comments.length;
          console.log('data.toObject2: ', foundId);*/
          //let dataWithCommentcount2 = foundId.toObject();
          //dataWithCommentcount2.commentcount = dataWithCommentcount2.comments.length;
          res.json(data);
        }
  
        });

      }
      
      
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if(!mongoose.Types.ObjectId.isValid(bookid)) {
        res.json('no book exists');
      } else {
        bookCollection.findById({_id: bookid}, (err, data)=>{
          if(err) {
            return console.log('foundId error: ', err);
          }
          let foundId = (data == null) ? {_id: 'false'}: data.toObject();
        if(bookid != foundId._id) {
          res.json('no book exists');
        } else {
          bookCollection.deleteOne({_id: bookid})
          .then(()=>res.json('delete successful'))
          .catch(error=>res.json(error));
          
        }
  
        });

      }
      
      
    });
  
};
