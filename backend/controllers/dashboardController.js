import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import { isValidObjectId, Types } from "mongoose";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    //fetch all income and expenses
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    console.log("totalIncome", {
      totalIncome,
      userId: isValidObjectId(userId),
    });

    // total expense
    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    //get income transections of last 60 days

    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    //get total income for last 60 days;
    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, transection) => sum + transection.amount,
      0
    );

    // get expense transection in the last 30 days
    const last30DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    //get total income for last 30 days;
    const expensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transection) => sum + transection.amount,
      0
    );
    // fetch last 5 transactions (income + expense)
    const last5Income = await Income.find({ userId })
      .sort({ date: -1 })
      .limit(5);

    const last5Expense = await Expense.find({ userId })
      .sort({ date: -1 })
      .limit(5);

    // merge and sort by date
    const merged = [...last5Income, ...last5Expense].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // take only final 5
    const lastTransactions = merged.slice(0, 5);

    // Final Response

    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),

      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpense[0]?.total || 0,

      last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },

      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },

      recentTransactions: lastTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
