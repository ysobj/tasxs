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
    this.x = [1,2,3];
    this.props = {
      tasks : [1,2,3]
    }
  }
  handleOnChangeFocus(){
    console.log('handleOnChangeFocus');
  }
  render() {
    console.log(this);
    var createTask = function(){
      return (
          <Task onChangeFocus={this.handleOnChangeFocus.bind(this)}/>
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
  constructor(prop){
    super(prop);
    this.state = {
      focused : false
    };
  }
  handleClick(){
    this.setState({focused : !this.state.focused});
    this.props.onChangeFocus(this);
  }
  renderFocused(){
    return(
          <tr onClick={this.handleClick.bind(this)}>
            <td><input type="text" defaultValue="勤怠" /></td>
            <td><select><option>作業</option></select></td>
            <td>15</td>
            <td>3</td>
            <td><input type="text" defaultValue="10:30"/></td>
            <td><input type="text" defaultValue="10:33"/></td>
          </tr>
     );
  }
  renderUnfocused(){
    return (
          <tr onClick={this.handleClick.bind(this)}>
            <td>勤怠</td>
            <td>作業</td>
            <td>15</td>
            <td>3</td>
            <td>10:30</td>
            <td>10:33</td>
          </tr>
        );
  }
  render() {
    if(this.state.focused){
      return this.renderFocused();
    }else{
      return this.renderUnfocused();
    }
  }
}
exports.Tasxs = Tasxs;
