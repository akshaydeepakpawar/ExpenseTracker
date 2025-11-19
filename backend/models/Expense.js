import mongoose from "mongoose";
const ExpenseSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,ref:"User",require:true
    },
    icon:{type:String},
    category:{type:String,require:true},
    amount:{type:Number,require:true},
    date:{type:Date,default:Date.now},
},{timestamps:true});

const Expense=mongoose.model("Expense",ExpenseSchema);
export default Expense;