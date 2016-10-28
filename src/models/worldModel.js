const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const RuleSchema = new mongoose.Schema({
  name: String,
  type: {},
  value: {}
});
const DatasetSchema = new mongoose.Schema({
  name: String,
  minValue: Number,
  maxValue: Number,
  value: [Number]
});

const ShapshotSchema = new mongoose.Schema({
  day: {
    type: Number,
    min: 0,
    unique: true,
    default: 0
  },
  tilt: {
    type: Number,
    min:0,
    max:1,
    required: true,
    default: 0.6
  },
  rotation: {
    type: Number,
    min:0,
    max:3,
    required: true, 
    default: 1
  },
  rules: [mongoose.Schema.ObjectId],
  datasets: [mongoose.Schema.ObjectId],
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

ShapshotSchema.statics.getData = (snapshot, name, res) => {
  return snapshot.data.findOne({name: name}, res);
};
ShapshotSchema.statics.getRule = (snapshot, variable, res) => {
  return snapshot.rows * snapshot.columns * snapshot.plotsPer;
};

const WorldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "Nameless Expanse"
  },
  rows: {
    type: Number,
    min: 1,
    required: true,
    default: 50
  },
  columns: {
    type: Number,
    min: 1,
    required: true,
    default: 80
  },
  plotsPer: {
    type: Number,
    min: 1,
    required: true,
    defaut: 3
  },
  snapshots: [mongoose.Schema.ObjectId],
  createdDate: {
    type: Date,
    default: Date.now,
  }
});
WorldSchema.statics.findByName = (name, res) => {
  const search = {
    name,
  };
 return SnapshotModel.findOne(search, res);
};
WorldSchema.statics.findSnapshotByDay = (world, day, res) => {
  const search = {
    day,
  };
 return world.findOne(search, res);
};
WorldSchema.statics.area = (snapshot, name, res) => {
  return snapshot.rows * snapshot.name;
};
WorldSchema.statics.plantArea = (snapshot, variable, res) => {
  return snapshot.rows * snapshot.columns * snapshot.plotsPer;
};
WorldSchema.statics.decription = (world, res) => {
  return res.json({
    name: world.name
  });
};
 

let WorldModel = mongoose.model('Worlds', WorldSchema);

module.exports.WorldModel = WorldModel;
module.exports.WorldSchema = WorldSchema;