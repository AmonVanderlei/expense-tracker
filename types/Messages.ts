export interface Messages {
  error: {
    firebase: string;
    update: string;
    something: string;
  };
  success: {
    add: string;
    update: string;
    delete: string;
    received: string;
    paid: string;
  };
  loading: {
    add: string;
    update: string;
    delete: string;
  };
  form: {
    fillAll: string;
    valid: string;
    paymentDay: string;
    payDay: string;
    budget: string;
    from: string;
    to: string;
    amount: string;
    date: string;
    type: string;
    select: string;
  };
  button: {
    confirmation: string;
    cancel: string;
    delete: string;
    close: string;
    edit: string;
    details: string;
    save: string;
    add: string;
    receive: string;
    pay: string;
  };
  other: {
    noCategory: string;
    transaction: string;
    transactions: string;
    bill: string;
    income: string;
    expense: string;
    expenses: string;
    category: string;
    categories: string;
    home: string;
    reports: string;
    profile: string;
    and: string;
    manage: string;
    color: string;
    spent: string;
    left: string;
    noBills: string;
  };
}
