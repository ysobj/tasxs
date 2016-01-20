"use strict";
var React = require("react");
var ReactDOM = require("react-dom");
var utils = {
  formatTime: function(date){
    if(date == null){
      return null;
    }
    var str = ("0" + date.getHours()).slice(-2);
    str += ":";
    var min = date.getMinutes();
    str += ("0" + min).slice(-2);
    return str;
  },
  getMidnight: function(date){
    var tmp = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return tmp;
  },
  getDateFromHourAndMinuteStr: function(str, midnight){
    if(str == null){
      return null;
    }
    var tmp = str.split(":");
    return utils.getDateFromHourAndMinute(tmp[0],tmp[1],midnight);
  },
  getDateFromHourAndMinute: function(hour, minute, midnight){
    if(midnight == null){
      midnight = utils.getMidnight(new Date());
    }
    var timeInMs = midnight.getTime();
    timeInMs += hour * 60 * 60 * 1000;
    timeInMs += minute * 60 * 1000;
    var tmp = new Date(timeInMs);
    if(tmp.toString() === "Invalid Date"){
      return null;
    }
    return tmp;
  }
};
var today = utils.getMidnight(new Date());
var Tasks = React.createClass({
  render: function() {
    return <section className="main">
      <div className="tab-group">
        <div className="tab-item tab-item-fixed">
          <span></span>
          &lt;&lt;
        </div>
        <div className="tab-item">
          <span></span>
          Yesterday
        </div>
        <div className="tab-item active">
          <span></span>
          Today
        </div>
        <div className="tab-item">
          <span></span>
          Tomorrow
        </div>
        <div className="tab-item tab-item-fixed">
          <span></span>
          &gt;&gt;
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
  handleOnUpdateTimeFrom: function(e){
    var tmpToDate = new Date();
    var taskList = this.state.taskList.map(function(data,i){
      if(i == (e-1)){
        tmpToDate = data.toDate;
      }else if(i == e){
        data.fromDate = tmpToDate;
      }
      return data;
    });
    this.setState({taskList: taskList});
  },
  handleCreate: function(e){
    var taskList = this.state.taskList;
    var taskId = 0;
    taskList.forEach(function(e){
      if(taskId < e.taskId){
        taskId = e.taskId;
      }
    });
    taskId++;
    taskList.push({
      taskId: taskId,
      type: 'テスト',
      focused: false
    });
    this.setState({taskList: taskList});
  },
  handleUpdate: function(e){
    var taskList = this.state.taskList.map(function(data,i){
      return (data.taskId == e.taskId) ? e : data;
    });
    this.setState({taskList: taskList});
  },
  calcElapsed: function(){
    var elapsed = 0;
    this.state.taskList.forEach(function(e){
      if(e.toDate == null && isFinite(e.estimate)){
        elapsed += e.estimate;
      }
    });
    return elapsed;
  },
  render: function() {
    var now = new Date();
    var nowStr = utils.formatTime(now);
    var finishStr = utils.formatTime( new Date( now.getTime() + (this.calcElapsed() * 1000 * 60)));
    var createTask = function(data,i){
      return (
          <Task onChangeFocus={this.handleOnChangeFocus.bind(this,i)}
                onUpdateTimeFrom={this.handleOnUpdateTimeFrom.bind(this,i)}
                onUpdate={this.handleUpdate}
            order={i}
            key={data.taskId}
            taskId={data.taskId}
            desc={data.desc}
            type={data.type}
            estimate={data.estimate}
            fromDate={data.fromDate}
            toDate={data.toDate}
            focused={data.focused}
          />
          );
    };
    return <div>
        <div>
          <span>now</span><span>{nowStr}</span>
          <span>finish</span><span>{finishStr}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th></th>
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
            <tr><td><button onClick={this.handleCreate}>create</button></td></tr>
          </tbody>
        </table>
      </div>;
  }
});
var Task = React.createClass({
  componentWillReceiveProps: function(nextProps){
    var fromDate = nextProps.fromDate;
    var fromDateStr = utils.formatTime(fromDate);
    this.setState({
      focused: nextProps.focused,
      fromDate: fromDate,
      fromDateStr: fromDateStr
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
    this.setState(param);
    this.props.onUpdate(param);
  },
  renderFocused : function(data,elapsed,actualClassName){
    return(
          <tr>
            <td><input type="checkbox" disabled/></td>
            <td><input ref="descInput" type="text" value={data.desc} onChange={this.handleChangeDesc}/></td>
            <td><select><option>作業</option></select></td>
            <td><input ref="estimateInput" type="text" value={data.estimate} onChange={this.handleChangeEstimate}/></td>
            <td><span className={actualClassName}>{elapsed}</span></td>
            <td><input ref="fromDateInput" type="text" value={data.fromDateStr} onChange={this.handleChangeFromDateStr} onKeyDown={this.handleOnKeyDownAtFromDate} onBlur={this.handleOnBlur}/></td>
            <td><input ref="toDateInput" type="text" value={data.toDateStr} onChange={this.handleChangeToDateStr} onKeyDown={this.handleOnKeyDownAtToDate} onBlur={this.handleOnBlur}/></td>
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
module.exports = Tasks;
