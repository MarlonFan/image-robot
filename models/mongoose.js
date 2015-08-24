var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/robot');

module.exports = mongoose;