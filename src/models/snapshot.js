const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let SnapshotModel = {};

const convertId = mongoose.Types.ObjectId;

const ShapshotSchema = new mongoose.Schema({
  day: {
    type: Number,
    min: 0,
    default: 0,
  },
  tilt: {
    type: Number,
    min: 0,
    max: 1,
    required: true,
    default: 0.6,
  },
  rotation: {
    type: Number,
    min: 0,
    max: 3,
    required: true,
    default: 1,
  },
  rules: [
    {
      name: String,
      type: mongoose.Schema.Types.Mixed,
      value: mongoose.Schema.Types.Mixed,
    },
  ],
  datasets: [
    {
      name: String,
      minValue: Number,
      maxValue: Number,
      value: [Number],
    },
  ],
  world: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'accounts',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

ShapshotSchema.statics.toAPI = doc => ({
  // _id is built into your mongo document and is guaranteed to be unique
  day: doc.day,
  tilt: doc.tilt,
  rotation: doc.rotations,
  rules: doc.rules,
  datasets: doc.datasets,
});

ShapshotSchema.statics.findByWorldNameAndOwner = (worldName, ownerId, res) => {
  const search = {
    world: worldName,
    owner: convertId(ownerId),
  };
  return SnapshotModel.find(search).select('day tilt rotation rules datasets').exec(res);
};

ShapshotSchema.statics.findByID = (id, res) => {
  const search = {
    _id: id,
  };
  return SnapshotModel.findOne(search).select('day tilt rotation rules datasets').exec(res);
};

SnapshotModel = mongoose.model('Snapshots', ShapshotSchema);

module.exports.SnapshotModel = SnapshotModel;
module.exports.ShapshotSchema = ShapshotSchema;
