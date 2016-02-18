"use strict";
var React = require("react");
var TaskStats = React.createClass({
  render: function(){
    var createTypeRow = function(data){
      return <tr><td>{data.label}</td></tr>;
    };
    return <table>
      {this.props.taskTypeList.map(createTypeRow)}
    </table>;
  }
});
module.exports = TaskStats;
