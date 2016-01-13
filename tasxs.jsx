"use strict";
var React = require("react");
var utils = {
  formatTime: function(date){
    var str = ("0" + date.getHours()).slice(-2);
    str += ":";
    str += ("0" + date.getMinutes()).slice(-2);
    return str;
  },
  getMidnight: function(date){
    var tmp = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return tmp;
  },
  getDateFromHourAndMinute: function(hour, minute, midnight){
    if(midnight == null){
      midnight = utils.getMidnight(new Date());
    }
    var timeInMs = midnight.getTime();
    timeInMs += hour * 60 * 60 * 1000;
    timeInMs += minute * 60 * 1000;
    return new Date(timeInMs);
  }
};
var today = utils.getMidnight(new Date());
var Tasks = React.createClass({
  render: function() {
    var currentTime = utils.formatTime(new Date());
    return <section className="main">
      <div>
        <span>now</span><span>{currentTime}</span>
        <span>finish</span><span>10:40</span>
      </div>
      <div className="tab-group">
        <div className="tab-item active">
          <span className="icon icon-cancel icon-close-tab"></span>
          Today
        </div>
        <div className="tab-item">
          <span className="icon icon-cancel icon-close-tab"></span>
          Tommorrow
        </div>
        <div className="tab-item">
          <span className="icon icon-cancel icon-close-tab"></span>
          Tab
        </div>
        <div className="tab-item tab-item-fixed">
          <span className="icon icon-plus"></span>
        </div>
      </div>
      <TaskList />
      </section>;
  }
});
var TaskList = React.createClass({
  getInitialState: function(){
    var taskList = [
    {
      taskId: 1,
      estimate: 15,
      fromDate: utils.getDateFromHourAndMinute(9,0),
      toDate: utils.getDateFromHourAndMinute(9,15),
      desc: '勤怠入力',
      type: '作業',
      focused: false
    },
    {
      taskId: 2,
      estimate: 20,
      fromDate: utils.getDateFromHourAndMinute(9,15),
      toDate: utils.getDateFromHourAndMinute(9,33),
      desc: 'ほげ機能の設計',
      type: '設計',
      focused: false
    },
    {
      taskId: 3,
      estimate: 45,
      fromDate: utils.getDateFromHourAndMinute(9,33),
      toDate: utils.getDateFromHourAndMinute(9,45),
      desc: '単体テスト',
      type: 'テスト',
      focused: false
    }
    ];
    return {taskList : taskList};
  },
  handleOnChangeFocus: function(e){
    var taskList = this.state.taskList.map(function(data,i){
      data.focused = (e == i);
      return data;
    });
    this.setState({taskList: taskList});
  },
    render: function() {

    var createTask = function(data,i){
      return (
          <Task onChangeFocus={this.handleOnChangeFocus.bind(this,i)}
            key={data.taskId}
            desc={data.desc}
            type={data.type}
            estimate={data.estimate}
            fromDate={data.fromDate}
            toDate={data.toDate}
            focused={data.focused}
          />
          );
    };
    return <table>
        <thead>
          <tr>
            <th>task</th>
            <th>type</th>
            <th>estimate</th>
            <th>actual</th>
            <th>from</th>
            <th>to</th>
          </tr>
        </thead>
        <tbody>
          {this.state.taskList.map(createTask,this)}
        </tbody>
      </table>;
  }
});
var Task = React.createClass({
  componentWillReceiveProps: function(nextProps){
    this.setState({focused: nextProps.focused});
  },
  getInitialState: function(){
    var fromDate = this.props.fromDate;
    var toDate = this.props.toDate;
    return {
      desc: this.props.desc,
      fromDate: fromDate,
      toDate: toDate,
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
  handleChangeFromDate: function(e){
    var tmp = e.target.value.split(":");
    var fromDate = utils.getDateFromHourAndMinute(tmp[0],tmp[1]);
    var toDate = this.state.toDate;
    var elapsed = this.calcElapsed(fromDate,toDate);
    this.setState({
      fromDate: fromDate,
      elapsed: elapsed
    });
  },
  handleChangeToDate: function(e){
    var fromDate = this.state.fromDate;
    var tmp = e.target.value.split(":");
    var toDate = utils.getDateFromHourAndMinute(tmp[0],tmp[1]);
    var elapsed = this.calcElapsed(fromDate,toDate);
    this.setState({
      toDate: toDate,
      elapsed: elapsed
    });
  },
  handleChangeEstimate: function(e){
    this.setState({estimate: e.target.value})
  },
  calcElapsed: function(fromDate,toDate){
    return ( toDate.getTime() - fromDate.getTime() ) / (1000 * 60);
  },
  renderFocused : function(data,elapsed,actualClassName){
    return(
          <tr>
            <td><input type="text" defaultValue="勤怠" value={data.desc} onChange={this.handleChangeDesc}/></td>
            <td><select><option>作業</option></select></td>
            <td><input type="text" defaultValue="0" value={data.estimate} onChange={this.handleChangeEstimate}/></td>
            <td><span className={actualClassName}>{elapsed}</span></td>
            <td><input type="text" defaultValue="10:30" value={utils.formatTime(data.fromDate)} onChange={this.handleChangeFromDate}/></td>
            <td><input type="text" defaultValue="10:33" value={utils.formatTime(data.toDate)} onChange={this.handleChangeToDate}/></td>
          </tr>
     );
  },
  renderUnfocused: function(data,elapsed,actualClassName){
    return (
          <tr onClick={this.handleOnClick}>
            <td>{data.desc}</td>
            <td>{data.type}</td>
            <td>{data.estimate}</td>
            <td><span className={actualClassName}>{elapsed}</span></td>
            <td>{utils.formatTime(data.fromDate)}</td>
            <td>{utils.formatTime(data.toDate)}</td>
          </tr>
        );
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
module.exports = Tasks;
