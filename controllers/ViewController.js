var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.index = function(req, res) {
  res.render('home.ejs',{ message: req.flash('message') });
}

exports.dashboard = function(req,res){
  // Get Contacts
  User.findOne({'_id':req.user._id}, function(err,user) {
    if(err){
      console.log("Error getting contacts");
      res.render('dashboard.ejs',{user: req.user, contacts: []});
    }
    else{
      //console.log("Contacts successfully retrieved");
      res.render('dashboard.ejs',{user: req.user, contacts: user.contacts});
    }
  });
}
