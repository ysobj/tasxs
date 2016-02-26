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

          <h2>削除しますか</h2>
          <button onClick={this.props.closeModal}>Cancel</button>
          <button onClick={this.props.deleteTask}>DELETE</button>
        </Modal> ;
  },
});
module.exports = TaskModal;
