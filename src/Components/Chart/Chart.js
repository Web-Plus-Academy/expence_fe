import React, { useState } from 'react';
import {
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

import zoomPlugin from 'chartjs-plugin-zoom';
import { Line, Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    zoomPlugin
);

// Format date to YYYY-MM-DD
const dateFormat = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

function Chart() {
    const { incomes, expenses } = useGlobalContext();
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [chartType, setChartType] = useState('line'); // 'line' or 'bar'
    const [grouping, setGrouping] = useState('daily'); // 'daily', 'weekly', or 'monthly'

    // Helper function to aggregate amounts by date, week, or month
    const aggregateByDate = (data) => {
        return data.reduce((acc, item) => {
            const { date, amount } = item;
            const formattedDate = groupDate(date, grouping);
            if (!acc[formattedDate]) {
                acc[formattedDate] = 0;
            }
            acc[formattedDate] += amount;
            return acc;
        }, {});
    };

    // Helper function to group data by date, week, or month
    const groupDate = (date, grouping) => {
        const formattedDate = new Date(date);
        switch (grouping) {
            case 'weekly':
                const weekStart = new Date(
                    formattedDate.setDate(formattedDate.getDate() - formattedDate.getDay())
                );
                return dateFormat(weekStart);
            case 'monthly':
                const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
                return `${formattedDate.getFullYear()}-${month}`;
            default: // 'daily'
                return dateFormat(date);
        }
    };

    // Filter data by selected date range
    const filterByDateRange = (data) => {
        if (!dateRange.start || !dateRange.end) return data;
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return data.filter(({ date }) => {
            const currentDate = new Date(date);
            return currentDate >= startDate && currentDate <= endDate;
        });
    };

    // Filtered and aggregated data
    const filteredIncomes = filterByDateRange(incomes);
    const filteredExpenses = filterByDateRange(expenses);

    const aggregatedIncomes = aggregateByDate(filteredIncomes);
    const aggregatedExpenses = aggregateByDate(filteredExpenses);

    // Prepare labels and data
    const labels = Object.keys(aggregatedIncomes)
        .concat(Object.keys(aggregatedExpenses))
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort((a, b) => new Date(a) - new Date(b));

    const incomeData = labels.map((label) => aggregatedIncomes[label] || 0);
    const expenseData = labels.map((label) => aggregatedExpenses[label] || 0);

    const data = {
        labels,
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                backgroundColor: 'green',
                borderColor: 'green',
                tension: 0.2,
            },
            {
                label: 'Expenses',
                data: expenseData,
                backgroundColor: 'red',
                borderColor: 'red',
                tension: 0.2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Income vs Expenses',
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x',
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: 'x',
                },
            },
        },
    };

    return (
        <ChartStyled>
            <Controls>
                <div>
                    <label>
                        Start Date:
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) =>
                                setDateRange((prev) => ({ ...prev, start: e.target.value }))
                            }
                        />
                    </label>
                    <label>
                        End Date:
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) =>
                                setDateRange((prev) => ({ ...prev, end: e.target.value }))
                            }
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Group By:
                        <select value={grouping} onChange={(e) => setGrouping(e.target.value)}>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Chart Type:
                        <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                            <option value="line">Line</option>
                            <option value="bar">Bar</option>
                        </select>
                    </label>
                </div>
            </Controls>
            {chartType === 'line' ? <Line data={data} options={options} /> : <Bar data={data} options={options} />}
        </ChartStyled>
    );
}

const ChartStyled = styled.div`
    background: #fcf6f9;
    border: 2px solid #ffffff;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    height: 100%;
`;

const Controls = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    gap: 1rem;

    label {
        font-size: 0.9rem;
        margin-right: 0.5rem;
    }

    input,
    select {
        padding: 0.5rem;
        border-radius: 8px;
        border: 1px solid #ccc;
        font-size: 0.9rem;
    }
`;

export default Chart;
