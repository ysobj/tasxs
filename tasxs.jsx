"use strict";
var React = require("react");
var Tasks = React.createClass({
  formatTime: function(date){
    var str = ("0" + date.getHours()).slice(-2);
    str += ":";
    str += ("0" + date.getHours()).slice(-2);
    return str;
  },
  render: function() {
    var currentTime = this.formatTime(new Date());
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
      fromDate: new Date(0),
      toDate: new Date(1000 * 60 * 15),
      desc: '勤怠入力',
      type: '作業',
      focused: false
    },
    {
      taskId: 2,
      estimate: 20,
      fromDate: new Date(0),
      toDate: new Date(1000 * 60 * 30),
      desc: 'ほげ機能の設計',
      type: '設計',
      focused: false
    },
    {
      taskId: 3,
      estimate: 45,
      fromDate: new Date(0),
      toDate: new Date(1000 * 60 * 45),
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
    var fromDate = e.target.value;
    var toDate = this.state.toDate;
    var elapsed = this.calcElapsed(fromDate,toDate);
    this.setState({
      fromDate: fromDate,
      elapsed: elapsed
    });
  },
  handleChangeToDate: function(e){
    var fromDate = this.state.fromDate;
    var toDate = e.target.value;
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
  renderFocused : function(data,elapsed){
    return(
          <tr>
            <td><input type="text" defaultValue="勤怠" value={data.desc} onChange={this.handleChangeDesc}/></td>
            <td><select><option>作業</option></select></td>
            <td><input type="text" defaultValue="0" value={data.estimate} onChange={this.handleChangeEstimate}/></td>
            <td>{elapsed}</td>
            <td><input type="text" defaultValue="10:30" value={data.fromDate.toString()} onChange={this.handleChangeFromDate}/></td>
            <td><input type="text" defaultValue="10:33" value={data.toDate.toString()} onChange={this.handleChangeToDate}/></td>
          </tr>
     );
  },
  renderUnfocused: function(data,elapsed){
    return (
          <tr onClick={this.handleOnClick}>
            <td>{data.desc}</td>
            <td>{data.type}</td>
            <td>{data.estimate}</td>
            <td>{elapsed}</td>
            <td>{data.fromDate.toString()}</td>
            <td>{data.toDate.toString()}</td>
          </tr>
        );
  },
  render : function() {
    var data = this.state;
    var elapsed = this.calcElapsed(data.fromDate,data.toDate);
    if(data.focused){
      return this.renderFocused(data,elapsed);
    }else{
      return this.renderUnfocused(data,elapsed);
    }
  }
});
module.exports = Tasks;
