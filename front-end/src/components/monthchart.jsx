import React, { PropTypes } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const MonthChart = ({ data }) =>
  <BarChart width={1024} height={375} data={data}>
    <XAxis dataKey="month" />
    <YAxis />
    <CartesianGrid strokeDasharray="3 3" />
    <Tooltip />
    <Legend />
    <Bar dataKey="VK" stackId="a" fill="#236A62" />
    <Bar dataKey="IP UC" fill="#3F3075" />
    <Bar dataKey="Safety" stackId="a" fill="#80A035" />
  </BarChart>;

MonthChart.propTypes = {
  data: PropTypes.array.isRequired
};

export default MonthChart;
