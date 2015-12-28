"use strict";
const React = require("react");
class Tasxs extends React.Component {
  render() {
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
}
class TaskList extends React.Component{
  constructor(){
    super();
    //this.x = [1,2,3];

    this.x = [
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
  }
  handleOnChangeFocus(e){
    console.log('handleOnChangeFocus',e);
  }
  render() {
    console.log(this);
    var createTask = function(data){
      return (
          <Task onChangeFocus={this.handleOnChangeFocus.bind(this)} data={data}/>
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
          {this.x.map(createTask,this)}
        </tbody>
      </table>;
  }
  componentDidMount(){
    console.log('componentDidMount');
  }
}
class Task extends React.Component{
  constructor(props){
    console.log(props);
    super(props);
    this.state = {
      focused : props.focused
    };
  }
  handleClick(){
    this.setState({focused : !this.state.focused});
    this.props.onChangeFocus(this);
  }
  renderFocused(data){
    return(
          <tr>
            <td><input type="text" defaultValue="勤怠" value={data.desc} /></td>
            <td><select><option>作業</option></select></td>
            <td>{data.estimate}</td>
            <td>{data.actual}</td>
            <td><input type="text" defaultValue="10:30" value={data.fromDate.toString()}/></td>
            <td><input type="text" defaultValue="10:33" value={data.toDate.toString()}/></td>
          </tr>
     );
  }
  renderUnfocused(data){
    return (
          <tr onClick={this.handleClick.bind(this)}>
            <td>{data.desc}</td>
            <td>{data.type}</td>
            <td>{data.estimate}</td>
            <td>{data.actual}</td>
            <td>{data.fromDate.toString()}</td>
            <td>{data.toDate.toString()}</td>
          </tr>
        );
  }
  render() {
    var data = this.props.data;
    data.actual =  ( data.toDate.getTime() - data.fromDate.getTime() ) / (1000 * 60);
    if(this.state.focused){
      return this.renderFocused(data);
    }else{
      return this.renderUnfocused(data);
    }
  }
}
exports.Tasxs = Tasxs;
