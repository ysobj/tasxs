"use strict";
var React = require("react");
var Modal = require('react-modal');
var utils = require('./utils');
var tasklogic = require('./tasklogic');
var TaskModal = React.createClass({
  getInitialState: function(){
    return {
//      types: tasklogic.readTypeFromFile()
      isOpen: this.props.isOpen
    };
  },
  closeModal: function() {
                console.log('closeModal',this.state);
    this.setState({modalIsOpen: false});
  },
  render: function(){

console.log(this.state);

    return <Modal
          isOpen={this.state.isOpen}
          onRequestClose={this.closeModal}
          style={this.props.style} >

          <h2>削除しますか?</h2>
          <button onClick={this.closeModal}>Cancel</button>
          <button onClick={this.props.deleteTask}>DELETE</button>
        </Modal> ;
  },
});
module.exports = TaskModal;
