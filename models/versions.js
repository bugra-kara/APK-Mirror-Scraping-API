const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const versionsSchema = new Schema({
 version_id: {
  type: String,
  required: true
 },
 release_date: {
  type: Date,
 },
 v_variants: [{
  variant_id: {
   type: Number,
   required: true
  },
  architecture: {
   type: String,
   required: true
  },
  min_android_version: {
   type: Number,
   required: true
  },
  screen_dpi: {
   type: Array,
   required: true
  }
 }]
 },
 {
 virtuals: true,
 timestamps: true
 }
);

const Versions = mongoose.model('Versions', versionsSchema);

module.exports = Versions;