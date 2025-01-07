import { Messages } from "@/types/Messages";

export const languages: { lang: string; messages: Messages }[] = [
  {
    lang: "en-us",
    messages: {
      error: {
        firebase: "Error fetching data from Firebase:",
        update: "Error updating data:",
        something: "Sorry! Something wrong happened.",
        login: "Try again! Something wrong happened while logging in.",
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
        loading: "Loading...",
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
        selectBoth: "Please select both month and year.",
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
        bills: "Bills",
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
        hello: "Hello",
        totalBalance: "Total Balance", //Saldo total
        upcoming: "Upcoming", //Futuras
        recent: "Recent",
        all: "See All",
        history: "History", //Histórico
        about: "About",
        logout: "Log Out",
        madeBy: "Made by",
        signin: "Sign in to manage your finances easily and smartly.",
        google: "Sign In with Google",
        learnMore: "Learn more about the project",
        chooseA: "Choose a", //Uma
      },
    },
  },
];
