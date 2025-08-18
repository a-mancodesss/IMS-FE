import { PureComponent } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default class ConditionPieChart extends PureComponent {
  renderCustomizedLabel = (props) => {
    const { cx, cy, midAngle, outerRadius, percent, index } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 16;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const { chartData } = this.props;
    const name = chartData[index].name;

    return (
      <text
        x={x}
        y={y}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={16}
        fontFamily="Poppins"
        fill={chartData[index].color}
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  render() {
    const { chartData, isLabelRequired = true } = this.props;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={isLabelRequired ? this.renderCustomizedLabel : false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "0.75rem",
              fontFamily: "Poppins",
              fontSize: "0.9rem",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
