import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function SalesHistory() {

  const [bills, setBills] = useState([]);

  useEffect(() => {

    const loadBills = async () => {

      try {

        const data = await api.billing.getBills();

        setBills(data);

      } catch (error) {

        console.error(error);

      }
    };

    loadBills();

  }, []);

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold text-white mb-6">
        Sales History
      </h1>

      <div className="space-y-4">

        {bills.map((bill, index) => (

          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-xl p-5"
          >

            <div className="flex justify-between mb-3">

              <div>

                <h2 className="text-white font-semibold">
                  {bill.customer_name}
                </h2>

                <p className="text-slate-400 text-sm">
                  {new Date(bill.created_at).toLocaleString()}
                </p>

              </div>

              <div className="text-green-400 font-bold">
                Rs {bill.total}
              </div>

            </div>

            <div className="space-y-2">

              {bill.items.map((item, i) => (

                <div
                  key={i}
                  className="flex justify-between text-sm"
                >

                  <span className="text-slate-300">
                    {item.name}
                  </span>

                  <span className="text-slate-400">
                    {item.quantity} × Rs {item.price}
                  </span>

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}