var LocalStrategy = require('passport-local').Strategy;
var User = require('./user');

module.exports = function(passport){

  // Serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // Handle new user signup
  passport.use('local-signup', new LocalStrategy({passReqToCallback : true},
    function(req, username, password, done) {

      process.nextTick(function() {
        // Check if the user exists
        User.findOne({ username: username }, function(err, user) {
          if (err) { return done(err); }
          if (user) {
            return done(null, false, req.flash('message','Username is already registered'));
          }
          else{
            var newUser = new User();
            newUser.username = username;
            newUser.password = newUser.generateHash(password);
            newUser.contacts = [];
            newUser.save(function(err){
              if(err){throw err;}
              return done(null, newUser);
            });
          }
        });
      });

    }
  ));

  // Handle new user login
  passport.use('local-login', new LocalStrategy({passReqToCallback : true},
    function(req, username, password, done) {
      // Check if the user exists
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        else if (!user) {
          return done(null, false, req.flash('message','User not found'));
        }
        else if (!user.validPassword(password)){
          return done(null, false, req.flash('message', 'Invalid password.'));
        }
        else{
          return done(null, user);
        }
      });
    }
  ));

}
