"use strict";
var React = require("react");
var Tasks = React.createClass({
  render: function() {
    return <section className="main">
      <div>
        <span>now</span><span>10:40</span>
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
    //super();
    //this.x = [1,2,3];

    var x = [
    {
      taskId: 1,
      estimate: 15,
      fromDate: new Date(0),
      toDate: new Date(1000 * 60 * 15),
      desc: '勤怠入力',
      type: '作業'
    },
    {
      taskId: 2,
      estimate: 20,
      fromDate: new Date(0),
      toDate: new Date(1000 * 60 * 30),
      desc: 'ほげ機能の設計',
      type: '設計'
    },
    {
      taskId: 3,
      estimate: 45,
      fromDate: new Date(0),
      toDate: new Date(1000 * 60 * 45),
      desc: '単体テスト',
      type: 'テスト'
    }
    ];
    return {x : x};
  },
    handleOnChangeFocus: function(e){
    console.log('handleOnChangeFocus',e);
    console.log(this);
    debugger;
  },
    render: function() {
    var createTask = function(data){
      return (
          <Task onChangeFocus={this.handleOnChangeFocus}
            key={data.taskId}
            desc={data.desc}
            type={data.type}
            estimate={data.estimate}
            fromDate={data.fromDate}
            toDate={data.toDate}
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
          {this.state.x.map(createTask,this)}
        </tbody>
      </table>;
  },
  componentDidMount: function(){
    console.log('componentDidMount');
  },
});
var Task = React.createClass({
  getInitialState: function(props){
    var fromDate = this.props.fromDate;
    var toDate = this.props.toDate;
    return {
      desc: this.props.desc,
      fromDate: fromDate,
      toDate: toDate,
      type: this.props.type,
      estimate: this.props.estimate,
      elapsed: this.calcElapsed(fromDate,toDate),
      focused : false
    };
  },
  handleOnClick: function(){
    this.setState({focused : !this.state.focused});
    this.props.onChangeFocus(this);
  },
  handleChangeDesc: function(e){
    console.log('handleChangeDesc',e.target.value);
    this.setState({desc: e.target.value});
  },
  handleChangeFromDate: function(e){
    var fromDate = e.target.value;
    var toDate = this.state.toDate;
    var elapsed = this.calcElapsed(fromDate,toDate);
    this.setState({fromDate: fromDate});
    this.setState({elapsed: elapsed});
  },
  handleChangeToDate: function(e){
    var fromDate = this.state.fromDate;
    var toDate = e.target.value;
    var elapsed = this.calcElapsed(fromDate,toDate);
    this.setState({toDate: toDate});
    this.setState({elapsed: elapsed});
  },
  calcElapsed: function(fromDate,toDate){
    return ( toDate.getTime() - fromDate.getTime() ) / (1000 * 60);
  },
  renderFocused : function(data){
    return(
          <tr>
            <td><input type="text" defaultValue="勤怠" value={data.desc} onChange={this.handleChangeDesc}/></td>
            <td><select><option>作業</option></select></td>
            <td>{data.estimate}</td>
            <td>{data.elapsed}</td>
            <td><input type="text" defaultValue="10:30" value={data.fromDate.toString()} onChange={this.handleChangeFromDate}/></td>
            <td><input type="text" defaultValue="10:33" value={data.toDate.toString()} onChange={this.handleChangeToDate}/></td>
          </tr>
     );
  },
  renderUnfocused: function(data){
    return (
          <tr onClick={this.handleOnClick}>
            <td>{data.desc}</td>
            <td>{data.type}</td>
            <td>{data.estimate}</td>
            <td>{data.elapsed}</td>
            <td>{data.fromDate.toString()}</td>
            <td>{data.toDate.toString()}</td>
          </tr>
        );
  },
  render : function() {
    var data = this.state;
    if(this.state.focused){
      return this.renderFocused(data);
    }else{
      return this.renderUnfocused(data);
    }
  }
});
module.exports = Tasks;
