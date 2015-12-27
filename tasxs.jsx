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
      <table>
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
          <tr>
            <td>勤怠</td>
            <td>作業</td>
            <td>15</td>
            <td>3</td>
            <td>10:30</td>
            <td>10:33</td>
          </tr>
          <tr>
            <td><input type="text" defaultValue="勤怠" /></td>
            <td><select><option>作業</option></select></td>
            <td>15</td>
            <td>3</td>
            <td><input type="text" defaultValue="10:30"/></td>
            <td><input type="text" defaultValue="10:33"/></td>
          </tr>
        </tbody>
      </table>
      </section>;
  }
}
exports.Tasxs = Tasxs;
