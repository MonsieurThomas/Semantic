import React, { useState } from "react";

const plans = [
  {
    name: "Free",
    description: "Basic access to the platform",
    price: "0€",
    benefits: [
      "Access to basic features",
      "Community support",
      "Limited storage",
    ],
  },
  {
    name: "Starter",
    description: "For individuals starting out",
    price: "9,99€/mois",
    benefits: ["Everything in Free", "Additional storage", "Email support"],
  },
  {
    name: "Standard",
    description: "For small teams",
    price: "19,99€/mois",
    benefits: [
      "Everything in Starter",
      "Team collaboration features",
      "Priority support",
    ],
  },
  {
    name: "Advanced",
    description: "For large organizations",
    price: "49,99€/mois",
    benefits: [
      "Everything in Standard",
      "Advanced analytics",
      "Dedicated account manager",
    ],
  },
];

function Offer() {
  const [isMonthly, setIsMonthly] = useState(true);

  const handleToggle = () => {
    setIsMonthly(!isMonthly);
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 bg-[#fff9e0]">
      <button
        onClick={handleToggle}
        className={`relative flex items-center justify-between w-40 h-10 bg-white border border-black rounded-full cursor-pointer transition-colors duration-300`}
      >
        <span
          className={`absolute left-1 transform transition-transform duration-300 ${
            isMonthly ? "translate-x-0" : "translate-x-full"
          }`}
          style={{
            width: "50%",
            height: "90%",
            borderRadius: "9999px",
            background: "black",
          }}
        />
        <span
          className={`z-10 w-1/2 text-center ${
            isMonthly ? "text-white" : "text-black"
          }`}
        >
          Monthly
        </span>
        <span
          className={`z-10 w-1/2 text-center ${
            isMonthly ? "text-black" : "text-white"
          }`}
        >
          Annually
        </span>
      </button>

      <div className="grid grid-cols-4 gap-4 mt-8 w-full px-4">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="flex flex-col h-[600px] items-center p-4 bg-white rounded-xl transition-transform transform hover:scale-105"
          >
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="mt-2">{plan.description}</p>
            <p className="mt-9 font-bold text-4xl">{plan.price}</p>

            <button
              className={`mt-4 px-[80px] py-5 bg-${
                plan.name === "Free" ? "white border border-black" : "[#12cefe]"
              } rounded-xl font-semibold text-black hover:bg-blue-500 transition-colors duration-300`}
            >
              {plan.name === "Free" ? "Sign Up" : "Get Started"}
            </button>

            <ul className="mt-10 space-y-2">
              {plan.benefits.map((benefit, idx) => (
                <li key={idx} className="text-sm text-gray-600">
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Offer;
