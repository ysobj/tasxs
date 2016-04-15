"use strict";
var React = require("react");
var Modal = require('react-modal');
var utils = require('./utils');
var tasklogic = require('./tasklogic');
var TaskModal = React.createClass({
  render: function(){
    return <Modal
          isOpen={this.props.isOpen}
          onRequestClose={this.closeModal}
          style={this.props.style} >

          <button onClick={this.props.deleteTask}>DELETE</button>
          <button onClick={this.props.moveTaskToNextDay}>move task to next day</button>
          <button onClick={this.props.closeModal}>Cancel</button>
        </Modal> ;
  },
});
module.exports = TaskModal;
