var mongoose = require('mongoose');
var moment = require('moment'); //for date handling

var Schema = mongoose.Schema;

var TimeSchema = Schema(
    {
    date_of_birth: { type: String },
    time: {type: String}
    }
  );
var time_db = mongoose.model('time', TimeSchema);
//module.exports = mongoose.model('time', TimeSchema);

var RequestSchema = Schema({
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
    date_of_birth: { type: String },
    time: {type: String}
});

RequestSchema
.virtual('name')
.get(function () {
  return this.family_name +', '+this.first_name;
});

// Virtual for this author instance URL
RequestSchema
.virtual('url')
.get(function () {
  return '/request/'+this._id
});

RequestSchema
.virtual('lifespan')
.get(function () {
  var lifetime_string='';
  return this.date_of_birth + " " + this.time;
  /*if (this.date_of_birth) {
      lifetime_string=moment(this.date_of_birth).format('MMMM DD, YYYY');
      }*/
  //return this.date_of_birth;
});
var request_db = mongoose.model('Request', RequestSchema);

var AuthorSchema = Schema(
    {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
    date_of_birth: { type: String },
    time: {type: String}
    }
  );

// Virtual for author "full" name
AuthorSchema
.virtual('name')
.get(function () {
  return this.family_name +', '+this.first_name;
});

// Virtual for this author instance URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/reservation/'+this._id
});

AuthorSchema
.virtual('lifespan')
.get(function () {
  var lifetime_string='';
  return this.date_of_birth + " " + this.time;
  /*if (this.date_of_birth) {
      lifetime_string=moment(this.date_of_birth).format('MMMM DD, YYYY');
      }*/
  //return this.date_of_birth;
});

AuthorSchema
.virtual('date_of_birth_yyyy_mm_dd')
.get(function () {
  return this.date_of_birth;
  //return moment(this.date_of_birth).format('YYYY-MM-DD');
});

//Export model
var author_db = mongoose.model('Author', AuthorSchema);
//module.exports = mongoose.model('Author', AuthorSchema);

var all_models = {'Time': time_db, 'Author': author_db, 'Request': request_db};
module.exports = all_models;