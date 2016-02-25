"use strict";
var React = require("react");
var utils = require('./utils');
var tasklogic = require('./tasklogic');
var TypeList = React.createClass({
  getInitialState: function(){
    return {
      types: tasklogic.readTypeFromFile()
    };
  },
  handleChange: function(e){
    var obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  },
  save: function(){
    tasklogic.writeTypeToFile(this.state.types);
  },
  render: function(){
    return <div>
      <textarea name="types" value={this.state.types} onChange={this.handleChange} />
      <button onClick={this.save}>Save</button>
    </div>;
  },
});
module.exports = TypeList;
