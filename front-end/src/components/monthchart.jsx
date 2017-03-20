import React, { PropTypes, Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default class MonthChart extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  render() {
    return (
      <BarChart width={1024} height={375} data={this.props.data}>
        <XAxis dataKey="month" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Bar dataKey="VK" stackId="a" fill="#236A62" />
        <Bar dataKey="IP UC" stackId="a" fill="#3F3075" />
        <Bar dataKey="Safety" stackId="a" fill="#80A035" />
      </BarChart>
    );
  }
}
