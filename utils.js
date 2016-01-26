"use strict";
var utils = {
  formatTime: function(date){
    if(date == null){
      return null;
    }
    var str = ("0" + date.getHours()).slice(-2);
    str += ":";
    var min = date.getMinutes();
    str += ("0" + min).slice(-2);
    return str;
  },
  getMidnight: function(date){
    var tmp = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return tmp;
  },
  getDateFromHourAndMinuteStr: function(str, midnight){
    if(str == null){
      return null;
    }
    var tmp = str.split(":");
    return utils.getDateFromHourAndMinute(tmp[0],tmp[1],midnight);
  },
  getDateFromHourAndMinute: function(hour, minute, midnight){
    if(midnight == null){
      midnight = utils.getMidnight(new Date());
    }
    var timeInMs = midnight.getTime();
    timeInMs += hour * 60 * 60 * 1000;
    timeInMs += minute * 60 * 1000;
    var tmp = new Date(timeInMs);
    if(tmp.toString() === "Invalid Date"){
      return null;
    }
    return tmp;
  }
};
module.exports = utils;
