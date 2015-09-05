import * as Mongoose from 'mongoose';
Mongoose.connect('mongodb://localhost/robot');

module.exports = Mongoose;