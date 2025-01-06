import { Messages } from "@/types/Messages";

export const languages: { lang: string; messages: Messages }[] = [
  {
    lang: "en-us",
    messages: {
      error: {
        firebase: "Error fetching data from Firebase:",
        update: "Error updating data:",
        something: "Sorry! Something wrong happened.",
      },
      success: {
        add: "Successfully added!",
        update: "Successfully updated!",
        delete: "Successfully deleted!",
        received: " was successfully received!",
        paid: " was successfully paid!",
      },
      loading: {
        add: "Adding...",
        update: "Updating...",
        delete: "Deleting...",
      },
      form: {
        fillAll: "Please fill out all fields.",
        valid: "Please enter a valid value.",
        paymentDay: "Please provide a payment day.",
        payDay: "Payment Day",
        budget: "Monthly Budget",
        from: "From",
        to: "To",
        amount: "Amount",
        date: "Date",
        type: "Type here",
        select: "Select",
      },
      button: {
        confirmation: "Are you sure you want to delete it?",
        cancel: "Cancel",
        delete: "Delete",
        close: "Close",
        edit: "Edit",
        details: "Details",
        save: "Save",
        add: "Add",
        receive: "Receive",
        pay: "Pay",
      },
      other: {
        noCategory: "No Category",
        transaction: "Transaction",
        transactions: "Transactions",
        bill: "Bill",
        income: "Income",
        expense: "Expense",
        expenses: "Expenses",
        category: "Category",
        categories: "Categories",
        home: "Home",
        reports: "Reports",
        profile: "Profile",
        and: "And",
        manage: "Manage", //Gerenciar
        color: "Color",
        spent: "Spent", //Gasto
        left: "Left", //Faltam
        noBills: "There are not bills to pay or salaries to receive anymore!",
      },
    },
  },
];
