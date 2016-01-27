"use strict";
var React = require("react");
var ReactDOM = require("react-dom");
var utils = require('./utils');
var Task = React.createClass({
  componentWillReceiveProps: function(nextProps){
    var fromDate = nextProps.fromDate;
    var fromDateStr = utils.formatTime(fromDate);
    var toDate = nextProps.toDate;
    var toDateStr = utils.formatTime(toDate);
    this.setState({
      taskId: nextProps.taskId,
      desc: nextProps.desc,
      fromDate: fromDate,
      fromDateStr: fromDateStr,
      toDate: toDate,
      toDateStr: toDateStr,
      type: nextProps.type,
      estimate: nextProps.estimate,
      elapsed: this.calcElapsed(fromDate,toDate),
      focused: nextProps.focused
    });
  },
  getInitialState: function(){
    var fromDate = this.props.fromDate;
    var toDate = this.props.toDate;
    var fromDateStr = utils.formatTime(fromDate);
    var toDateStr = utils.formatTime(toDate);
    return {
      taskId: this.props.taskId,
      desc: this.props.desc,
      fromDate: this.props.fromDate,
      fromDateStr: fromDateStr,
      toDate: this.props.toDate,
      toDateStr: toDateStr,
      type: this.props.type,
      estimate: this.props.estimate,
      elapsed: this.calcElapsed(fromDate,toDate),
      focused : this.props.focused
    };
  },
  handleOnClick: function(){
    this.props.onChangeFocus(this);
  },
  handleChangeDesc: function(e){
    this.setState({desc: e.target.value});
  },
  handleChangeFromDateStr: function(e){
    this.setState({fromDateStr: e.target.value});
  },
  handleChangeToDateStr: function(e){
    this.setState({toDateStr: e.target.value});
  },
  handleChangeEstimate: function(e){
    this.setState({estimate: e.target.value})
  },
  calcElapsed: function(fromDate,toDate){
    if(fromDate == null || toDate == null){
      return null;
    }
    return ( toDate.getTime() - fromDate.getTime() ) / (1000 * 60);
  },
  handleOnKeyDownAtFromDate: function(e){
    if(e.keyCode == 84 && e.ctrlKey){
      this.props.onUpdateTimeFrom(this);
      e.preventDefault();
    }
  },
  handleOnKeyDownAtToDate: function(e){
    if(e.keyCode == 84 && e.ctrlKey){
      var now = utils.formatTime(new Date());
      this.setState({toDateStr: now});
      e.preventDefault();
    }
  },
  handleOnBlur: function(e){
    var fromDate = utils.getDateFromHourAndMinuteStr(this.state.fromDateStr);
    var toDate = utils.getDateFromHourAndMinuteStr(this.state.toDateStr);
    var elapsed = this.calcElapsed(fromDate,toDate);
    var param = {
      taskId: this.state.taskId,
      fromDate: fromDate,
      toDate: toDate,
      elapsed: elapsed,
      desc: this.state.desc,
      type: this.state.type,
      estimate: this.state.estimate
    };
//    this.setState(param);
    this.props.onUpdate(param);
  },
  handleOnContextMenu: function(){
    this.props.onContextMenu(this.state.taskId);
  },
  renderFocused : function(data,elapsed,actualClassName){
    return(
          <tr onContextMenu={this.handleOnContextMenu}>
            <td><input type="checkbox" disabled/></td>
            <td><input className="descInput" ref="descInput" type="text" value={data.desc} onChange={this.handleChangeDesc} onBlur={this.handleOnBlur}/></td>
            <td><select><option>作業</option></select></td>
            <td><input className="timeInput" ref="estimateInput" type="text" value={data.estimate} onChange={this.handleChangeEstimate}/></td>
            <td><span className={actualClassName}>{elapsed}</span></td>
            <td><input className="timeInput" ref="fromDateInput" type="text" value={data.fromDateStr} onChange={this.handleChangeFromDateStr} onKeyDown={this.handleOnKeyDownAtFromDate} onBlur={this.handleOnBlur}/></td>
            <td><input className="timeInput" ref="toDateInput" type="text" value={data.toDateStr} onChange={this.handleChangeToDateStr} onKeyDown={this.handleOnKeyDownAtToDate} onBlur={this.handleOnBlur}/></td>
          </tr>
     );
  },
  renderUnfocused: function(data,elapsed,actualClassName){
    return (
          <tr onClick={this.handleOnClick}>
            <td><input type="checkbox" disabled/></td>
            <td>{data.desc}</td>
            <td>{data.type}</td>
            <td>{data.estimate}</td>
            <td><span className={actualClassName}>{elapsed}</span></td>
            <td>{utils.formatTime(data.fromDate)}</td>
            <td>{utils.formatTime(data.toDate)}</td>
          </tr>
        );
  },
  componentDidUpdate: function(e){
    if(this.props.focused){
      if(this.state.desc == ''){
        ReactDOM.findDOMNode(this.refs.descInput).focus(); 
        return;
      }
      if(this.state.estimate == ''){
        ReactDOM.findDOMNode(this.refs.estimateInput).focus(); 
        return ;
      }
      if(this.state.fromDateStr == ''){
        ReactDOM.findDOMNode(this.refs.fromDateInput).focus(); 
      }
      if(this.state.toDateStr == ''){
        ReactDOM.findDOMNode(this.refs.toDateInput).focus(); 
      }
    }
  },
  render : function() {
    var data = this.state;
    var elapsed = this.calcElapsed(data.fromDate,data.toDate);
    var actualClassName = '' ;
    if(data.estimate < elapsed){
      actualClassName = 'overtime';
    }
    if(data.focused){
      return this.renderFocused(data,elapsed,actualClassName);
    }else{
      return this.renderUnfocused(data,elapsed,actualClassName);
    }
  }
});
module.exports = Task;