export const idlFactory = ({ IDL }) => {
  const EmployeeCategory = IDL.Variant({
    'Junior' : IDL.Null,
    'Senior' : IDL.Null,
    'CSuite' : IDL.Null,
  });
  const Employee = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'category' : EmployeeCategory,
  });
  const Expense = IDL.Record({
    'id' : IDL.Nat,
    'date' : IDL.Int,
    'description' : IDL.Text,
    'employeeId' : IDL.Nat,
    'amount' : IDL.Float64,
  });
  return IDL.Service({
    'addEmployee' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
    'addExpense' : IDL.Func(
        [IDL.Nat, IDL.Float64, IDL.Text],
        [IDL.Opt(IDL.Nat)],
        [],
      ),
    'getAllEmployees' : IDL.Func([], [IDL.Vec(Employee)], ['query']),
    'getEmployee' : IDL.Func([IDL.Nat], [IDL.Opt(Employee)], ['query']),
    'getExpensesByCategory' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Expense)],
        ['query'],
      ),
    'getExpensesByEmployee' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(Expense)],
        ['query'],
      ),
    'getTotalExpenses' : IDL.Func([], [IDL.Float64], ['query']),
    'getTotalExpensesByCategory' : IDL.Func(
        [IDL.Text],
        [IDL.Float64],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
