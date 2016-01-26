"use strict";
var React = require("react");
var utils = require('./utils');
var today = utils.getMidnight(new Date());
var yesterday = utils.getMidnight(new Date(today.getTime()-1));
var tomorrow = utils.getMidnight(new Date(today.getTime()+86400000));
var DateBar = React.createClass({
  addDay: function(date,amount){
    if(!amount){
      amount = 1;
    }
    return new Date(date.getTime() + 86400000 * amount);
  },
  next: function(){
    this.props.onChangeTargetDate(
      this.addDay(this.props.targetDate)
    );
  },
  nextWeek: function(){
    this.props.onChangeTargetDate(
      this.addDay(this.props.targetDate,7)
    );
  },
  prev: function(){
    this.props.onChangeTargetDate(
      this.addDay(this.props.targetDate,-1)
    );
  },
  prevWeek: function(){
    this.props.onChangeTargetDate(
      this.addDay(this.props.targetDate,-7)
    );
  },
  formatDate: function(date){
     if(date.getTime() === today.getTime()){
       return "Today";
     }
     if(date.getTime() === yesterday.getTime()){
       return "Yesterday";
     }
     if(date.getTime() === tomorrow.getTime()){
       return "Tomorrow";
     }
     var str = ("0"+(date.getMonth() + 1)).slice(-2);
     str += "/";
     str += ("0"+date.getDate()).slice(-2);
     return str;
  },
  render: function(){
    var before = this.addDay(this.props.targetDate, -1);
    var after = this.addDay(this.props.targetDate);
    return <div className="tab-group">
        <div className="tab-item tab-item-fixed" onClick={this.props.onChangeToRepeatMode}>
          <span></span>
          $$
        </div>
        <div className="tab-item tab-item-fixed" onClick={this.prevWeek}>
          <span></span>
          &lt;&lt;
        </div>
        <div className="tab-item" onClick={this.prev}>
          <span></span>
          {this.formatDate(before)}
        </div>
        <div className="tab-item active">
          <span></span>
          {this.formatDate(this.props.targetDate)}
        </div>
        <div className="tab-item" onClick={this.next}>
          <span></span>
          {this.formatDate(after)}
        </div>
        <div className="tab-item tab-item-fixed" onClick={this.nextWeek}>
          <span></span>
          &gt;&gt;
        </div>
      </div>;

  }
});
module.exports = DateBar;
