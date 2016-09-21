var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.login = function(passport){
  return passport.authenticate('local-login',{
    successRedirect:'/dashboard',
    failureRedirect: '/',
    failureFlash : true
  });
};
// Signup the user
exports.signup = function(passport){
  return passport.authenticate('local-signup',{
    successRedirect:'/dashboard',
    failureRedirect: '/',
    failureFlash : true
  });
};
// Logout
exports.logout = function(req,res,next){
  req.logout();
  res.redirect('/');
};
// ADD a user contact
exports.addContact = function(req,res,next){
  var contact = req.body;
  contact._id = mongoose.Types.ObjectId();
  // console.log("Adding contact",req.body)
  User.update(
    {'_id':req.user._id},
    {'$push':{'contacts':req.body}},
    function(err,newContact) {
      if(err){
        console.log("Error upserting contact",err);
        res.json({success:false});
      }
      else{
        //console.log("Added new contact",newContact);
        res.json({success:true,contact:contact});
      }
	  }
  );
};
// EDIT a user contact
exports.editContact = function(req,res,next){
  var contact = req.body;
  //console.log("Editing contact",contact);
  User.update(
    {'_id':req.user._id,'contacts._id':contact._id},
    {'$set':{'contacts.$':contact}},
    function(err,result){
      if(err){
        console.log("Error upserting contact",err);
        res.json({success:false});
      }
      else{
        //console.log("Added new contact",newContact);
        res.json({success:true,contact:contact});
      }
	  }
  );
};
// DELETE a users contact
exports.deleteContact = function(req,res,next){
  var contact = req.body;
  //console.log("Deleting contact...",contact)
  User.update(
    {'_id':req.user._id},
    {'$pull':{'contacts':{"_id":contact._id}}},
    function(err,result) {
      if(err){
        console.log("Error deleting contact",err);
        res.json({success:false});
      }
      else{
        //console.log("Deleted contact",result);
        res.json({success:true,contact:contact._id});
      }
	  }
  );
};
