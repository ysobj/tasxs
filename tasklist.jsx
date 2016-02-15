"use strict";
var React = require("react");
var Modal = require('react-modal');
var utils = require('./utils');
var Task = require('./task');
var tasklogic = require('./tasklogic');
var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd-html5-backend');
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
    var initialState = {
      taskList : tasklogic.readFromFile(this.props.targetDate,this.props.mode),
      taskTypeList : JSON.parse(tasklogic.readTypeFromFile()),
      modalIsOpen: false
    };
    return initialState;
  },
  componentWillReceiveProps: function(nextProps){
    if(this.props.targetDate){
      tasklogic.writeToFile(this.props.targetDate, this.state.taskList, this.props.mode);
    }
    this.setState({
      taskList : tasklogic.readFromFile(nextProps.targetDate, nextProps.mode)
    });
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
    var taskId = parseInt(utils.getDateString(this.props.targetDate),10) * 1000;
    taskList.forEach(function(e){
      if(taskId < e.taskId){
        taskId = e.taskId;
      }
    });
    taskId++;
    taskList.push({
      taskId: taskId,
      type: 'テスト',
      focused: false,
      mode: this.props.mode
    });
    this.setState({taskList: taskList});
  },
  handleUpdate: function(e){
    var taskList = this.state.taskList.map(function(data,i){
      return (data.taskId == e.taskId) ? e : data;
    });
    tasklogic.writeToFile(this.props.targetDate, this.state.taskList, this.props.mode);
    this.setState({taskList: taskList});
  },
  handleChangeOrder: function(base, obj){
    var taskList = this.state.taskList;
    var index = taskList.findIndex(function(cmp){
      return cmp.taskId == obj.taskId;
    });
    var tmp = taskList.splice(index,1);
    index = taskList.findIndex(function(cmp){
      return cmp.taskId == base.taskId;
    });
    taskList.splice(index,0,tmp[0]);
    taskList.forEach(function(currentValue,index){
      currentValue['order'] = index;
    });
    tasklogic.writeToFile(this.props.targetDate, taskList, this.props.mode);
    this.setState({taskList: taskList});
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
  render: function(){
    if(this.props.mode === 'repeat'){
      return this.renderRepeatTask();
    }
    return this.renderDailyTask();
  },
  renderRepeatTask: function(){
    return this.renderDailyTask();
  },
  renderDailyTask: function() {
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
                onChangeOrder={this.handleChangeOrder}
            order={i}
            key={data.taskId}
            taskId={data.taskId}
            desc={data.desc}
            type={data.type}
            estimate={data.estimate}
            fromDate={data.fromDate}
            toDate={data.toDate}
            focused={data.focused}
            taskTypeList={this.state.taskTypeList}
          />
          );
    };
    var createTaskHeader = function(mode){
      return (<tr>
              <th>task</th>
              <th>type</th>
              <th>estimate</th>
              <th>actual</th>
              <th>from</th>
              <th>to</th>
            </tr>);
    };
    var createInformationHeader = function(mode){
      return (
        <div>
          <span>{label}</span><span>{utils.formatTime(startingPoint)}</span>
          <span>finish</span><span>{finishStr}</span>
        </div>
      );
    };
    return <div>
        {createInformationHeader()}
        <table>
          <thead>
            {createTaskHeader()}
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
module.exports = DragDropContext(HTML5Backend)(TaskList);
