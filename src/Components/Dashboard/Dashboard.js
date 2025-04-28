import React, { useEffect } from 'react';
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import Chart from '../Chart/Chart';
import './Dashboard.css';

function Dashboard() {
    const { totalExpenses, incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses } = useGlobalContext();

    useEffect(() => {
        getIncomes();
        getExpenses();
    }, [getIncomes, getExpenses]);

    return (
        <div className="dashboard">
            <InnerLayout>
                <h1>All Transactions</h1>
                <div className="stats-con">
                    <div className="chart-con">
                        <Chart />
                        <div className="amount-con">
                            <div className="income">
                                <h2>Total Income</h2>
                                <p>₹{totalIncome().toLocaleString()}</p>
                            </div>
                            <div className="expense">
                                <h2>Total Expense</h2>
                                <p>₹{totalExpenses().toLocaleString()}</p>
                            </div>
                            <div className="balance">
                                <h2>Total Balance</h2>
                                <p>₹{totalBalance().toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="history-con">
                        <History />
                        <h2 className="salary-title">Min <span>Income</span> Max</h2>
                        <div className="salary-item">
                            <p>
                                ₹{Math.min(...incomes.map(item => item.amount)).toLocaleString()}
                            </p>
                            <p>
                                ₹{Math.max(...incomes.map(item => item.amount)).toLocaleString()}
                            </p>
                        </div>
                        <h2 className="salary-title">Min <span>Expense</span> Max</h2>
                        <div className="salary-item">
                            <p>
                                ₹{Math.min(...expenses.map(item => item.amount)).toLocaleString()}
                            </p>
                            <p>
                                ₹{Math.max(...expenses.map(item => item.amount)).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </InnerLayout>
        </div>
    );
}

export default Dashboard;
