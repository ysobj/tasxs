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
  save: function(){
  },
  render: function(){
    return <div>
      <textarea />
      <button onClick={this.save}>Save</button>
    </div>;
  },
});
module.exports = TypeList;
