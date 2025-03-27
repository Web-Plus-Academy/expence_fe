import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = "https://expence-be.onrender.com/api/v1/";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    
        // Memoized fetchData to prevent infinite re-renders
        const fetchData = useCallback(async () => {
            await getIncomes();
            await getExpenses();
        }, []); // No dependencies so it remains stable
    
        // Fetch incomes & expenses only when the component mounts
        useEffect(() => {
            fetchData();
        }, [fetchData]); // Dependency array ensures it's called only once

    // Fetch incomes
    const getIncomes = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}get-incomes`);
            setIncomes((prev) => (JSON.stringify(prev) !== JSON.stringify(data) ? data : prev)); // Avoid unnecessary updates
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching incomes");
        }
    };

    // Fetch expenses
    const getExpenses = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}get-expenses`);
            setExpenses((prev) => (JSON.stringify(prev) !== JSON.stringify(data) ? data : prev)); // Avoid unnecessary updates
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching expenses");
        }
    };

    // Add income
    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, income);
            await getIncomes(); // Fetch only incomes after update
        } catch (error) {
            setError(error.response?.data?.message || "Error adding income");
        }
    };

    // Delete income
    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`);
            await getIncomes();
        } catch (error) {
            setError(error.response?.data?.message || "Error deleting income");
        }
    };

    // Add expense
    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense);
            await getExpenses(); // Fetch only expenses after update
        } catch (error) {
            setError(error.response?.data?.message || "Error adding expense");
        }
    };

    // Delete expense
    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`);
            await getExpenses();
        } catch (error) {
            setError(error.response?.data?.message || "Error deleting expense");
        }
    };

    // Calculate total income
    const totalIncome = () => incomes.reduce((sum, income) => sum + income.amount, 0);

    // Calculate total expenses
    const totalExpenses = () => expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate total balance
    const totalBalance = () => totalIncome() - totalExpenses();

    // Get last 3 transactions
    const transactionHistory = () => {
        return [...incomes, ...expenses]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
    };

    return (
        <GlobalContext.Provider
            value={{
                addIncome,
                getIncomes,
                incomes,
                deleteIncome,
                expenses,
                totalIncome,
                addExpense,
                getExpenses,
                deleteExpense,
                totalExpenses,
                totalBalance,
                transactionHistory,
                error,
                setError,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
