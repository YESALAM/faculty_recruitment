var passport = require('passport');
var Account = require('./models/account');
var Application = require('./models/application');
var Const = require('./const');

module.exports = function (app) {

  app.get('/', function (req, res) {
      res.render('index', {user : req.user });
  });

  app.get('/new',isLoggedIn, function(req, res){
    res.render('new', { user : req.user });
  });

  app.get('/my',isLoggedIn, function(req, res){
    var email = req.user.username;
    Application.find({email:email}, function(err,applications){
      if (err) console.log('Error in finding applications');
      if (applications) res.render('my',{user : req.user, applications:applications})
      //res.render('my', { user : req.user });
    });
   
  });

  app.post('/createnew',isLoggedIn, function(req,res){ 
    var user = req.user;
    var adv_no = req.body.advertisement_no;
    var department = req.body.department;
    var post_applied_for = req.body.post_applied_for;
    Application.findOne({
      email:user.username,
      adv_no:adv_no,
      department:department,
      post_applied_for: post_applied_for
    }, function(err,application){
      if (err) console.log('Error is finding applications');
      if (application) res.render('new',{message:'This application is already created.',user: req.user});
      else {
        Application.countDocuments({}, function(err, count){
          if (err) console.log('Error in counting applications');
          var application = new Application();
        application.adv_no = adv_no ;
        application.email = user.username;
        application.no = post_applied_for+department+count;
        application.department = department;
        application.post_applied_for = post_applied_for;
        application.status = 'Pending';
        application.department_full = Const.departments()[department];
        application.post_applied = Const.posts()[post_applied_for];
        console.log(application.department);
        application.save(function(err){
          if (err) console.log('Error in creating application');
          res.redirect('/my');
        })
        
        });

        
      }
    })
  });

  app.get('/register', function(req, res) {
      res.render('register', { message:req.flash('signupMessage')[0]});
  });

  app.post('/register', passport.authenticate('local-signup',{
    successRedirect:'/home',
    failureRedirect:'/register',
    failureFlash:true
  }));

  app.get('/home',isLoggedIn,function(req,res){
    res.render('home', { user : req.user });
  });

  app.post('/home',isLoggedIn,function(req,res){
    res.render('home', { user : req.user });
  });

  app.all('/test',function(req,res){
      res.render('test',{ message : req.flash('loginMessage')[0],user : req.user });
  });

  app.get('/login', function(req, res) {
      res.render('login', { message : req.flash('loginMessage')[0],user : req.user });
  });

  app.post('/login', passport.authenticate('local-login',
                        {successRedirect:'/home',
                         failureRedirect:'/login',
                         failureFlash:true,
                        }));

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  app.get('/ping', function(req, res){
      res.send("pong!", 200);
  });

  function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
      return next();
  }
  res.render('login',{message: 'OPPS ! Log In please'});
  }
  
  

};


