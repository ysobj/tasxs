"use strict";
var React = require("react");
var utils = require('./utils');
var DateBar = require('./datebar');
var TaskList = require('./tasklist');
var TypeList = require('./typelist');
var TaskStats = require('./taskstats');
var tasklogic = require('./tasklogic');
var today = utils.getMidnight(new Date());
var Tasks = React.createClass({
  getInitialState: function(e){
    return {
      targetDate: today,
      mode: 'daily',
      taskTypeList: JSON.parse(tasklogic.readTypeFromFile()),
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
  handleChangeToTypeMode: function(){
    this.setState({
      mode: 'type',
      targetDate: new Date(0)
    });
  },
  render: function(){
    var mainArea;
    if(this.state.mode === 'type'){
      mainArea = <TypeList className="mainArea" />;
    }else{
      mainArea = (<div className="mainArea">
        <TaskList targetDate={this.state.targetDate} mode={this.state.mode} taskTypeList={this.state.taskTypeList} />
        <TaskStats targetDate={this.state.targetDate} taskTypeList={this.state.taskTypeList} mode={this.state.mode} />
      </div>);
    }
    return <section className="main">
      <DateBar
        targetDate={this.state.targetDate}
        mode={this.state.mode}
        onChangeTargetDate={this.handleChangeTargetDate}
        onChangeToRepeatMode={this.handleChangeToRepeatMode}
        onChangeToTypeMode={this.handleChangeToTypeMode}
      />
      {mainArea}
    </section>;
  }
});
module.exports = Tasks;
