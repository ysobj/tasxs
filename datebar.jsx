"use strict";
var React = require("react");
var utils = require('./utils');
var today = utils.getMidnight(new Date());
var yesterday = utils.getMidnight(new Date(today.getTime()-1));
var tomorrow = utils.getMidnight(new Date(today.getTime()+86400000));
var DateBar = React.createClass({
  getInitialState: function(){
    var targetDate = this.props.targetDate;
    var mode = this.props.mode;
    var base = (mode === 'repeat') ? today : targetDate;
    return {
      targetDate: targetDate,
      before: this.calcBefore(targetDate,mode),
      after: this.calcAfter(targetDate,mode),
      mode: mode,
      base: base
    };
  },
  componentWillReceiveProps: function(nextProps){
    var targetDate = nextProps.targetDate;
    var mode = nextProps.mode;
    var base = (mode === 'repeat') ? today : targetDate;
    this.setState({
      targetDate: targetDate,
      before: this.calcBefore(targetDate,mode),
      after: this.calcAfter(targetDate,mode),
      mode: mode,
      base: base
    });
  },
  calcBefore: function(targetDate,mode){
    return (mode === 'repeat') ? 
      yesterday : this.addDay(targetDate, -1);
  },
  calcAfter: function(targetDate,mode){
    return (mode === 'repeat') ?
      tomorrow : this.addDay(targetDate);
  },
  addDay: function(date,amount){
    if(!amount){
      amount = 1;
    }
    return new Date(date.getTime() + 86400000 * amount);
  },
  next: function(){
    this.props.onChangeTargetDate(
      this.addDay(this.state.base)
    );
  },
  nextWeek: function(){
    this.props.onChangeTargetDate(
      this.addDay(this.state.base,7)
    );
  },
  prev: function(){
    this.props.onChangeTargetDate(
      this.addDay(this.state.base,-1)
    );
  },
  prevWeek: function(){
    this.props.onChangeTargetDate(
      this.addDay(this.state.base,-7)
    );
  },
  formatLabel: function(date,mode){
     if(mode === 'repeat'){
       return "Repeat";
     }
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
    var mode = this.props.mode;
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
          {this.formatLabel(this.state.before)}
        </div>
        <div className="tab-item active">
          <span></span>
          {this.formatLabel(this.state.targetDate,mode)}
        </div>
        <div className="tab-item" onClick={this.next}>
          <span></span>
          {this.formatLabel(this.state.after)}
        </div>
        <div className="tab-item tab-item-fixed" onClick={this.nextWeek}>
          <span></span>
          &gt;&gt;
        </div>
      </div>;

  }
});
module.exports = DateBar;
