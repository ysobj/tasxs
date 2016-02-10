"use strict";
var React = require("react");
var Modal = require('react-modal');
var utils = require('./utils');
var tasklogic = require('./tasklogic');
var TypeList = React.createClass({
  getInitialState: function(){
    return {
    };
  },
  /*
  componentWillReceiveProps: function(nextProps){
    if(this.props.targetDate){
      tasklogic.writeToFile(this.props.targetDate, this.state.taskList, this.props.mode);
    }
    this.setState({
      taskList : tasklogic.readFromFile(nextProps.targetDate, nextProps.mode)
    });
  },
  */
  render: function(){
    return <div>type list</div>;
  },
});
module.exports = TypeList;
