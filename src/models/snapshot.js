const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let SnapshotModel = {};

const convertId = mongoose.Types.ObjectId;

const SnapshotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'Nameless Expanse',
  },
  rows: {
    type: Number,
    min: 1,
    required: true,
    default: 50,
  },
  columns: {
    type: Number,
    min: 1,
    required: true,
    default: 80,
  },
  plotsPer: {
    type: Number,
    min: 1,
    required: true,
    defaut: 3,
  },
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
  rules: mongoose.Schema.Types.Mixed,
  // rules: [
  //   {
  //     name: String,
  //     type: String,
  //     value: mongoose.Schema.Types.Mixed,
  //   },
  // ],
  datasets: mongoose.Schema.Types.Mixed,
  // datasets: [
  //   {
  //     name: String,
  //     minValue: Number,
  //     maxValue: Number,
  //     value: [Number],
  //   },
  // ],
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

SnapshotSchema.statics.toAPI = doc => ({
  // _id is built into your mongo document and is guaranteed to be unique
  name: doc.name,
  rows: doc.rows,
  columns: doc.columns,
  plotsPer: doc.plotsPer,
  day: doc.day,
  tilt: doc.tilt,
  rotation: doc.rotations,
  rules: doc.rules,
  datasets: doc.datasets,
});

SnapshotSchema.statics.findByNameAndOwner = (name, ownerId, searchParameters, res) => {
  const search = {
    name,
    owner: convertId(ownerId),
  };
  return SnapshotModel.find(search).select(searchParameters).exec(res);
};
SnapshotSchema.statics.findByNameDayAndOwner = (name, day, ownerId, searchParameters, res) => {
  const search = {
    name,
    day,
    owner: convertId(ownerId),
  };
  return SnapshotModel.find(search).select(searchParameters).exec(res);
};
SnapshotSchema.statics.findById = (id, searchParameters, res) => {
  const search = {
    _id: id,
  };
  return SnapshotModel.findOne(search).select(searchParameters).exec(res);
};
SnapshotSchema.statics.findByOwner = (ownerId, searchParameters, res) => {
  const search = {
    owner: convertId(ownerId),
  };
  return SnapshotModel.find(search).select(searchParameters).exec(res);
};
SnapshotSchema.statics.findUniquesByOwner = (ownerId, searchParameters, res) => {
  const search = {
    owner: convertId(ownerId),
  };
  return SnapshotModel
    .find(search)
    .select(searchParameters)
    .exec(res);
};

SnapshotModel = mongoose.model('snapshots', SnapshotSchema);

module.exports.allData = "name rows columns day tilt rotation rules datasets";
module.exports.descriptionData = "name rows columns rules";

module.exports.SnapshotModel = SnapshotModel;
module.exports.SnapshotSchema = SnapshotSchema;
