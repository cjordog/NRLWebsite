var mongoose = require('mongoose');
var moment = require('moment'); //for date handling

var Schema = mongoose.Schema;

var TimeSchema = Schema(
    {
    date_of_birth: { type: String },
    time: {type: String}
    }
  );
module.exports = mongoose.model('time', TimeSchema);

var AuthorSchema = Schema(
    {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
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
module.exports = mongoose.model('Author', AuthorSchema);