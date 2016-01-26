"use strict";
var fs = require("fs");
var utils = require('./utils');
var tasklogic = {
  writeToFile: function(targetDate, taskList){
    var fileName = tasklogic.createFileName(targetDate);
    if(taskList.length === 0){
      fs.access(fileName, fs.F_OK, function(err){
        if(!err){
          fs.unlink(fileName,function(){});
        }
      });
    }else{
      fs.writeFileSync(fileName,JSON.stringify(taskList),'utf-8');
    }
  },
  readFromFile: function(date){
    var taskList;
    try{
      taskList = JSON.parse(fs.readFileSync(tasklogic.createFileName(date),'utf-8'));
    }catch(e){
      taskList = [];
    }
    taskList.forEach(function(e){
      e.fromDate = e.fromDate != null ? new Date(e.fromDate) : null;
      e.toDate = e.toDate != null ? new Date(e.toDate) : null;
      e.focused = false;
    });
    return taskList;
  },
  createFileName: function(date){
     var fileName = 'taskList';
     fileName += date.getFullYear();
     fileName += ("0" + (date.getMonth() + 1)).slice(-2);
     fileName += ("0" + date.getDate()).slice(-2);
     fileName += ".json";
     return fileName;
  }
};
module.exports = tasklogic;
