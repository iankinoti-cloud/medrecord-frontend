import React from 'react'

const StatCards = () => {
    const stats = [
        { id: 1, title:"Total Records", value: "1240",change: "+12% this week", color: "text-blue-600", bg: "bg-blue-50" },
        {id: 2, title:"In ER", value: "18", change: "Current Active", color: "text-red-600", bg: "bg-red-50" },
        {id: 3, title:"Pending Lab", value: "7", change: "Awaiting Results", color: "text-amber-600", bg: "bg-amber-50" },
        {id: 4, title:"Uptime", value: "99.9%", change: "System Status", color: "text-green-600", bg: "bg-green-50" },
    ];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <div key={stat.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                        <h3 className={"text-2xl font-bold mt-2 ${stat.color}"}>{stat.value}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-3 font-medium">{stat.change}</p>
                    </div>
            ))}
                </div>

    );
};
export default StatCards;