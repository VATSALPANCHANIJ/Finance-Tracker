"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';


const COLORS = [
    "#281c64",
    "#a01789",
    "#F54F52",
    "#ec2c5d",
    "#fc6840",
    "#f8c93d",
    "#612096",
];

export function DashboardOverView({ accounts, transactions }) {
    const [outerRadius, setOuterRadius] = useState(150);

    const updateRadius = () => {
        const screenWidth = window.innerWidth;

        if (screenWidth > 1200) {
            setOuterRadius(150); // Large screens
        } else if (screenWidth > 968) {
            setOuterRadius(100); // Tablets
        } else {
            setOuterRadius(80); // Mobile screens
        }
    };
    useEffect(() => {
        updateRadius(); // Set initial radius
        window.addEventListener('resize', updateRadius);

        // Cleanup listener on unmount
        return () => window.removeEventListener('resize', updateRadius);
    }, []);

    const [selectedAccountId, setSelectedAccountId] = useState(
        accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
    );
    // Filter transactions for selected account
    const accountTransactions = transactions.filter(
        (t) => t.accountId === selectedAccountId
    );

    // transactions (last 5)
    const recentTransactions = accountTransactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 8);


    // Calculate expense breakdown for current month
    const currentDate = new Date();
    const currentMonthExpenses = accountTransactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return (
            t.type === "EXPENSE" &&
            transactionDate.getMonth() === currentDate.getMonth() &&
            transactionDate.getFullYear() === currentDate.getFullYear()
        );
    });
    // Group expenses by category
    const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
        const category = transaction.category;
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += transaction.amount;
        return acc;
    }, {});

    // Format data for pie chart
    const pieChartData = Object.entries(expensesByCategory).map(
        ([category, amount]) => ({
            name: category,
            value: amount,
        })
    );


    return (
        <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Transactions Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-base font-normal">
                        Recent Transactions
                    </CardTitle>
                    <Select
                        value={selectedAccountId}
                        onValueChange={setSelectedAccountId}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentTransactions.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">
                                No recent transactions
                            </p>
                        ) : (
                            recentTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between  p-2 transition-all duration-200 hover:bg-gray-50 hover:shadow-md hover:scale-100"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {transaction.description || "Untitled Transaction"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(transaction.date), "PP")}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={cn(
                                                "flex items-center",
                                                transaction.type === "EXPENSE"
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            )}
                                        >
                                            {transaction.type === "EXPENSE" ? (
                                                <ArrowDownRight className="mr-1 h-4 w-4" />
                                            ) : (
                                                <ArrowUpRight className="mr-1 h-4 w-4" />
                                            )}
                                            ${transaction.amount.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Expense Breakdown Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-normal">
                        Monthly Expense Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 pb-5">
                    {pieChartData.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                            No expenses this month
                        </p>
                    ) : (
                        <div className="Pie_chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={outerRadius} // Dynamic radius
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => `$${value.toFixed(2)}`}
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--popover))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "var(--radius)",
                                            font: "16px",
                                            textTransform: "capitalize",
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardOverView;
