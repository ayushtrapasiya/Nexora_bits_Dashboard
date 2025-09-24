import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import './StoreMetrics.css';

export default function StoreMetrics() {

  const [isSmall, setIsSmall] = useState(window.innerWidth <= 1250);
  const [isBelow950, setIsBelow950] = useState(window.innerWidth <= 950);

  useEffect(() => {
    const handleResize = () => setIsSmall(window.innerWidth <= 1250);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsBelow950(window.innerWidth <= 950);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const data = {
    metrics: [
      { title: "Cash", percentage: 62, change: 10.78 },
      { title: "Online", percentage: 12, change: 1.08 },
      { title: "Wallet", percentage: 30, change: 5.90 }
    ],
    chartData: [
      { time: "01:00am-03:00am", pickup: 1500, delivery: 1500 },
      { time: "03:00am-05:00am", pickup: 2000, delivery: 2000 },
      { time: "05:00am-07:00am", pickup: 1800, delivery: 700 },
      { time: "07:00am-09:00am", pickup: 2200, delivery: 1300 },
      { time: "09:00am-11:00am", pickup: 1500, delivery: 1500 },
      { time: "11:00am-01:00pm", pickup: 2700, delivery: 1500 },
      { time: "01:00pm-03:00pm", pickup: 3100, delivery: 1900 },
      { time: "03:00pm-05:00pm", pickup: 3000, delivery: 1800 },
      { time: "05:00pm-07:00pm", pickup: 2900, delivery: 1700 },
      { time: "07:00pm-09:00pm", pickup: 2000, delivery: 1100 },
      { time: "09:00pm-11:00pm", pickup: 1500, delivery: 1000 },
      { time: "11:00pm-01:00am", pickup: 1200, delivery: 800 }
    ]
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { payload: { pickup, delivery, time } } = payload[0];
      return (
        <div className="custom-tooltip">
          <p>{time}</p>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="tooltip-circle" style={{ backgroundColor: "#ff0000" }}></span>
              <span style={{ color: "black", marginLeft: 5 }}>Pick Up</span>
              <span style={{ color: "#ff0000", marginLeft: 10 }}>₹{pickup}</span>
            </div><br />
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="tooltip-circle" style={{ backgroundColor: "#eb7e90ff" }}></span>
              <span style={{ color: "black", marginLeft: 5 }}>Delivery</span>
              <span style={{ color: "#eb7e90ff", marginLeft: 10 }}>₹{delivery}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="storeMetrics">
      <div className="headerSection">
        <h3>Store Metrics</h3>
        <p>Your current sales summary and activity.</p>
      </div>


      {/* Metrics Row */}
      <div className="metricsRow">
        <div className="metricsLeft">
          {data.metrics.map((m, i) => (
            <div key={i} className="metricItem">
              <h4>{m.title}</h4>
              <div className="metricValue">
                <span>
                  {m.percentage}
                  %</span>
                <span className="down">
                  {/* className={m.change >= 0 ? "change up" : "change down"} */}
                  {m.change >= 0 ? <FaCaretUp className="mb-2 me-1" /> : <FaCaretDown />}
                  {Math.abs(m.change)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Dropdown + Filter Button */}
        <div className="metricsRight">
          <select>
            <option>7th Aug</option>
            <option>8th Aug</option>
          </select>
          <button className="filterBtn">
            <TbAdjustmentsHorizontal size={15} /> Filter
          </button>
        </div>
      </div>


      {/* Chart */}
      <div className="chartContainer">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data.chartData}


          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />



            {/* X-Axis with time formatting */}
            <XAxis
              dataKey="time"
              tick={(props) => {
                const { x, y, payload } = props;
                const [start, end] = payload.value.split("-");
                return (
                  <text x={x} y={y + 10} textAnchor="middle" fill="#aaa">
                    <tspan x={x} dy="0">{start}</tspan>
                    <tspan x={x} dy="15">{end}</tspan>
                  </text>
                );
              }}
              interval={isBelow950 ? 1 : 0}// Ensures all ticks are shown
            />
            <YAxis tickFormatter={(val) => `₹${val}`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Legend
              verticalAlign="top"
              align="right"
              layout="vertical"
              iconType="circle"
              wrapperStyle={{ color: "#000" }}
              formatter={(value) => {
                if (value === "pickup") return "Pick Up";
                if (value === "delivery") return "Delivery";
                return value;
              }}
            />

            {/* Bars for Pickup and Delivery */}
            <Bar dataKey="pickup" stackId="a" fill="#ff0000" barSize={isSmall ? 40 : 55} />
            <Bar dataKey="delivery" stackId="a" fill="#ffc0cb" radius={[4, 4, 0, 0]} barSize={isSmall ? 40 : 55} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}