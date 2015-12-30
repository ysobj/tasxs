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
      estimate: 15,
      fromDate: new Date(0),
      toDate: new Date(14400),
      desc: '勤怠入力',
      type: '作業'
    },
    {
      estimate: 20,
      fromDate: new Date(0),
      toDate: new Date(14400),
      desc: 'ほげ機能の設計',
      type: '設計'
    },
    {
      estimate: 45,
      fromDate: new Date(0),
      toDate: new Date(14400),
      desc: '単体テスト',
      type: 'テスト'
    }
      ];
//    this.props = {
//      tasks : [1,2,3]
//    }
    return {x : x};
  },
    handleOnChangeFocus: function(e){
    console.log('handleOnChangeFocus',e);
  },
    render: function() {
    console.log(this);
    var createTask = function(data){
      return (
          <Task onChangeFocus={this.handleOnChangeFocus} data={data}/>
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
    return {
      focused : false
    };
  },
  handleOnClick: function(){
    this.setState({focused : !this.state.focused});
    this.props.onChangeFocus(this);
  },
  handleChangeDesc: function(e){
    console.log('handleChangeDesc',e.target.value);
    this.setState({data:{desc: e.target.value}});
  },
  handleChangeFromDate: function(e){
    this.setState({fromDate: e.target.value});
  },
  handleChangeToDate: function(e){
    this.setState({toDate: e.target.value});
  },
  renderFocused : function(data){
    return(
          <tr>
            <td><input type="text" defaultValue="勤怠" value={data.desc} onChange={this.handleChangeDesc}/></td>
            <td><select><option>作業</option></select></td>
            <td>{data.estimate}</td>
            <td>{data.actual}</td>
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
            <td>{data.actual}</td>
            <td>{data.fromDate.toString()}</td>
            <td>{data.toDate.toString()}</td>
          </tr>
        );
  },
  render : function() {
    var data = this.props.data;
    data.actual =  ( data.toDate.getTime() - data.fromDate.getTime() ) / (1000 * 60);
    if(this.state.focused){
      return this.renderFocused(data);
    }else{
      return this.renderUnfocused(data);
    }
  }
});
//exports.Tasxs = Tasxs;
module.exports = Tasks;
