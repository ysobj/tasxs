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
    this.setState({
      mode: 'repeat',
      targetDate: new Date(0)
    });
  },
  render: function(){
    return <section className="main">
            <DateBar
              targetDate={this.state.targetDate}
              mode={this.state.mode}
              onChangeTargetDate={this.handleChangeTargetDate}
              onChangeToRepeatMode={this.handleChangeToRepeatMode}
            />
            <TaskList targetDate={this.state.targetDate} mode={this.state.mode}/>
      </section>;
  }
});
module.exports = Tasks;
