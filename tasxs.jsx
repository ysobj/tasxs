"use strict";
var React = require("react");
var utils = require('./utils');
var DateBar = require('./datebar');
var TaskList = require('./tasklist');
var today = utils.getMidnight(new Date());
var Tasks = React.createClass({
  getInitialState: function(e){
    return {
      targetDate: today,
      mode: 'daily'
    };
  },
  handleChangeTargetDate: function(e){
    this.setState({
      targetDate: e,
      mode: 'daily'
    })
  },
  handleChangeToRepeatMode: function(){
    this.setState({mode: 'repeat'});
  },
  render: function(){
    return <section className="main">
            <DateBar
              targetDate={this.state.targetDate}
              onChangeTargetDate={this.handleChangeTargetDate}
              onChangeToRepeatMode={this.handleChangeToRepeatMode}
            />
            <TaskList targetDate={this.state.targetDate} mode={this.state.mode}/>
      </section>;
  }
});
module.exports = Tasks;
