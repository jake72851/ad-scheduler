const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    _id: {
      type: String,
      require: true,
    },
    data: {
      type: Object,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('test', schema);
