const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let WorldModel = {};

const convertId = mongoose.Types.ObjectId;

const WorldSchema = new mongoose.Schema({
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

WorldSchema.statics.toAPI = doc => ({
  // _id is built into your mongo document and is guaranteed to be unique
  name: doc.name,
  rows: doc.rows,
  columns: doc.columns,
  plotsPer: doc.plotsPer,
  //snapshots: doc.snapshots,
});

WorldSchema.statics.findByName = (name, res) => {
  const search = {
    name,
  };
  return WorldModel.findOne(search, res);
};
WorldSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return WorldModel.find(search).select('name rows columns plotsPer').exec(callback);
};

WorldModel = mongoose.model('Worlds', WorldSchema);

module.exports.WorldModel = WorldModel;
module.exports.WorldSchema = WorldSchema;
