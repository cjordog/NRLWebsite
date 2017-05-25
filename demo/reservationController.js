var thing = require('./reservation')
var Author = thing.Author;
var Request = thing.Request;
var async = require('async')
var app_main_handler = require(__dirname + '/app');
var user = null;
var message = null;

finduser = function(){
    user = null;
    if(app_main_handler.User!=null){
        user = app_main_handler.User._json.email;
        if(user=='martinckong24@gmail.com' || user=='cjordog@gmail.com'){
            user = 'admin';
        }else{
            user = null;
        }
    }
    return user;
};

findmessage = function(){
    var retval = null;
    if(message!=null){
        retval = message;
        message = null;
    }
    return retval;
}

getDate = function(date){
    day = date.getUTCDay();
    if(day==0){
        return 'Sunday';
    }else if(day==1){
        return 'Monday';
    }else if(day==2){
        return 'Tuesday';
    }else if(day==3){
        return 'Wednesday';
    }else if(day==4){
        return 'Thursday';
    }else if(day==5){
        return 'Friday';
    }else if(day==6){
        return 'Saturday';
    }
}

exports.index = function(req, res) {

    async.parallel({
        author_count: function(callback) {
            Author.count(callback)
        },
    }, function(err, results) {
        /*user = null;
        if(app_main_handler.User!=null){
            user = app_main_handler.User._json.email;
            if(user=='martinckong24@gmail.com'){
                user = 'admin';
            }else{
                user = 'person';
            }
        }*/
        user = finduser();
        if(user!='admin'){
            user = null;
        }
        var date = new Date();
        console.log(date.getUTCHours());
        res.render(__dirname + '/index.pug', { title: 'Reservation Home', error: err, data: results, username: user, message: findmessage()});
    });
};

// Display list of all Authors
exports.reservation_list = function(req, res, next) {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, list_authors) {
      if (err) { return next(err); }
      //Successful, so render
        user = finduser();
        if(user!='admin'){
            user = null;
        }
      res.render(__dirname + '/author_list.pug', { title: 'Reservation List', author_list:  list_authors, username: user, message: findmessage()});
    })

};

exports.request_list = function(req, res, next) {
  if(finduser()==null){
    res.redirect('/error');
  }else{
    Request.find()
      .sort([['family_name', 'ascending']])
      .exec(function (err, list_authors) {
        if (err) { return next(err); }
            //Successful, so render
            user = finduser();
            if(user!='admin'){
                user = null;
            }
            res.render(__dirname + '/author_list.pug', { title: 'Request List', author_list:  list_authors, username: user, message: findmessage()});
        })
  }
};

// Display detail page for a specific Author
exports.reservation_detail = function(req, res, next) {

    async.parallel({
        author: function(callback) {
            Author.findById(req.params.id)
              .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        user = finduser();
        if(user!='admin'){
            user = null;
        }
        res.render(__dirname + '/author_detail.pug', { title: 'Reservation Detail', author: results.author, username: user } );
    });

};

exports.request_detail = function(req, res, next) {
  if(finduser()==null){
    res.redirect('/error');
  }else{
    async.parallel({
        author: function(callback) {
            Request.findById(req.params.id)
              .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        user = finduser();
        if(user!='admin'){
            user = null;
        }
        res.render(__dirname + '/request_detail.pug', { title: 'Request Detail', author: results.author, username: user } );
    });
  }
};

// Display Author create form on GET
exports.reservation_create_get = function(req, res, next) {
        user = finduser();
        if(user!='admin'){
            user = null;
        }
    res.render(__dirname + '/author_form.pug', { title: 'Create Reservation Request', username: user});
};

// Handle Author create on POST
exports.reservation_create_post = function(req, res, next) {

    /*req.checkBody('first_name', 'First name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
    req.checkBody('family_name', 'Family name must be specified.').notEmpty();
    req.checkBody('family_name', 'Family name must be alphanumeric text.').isAlpha();
    req.checkBody('date_of_birth', 'Invalid date').optional({ checkFalsy: true }).isDate();
    req.checkBody('date_of_death', 'Invalid date').optional({ checkFalsy: true }).isDate();*/

    /*req.sanitize('first_name').escape();
    req.sanitize('family_name').escape();
    req.sanitize('first_name').trim();
    req.sanitize('family_name').trim();*/
    //req.sanitize('date_of_birth').toDate();

    var errors = req.validationErrors();
    var realcount = -1;
    var Item;
    if(finduser()!=null){
        Item = Author;
    }else{
        Item = Request;
    }

    var author = new Item(
      { first_name: req.body.first_name,
        family_name: req.body.family_name,
        email: req.body.email,
        date_of_birth: req.body.date_of_birth,
        time: req.body.time,
       });
    console.log(author.first_name);
    console.log(author.family_name);
    console.log(author.email);
    console.log(author.date_of_birth);
    console.log(author.time);

        user = finduser();
        if(user!='admin'){
            user = null;
        }
    if (errors) {
        res.render(__dirname + '/author_form', { title: 'Create Reservation', author: author, errors: errors, username: user});
    return;
    //}else if(taken.isin(together)){
    }else {
        Item.count({date_of_birth:req.body.date_of_birth, time: req.body.time}, function(err, count){
            //console.log( "Number of docs: ", count );
            realcount = count;
            if(realcount<=0){
                author.save(function (err) {
                    if (err) { return next(err); }
                    //successful - redirect to new author record.
                        //res.redirect(author.url);
                        if(Item==Author){
                            message = "Reservation successfully created";
                        }else{
                            message = "Reservation request successfully created. Please wait for admin to approve your request.";
                        }
                        res.redirect('/reservations');
                });
            }else{
                res.render(__dirname + '/author_form.pug', { title: 'Reservation already taken', author: author, username: user});
            }
        });
    }

};

// Display Author delete form on GET
exports.reservation_delete_get = function(req, res, next) {

    async.parallel({
        author: function(callback) {
            Author.findById(req.params.id).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        user = finduser();
        if(user!='admin'){
            user = null;
        }
        res.render(__dirname + '/author_delete.pug', { title: 'Delete Reservation', author: results.author, username: user} );
    });

};

// Handle Author delete on POST
exports.reservation_delete_post = function(req, res, next) {

    req.checkBody('authorid', 'Author id must exist').notEmpty();

    async.parallel({
        author: function(callback) {
          Author.findById(req.body.authorid).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Success
        if (results.authors_books>0) {
            //Author has books. Render in same way as for GET route.
            user = finduser();
            if(user!='admin'){
                user = null;
            }
            res.render(__dirname + '/author_delete', { title: 'Delete Reservation', author: results.author, username: user} );
            return;
        }
        else {
            user = finduser();
            if(user != null){
                //Author has no books. Delete object and redirect to the list of authors.
                Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                    if (err) { return next(err); }
                    //Success - got to author list
                    res.redirect('/reservations')
                })
            }else if((app_main_handler.User == null) || (user != 'admin')){
                res.redirect('/error');
            }
            /*//Author has no books. Delete object and redirect to the list of authors.
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                if (err) { return next(err); }
                //Success - got to author list
                res.redirect('/reservations')
            })*/

        }
    });

};


exports.request_delete_get = function(req, res, next) {
  if(finduser()==null){
    res.redirect('/error');
  }else{
    async.parallel({
        author: function(callback) {
            Request.findById(req.params.id).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        user = finduser();
        if(user!='admin'){
            user = null;
        }
        res.render(__dirname + '/request_delete.pug', { title: 'Delete Request', author: results.author, username: user} );
    });
  }
};

// Handle Author delete on POST
exports.request_delete_post = function(req, res, next) {
  if(finduser()==null){
    res.redirect('/error');
  }else{
    req.checkBody('authorid', 'Author id must exist').notEmpty();

    async.parallel({
        author: function(callback) {
          Request.findById(req.body.authorid).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Success
        if (results.authors_books>0) {
            //Author has books. Render in same way as for GET route.
            user = finduser();
            if(user!='admin'){
                user = null;
            }
            res.render(__dirname + '/request_delete', { title: 'Delete Request', author: results.author, username: user} );
            return;
        }
        else {
                    //Author has no books. Delete object and redirect to the list of authors.
                    Request.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                        if (err) { return next(err); }
                        //Success - got to author list
                        res.redirect('/requests')
                    })
            
            /*//Author has no books. Delete object and redirect to the list of authors.
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                if (err) { return next(err); }
                //Success - got to author list
                res.redirect('/reservations')
            })*/

        }
    });
  }
};

exports.request_approve = function(req, res, next) {
  if(finduser()==null){
    res.redirect('/error');
  }else{
    async.parallel({
        author: function(callback) {
            Request.findById(req.params.id).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        var author = new Author(
          { first_name: results.author.first_name,
            family_name: results.author.family_name,
            email: results.author.email,
            date_of_birth: results.author.date_of_birth,
            time: results.author.time,
       });
        Author.count({date_of_birth:results.author.date_of_birth, time: results.author.time}, function(err, count){
            //console.log( "Number of docs: ", count );
            realcount = count;
            if(realcount<=0){
                author.save(function (err) {
                    if (err) { return next(err); }
                        message = "Request successfully approved.";
                        res.redirect('/reservations');
                });
            }else{
                user = finduser();
                if(user!='admin'){
                    user = null;
                }
                res.render(__dirname + '/request_detail.pug', { title: 'Reservation already taken', author: results.author, username: user});
            }
        });
    });
  }
};

exports.terminal_time = function(req, res){
    if(app_main_handler.User){
        var email = app_main_handler.User._json.email;
        console.log('Yay' + 'Email: ' + email);
        console.log('Verified: ' + app_main_handler.User._json.email_verified);
        var date = new Date();
        var time = date.getUTCHours() - 7;
        var timestring = time.toString() + ':00';
        var datestring = getDate(date);
        Author.count({date_of_birth:datestring, time: timestring, email: email}, function(err, count){
            //console.log( "Number of docs: ", count );
            realcount = count;
            if(realcount<=0){
                message = 'No reservation for ' + email + ' at the current time';
                res.redirect('/catalog');
            }else{
                res.render(__dirname + '/terminal.pug', {username: email});
            }
        });
    }else{
        res.redirect('/login');
    }
};


