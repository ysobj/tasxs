"use strict";
var React = require("react");
var tasklogic = require('./tasklogic');
var TaskStats = React.createClass({
  render: function(){
    if(this.props.mode !== 'daily'){
      return null;
    }
    var taskList = tasklogic.readFromFile(this.props.targetDate,this.props.mode);
    var stat = {};
    taskList.map(function(data){
      if(stat[data.type] == null){
        stat[data.type] = 0;
      }
      var fromDate = data.fromDate;
      var toDate = data.toDate;
      var elapsed = 0;
      if(fromDate != null && toDate != null){
        elapsed = (toDate.getTime() - fromDate.getTime()) / (1000 * 60);
      }
      stat[data.type] += elapsed;
    });
    console.log(stat);
    var createTypeRow = function(data){
      return <tr><td>{data.label}</td><td>{stat[data.label]}</td></tr>;
    };
    return <table>
      {this.props.taskTypeList.map(createTypeRow)}
    </table>;
  }
});
module.exports = TaskStats;
