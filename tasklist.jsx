"use strict";
var React = require("react");
var Modal = require('react-modal');
var fs = require("fs");
var utils = require('./utils');
var Task = require('./task');
var today = utils.getMidnight(new Date());
const customStyles = {
  content : {
    top        : '50%',
    left       : '50%',
    right      : 'auto',
    bottom     : 'auto',
    marginRight: '-50%',
    transform  : 'translate(-50%, -50%)'
  }
};
var TaskList = React.createClass({
  getInitialState: function(){
    return {
      taskList : this.getTaskListFromFile(this.props.targetDate),
      isOpen: false
    };
  },
  componentWillReceiveProps: function(nextProps){
    if(this.props.targetDate){
      this.writeToFile();
    }
    this.setState({
      taskList : this.getTaskListFromFile(nextProps.targetDate)
    });
  },
  writeToFile: function(){
    var fileName = this.createFileName(this.props.targetDate);
    if(this.state.taskList.length === 0){
      fs.access(fileName, fs.F_OK, function(err){
        if(!err){
          fs.unlink(fileName,function(){});
        }
      });
    }else{
      fs.writeFileSync(fileName,JSON.stringify(this.state.taskList),'utf-8');
    }
  },
  getTaskListFromFile: function(date){
    var taskList;
    try{
      taskList = JSON.parse(fs.readFileSync(this.createFileName(date),'utf-8'));
    }catch(e){
      taskList = [];
    }
    taskList.forEach(function(e){
      e.fromDate = e.fromDate != null ? new Date(e.fromDate) : null;
      e.toDate = e.toDate != null ? new Date(e.toDate) : null;
      e.focused = false;
    });
    return taskList;
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
    this.writeToFile();
    this.setState({taskList: taskList});
  },
  createFileName: function(date){
     var fileName = 'taskList';
     fileName += date.getFullYear();
     fileName += ("0" + (date.getMonth() + 1)).slice(-2);
     fileName += ("0" + date.getDate()).slice(-2);
     fileName += ".json";
     return fileName;
  },
  calcElapsed: function(){
    var elapsed = 0;
    this.state.taskList.forEach(function(e){
      if(e.toDate == null && isFinite(e.estimate)){
        elapsed += parseInt(e.estimate,10);
      }
    });
    return elapsed;
  },
  openModal: function(e){
    this.setState({
      modalIsOpen: true,
      targetTaskId: e
    });
  },
  closeModal: function() {
    this.setState({modalIsOpen: false});
  },
  deleteTask: function() {
    var taskList = this.state.taskList.filter(function(task){
      return task.taskId != this.state.targetTaskId;
    },this);
    this.setState({
      modalIsOpen: false,
      taskList: taskList
    });
  },
  render: function() {
    var startingPoint,label;
    if(this.props.targetDate.getTime() === today.getTime()){
      startingPoint = new Date();
      label = 'now';
    }else{
      startingPoint = new Date(this.props.targetDate.getTime() + 630 * 60 * 1000);
      label = 'base';
    }
    var nowStr = utils.formatTime(startingPoint);
    var finishStr = utils.formatTime( new Date( startingPoint.getTime() + (this.calcElapsed() * 1000 * 60)));
    var createTask = function(data,i){
      return (
          <Task onChangeFocus={this.handleOnChangeFocus.bind(this,i)}
                onUpdateTimeFrom={this.handleOnUpdateTimeFrom.bind(this,i)}
                onUpdate={this.handleUpdate}
                onContextMenu={this.openModal}
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
          <span>{label}</span><span>{utils.formatTime(startingPoint)}</span>
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
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles} >

          <h2>削除しますか?</h2>
          <button onClick={this.closeModal}>Cancel</button>
          <button onClick={this.deleteTask}>DELETE</button>
        </Modal>
      </div>;
  }
});
module.exports = TaskList;
