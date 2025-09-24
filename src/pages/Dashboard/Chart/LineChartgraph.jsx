import React, { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import '../../../App.css'

const data = [
  { month: "Jan", Pickup: 50000, Delivery: 100000 },
  { month: "Feb", Pickup: 150000, Delivery: 140000 },
  { month: "Mar", Pickup: 200000, Delivery: 150000 },
  { month: "Apr", Pickup: 140000, Delivery: 130000 },
  { month: "May", Pickup: 120000, Delivery: 150000 },
  { month: "Jun", Pickup: 110000, Delivery: 130000 },
];

const formatYAxis = (value) => {
  if (isNaN(value)) return "₹0";  // safe fallback
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
  return `₹${value}`;
};

export default function LineChartgraph() {
  const chartRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // ek hi bar trigger hoga
        }
      },
      { threshold: 0.3 } // chart ka 30% visible hone par
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "20px 0",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        margin: "20px",
        border: "1px solid #ddd",
        fontFamily: "Roboto Condensed",
      }}
    >
      <div
        style={{
          borderBottom: "1px solid #ddd",
          padding: "0",
          marginBottom: "15px",
        }}
      >
        <h2
          style={{
            fontWeight: "900",
            fontSize: "28px",
            margin: "0px 0 18px 17px",
          }}
        >
          Sales Bifurcation
        </h2>
      </div>
      <div className="linechart" style={{ width: "100%", height: 300, padding: "0px 15px" }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={formatYAxis}
              domain={['auto', 'auto']}
            />
            <Tooltip formatter={(value) => (isNaN(value) ? "₹0" : `₹${value.toLocaleString()}`)} />

            <Line
              type="monotone"
              dataKey="Pickup"
              stroke="red"
              strokeWidth={3}
              dot={false}
              isAnimationActive={isVisible}
              animationDuration={2500}
            />
            <Line
              type="monotone"
              dataKey="Delivery"
              stroke="red"
              strokeOpacity={0.3}
              strokeWidth={3}
              dot={false}
              isAnimationActive={isVisible}
              animationDuration={2500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
