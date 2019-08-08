/**
 * Create by chenpengan on 2019/8/7
 */
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const Poi = new Schema({
  name: {
    type: String // 景点名称
  },
  province: {
    type: String
  },
  city: {
    type: String
  },
  county: {
    type: String
  },
  areaCode: {
    type: String
  },
  tel: {
    type: String
  },
  area: {
    type: String
  },
  addr: {
    type: String
  },
  type: {
    type: String
  },
  module: {
    type: String
  },
  longitude: {
    type: Number
  },
  latitude: {
    type: Number
  }
})
export default mongoose.model('Poi', Poi)
