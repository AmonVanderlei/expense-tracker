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
        manage: "Manage",
        color: "Color",
        spent: "Spent",
        left: "Left",
        noBills: "There are not bills to pay or salaries to receive anymore!",
        hello: "Hello",
        totalBalance: "Total Balance",
        upcoming: "Upcoming",
        recent: "Recent",
        all: "See All",
        history: "History",
        about: "About",
        logout: "Log Out",
        madeBy: "Made by",
        signin: "Sign in to manage your finances easily and smartly.",
        google: "Sign In with Google",
        learnMore: "Learn more about the project",
        chooseA: "Choose a",
        language: "the language",
      },
    },
  },
  {
    lang: "pt-br",
    messages: {
      error: {
        firebase: "Erro ao buscar dados do Firebase:",
        update: "Erro ao atualizar os dados:",
        something: "Desculpe! Algo deu errado.",
        login: "Tente novamente! Algo deu errado ao fazer login.",
      },
      success: {
        add: "Adicionado com sucesso!",
        update: "Atualizado com sucesso!",
        delete: "Excluído com sucesso!",
        received: " foi recebido com sucesso!",
        paid: " foi pago com sucesso!",
      },
      loading: {
        add: "Adicionando...",
        update: "Atualizando...",
        delete: "Excluindo...",
        loading: "Carregando...",
      },
      form: {
        fillAll: "Por favor, preencha todos os campos.",
        valid: "Por favor, insira um valor válido.",
        paymentDay: "Por favor, informe um dia de pagamento.",
        payDay: "Pagamento",
        budget: "Orçamento Mensal",
        from: "De",
        to: "Para",
        amount: "Valor",
        date: "Data",
        type: "Digite aqui",
        select: "Selecione",
        selectBoth: "Por favor, selecione o mês e o ano.",
      },
      button: {
        confirmation: "Tem certeza de que deseja excluir?",
        cancel: "Cancelar",
        delete: "Excluir",
        close: "Fechar",
        edit: "Editar",
        details: "Detalhes",
        save: "Salvar",
        add: "Adicionar",
        receive: "Receber",
        pay: "Pagar",
      },
      other: {
        noCategory: "Sem Categoria",
        transaction: "Transação",
        transactions: "Transações",
        bill: "Conta",
        bills: "Contas",
        income: "Receita",
        expense: "Despesa",
        expenses: "Despesas",
        category: "Categoria",
        categories: "Categorias",
        home: "Início",
        reports: "Relatórios",
        profile: "Perfil",
        and: "E",
        manage: "Gerenciar",
        color: "Cor",
        spent: "Gasto",
        left: "Faltam",
        noBills: "Não há mais contas para pagar ou salários a receber!",
        hello: "Olá",
        totalBalance: "Saldo Total",
        upcoming: "Futuras",
        recent: "Recentes",
        all: "Ver Todos",
        history: "Histórico",
        about: "Sobre",
        logout: "Sair",
        madeBy: "Feito por",
        signin:
          "Faça login para gerenciar suas finanças de forma fácil e inteligente.",
        google: "Entrar com Google",
        learnMore: "Saiba mais sobre o projeto",
        chooseA: "Escolha uma",
        language: "o idioma",
      },
    },
  },
];
