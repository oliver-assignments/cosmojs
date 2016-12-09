// const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

// const RuleSchema = new mongoose.Schema({
//   name: String,
//   type: {},
//   value: {},
// });
// const DatasetSchema = new mongoose.Schema({
//   name: String,
//   minValue: Number,
//   maxValue: Number,
//   value: [Number],
// });

// const ShapshotSchema = new mongoose.Schema({
//   day: {
//     type: Number,
//     min: 0,
//     unique: true,
//     default: 0,
//   },
//   tilt: {
//     type: Number,
//     min: 0,
//     max: 1,
//     required: true,
//     default: 0.6,
//   },
//   rotation: {
//     type: Number,
//     min: 0,
//     max: 3,
//     required: true,
//     default: 1,
//   },
//   rules: [mongoose.Schema.ObjectId],
//   datasets: [mongoose.Schema.ObjectId],
//   createdDate: {
//     type: Date,
//     default: Date.now,
//   },
// });

// ShapshotSchema.statics.getData = (snapshot, name, res) =>
// snapshot.data.findOne({ name }, res);
// ShapshotSchema.statics.getRule = (snapshot, variable, res) =>
// snapshot.rows * snapshot.columns * snapshot.plotsPer;

// module.exports.ShapshotSchema = ShapshotSchema;
