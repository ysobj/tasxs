"use strict";
var fs = require("fs");
var utils = require('./utils');
var tasklogic = {
  getPrefix: function(mode){
    return mode === 'repeat' ? 'repeatTask' : 'dailyTask';
  },
  writeTypeToFile: function(obj){
    fs.writeFileSync('tasksTypelist.json',obj,'utf-8');
  },
  readTypeFromFile: function(){
    try{
      var obj = fs.readFileSync('tasksTypelist.json','utf-8');
      console.log('r1',obj);
      return obj;
    }catch(e){
      console.log('r2',obj);
      return "";
    }
  },
  writeToFile: function(targetDate, taskList, mode){
    var prefix = tasklogic.getPrefix(mode);
    var fileName = tasklogic.createFileName(prefix, targetDate);
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
  readFromFile: function(date,mode){
    var prefix = tasklogic.getPrefix(mode);
    var taskList;
    try{
      taskList = JSON.parse(fs.readFileSync(tasklogic.createFileName(prefix, date),'utf-8'));
    }catch(e){
      if(mode !== 'repeat'){
        prefix = tasklogic.getPrefix('repeat');
        try{
          taskList = JSON.parse(fs.readFileSync(tasklogic.createFileName(prefix, date),'utf-8'));
        }catch(e){
          taskList = [];
        }
      }else{
        taskList = [];
      }
    }
    taskList.forEach(function(e){
      e.fromDate = e.fromDate != null ? new Date(e.fromDate) : null;
      e.toDate = e.toDate != null ? new Date(e.toDate) : null;
      e.focused = false;
    });
    return taskList;
  },
  createFileName: function(prefix, date){
     if(prefix === 'repeatTask'){
       return 'repeatTask.json';
     }
     var fileName = 'dailyTask';
     fileName += utils.getDateString(date);
     fileName += ".json";
     return fileName;
  }
};
module.exports = tasklogic;
