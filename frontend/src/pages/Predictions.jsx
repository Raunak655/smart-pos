import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import { api } from "../services/api";

export default function Predictions() {

  const [data, setData] = useState([]);

  useEffect(() => {
    api.mlPredictions
      .getPredictions()
      .then((res) => {
        console.log(res);
        setData(res.predictions || []);
      })
      .catch((error) => {
        console.error("Failed to load predictions:", error);
        setData([]);
      });
  }, []);

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold text-white mb-6">

        📈 ML Sales Forecast

      </h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

        {

          data.length === 0 ? (

            <div className="text-center text-slate-400 py-20">

              No prediction data available yet

            </div>

          ) : (

            <ResponsiveContainer width="100%" height={400}>

              <LineChart data={data}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff10"
                />

                <XAxis
                  dataKey="day"
                  tick={{ fill: "#94a3b8" }}
                />

                <YAxis
                  tick={{ fill: "#94a3b8" }}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="predicted_sales"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          )
        }

      </div>

    </div>
  );
}