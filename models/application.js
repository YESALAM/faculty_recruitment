var mongoose = require('mongoose'),
    Schema = mongoose.Schema ;


    var Application = new Schema({
        no: String,
        email: String,        
        name: String,
        adv_no: String,
        department: String,
        department_full: String,
        post_applied_for: String,
        post_applied: String,
        status: String
    });



    module.exports = mongoose.model('Application', Application);