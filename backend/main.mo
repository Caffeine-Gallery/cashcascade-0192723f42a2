import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Int "mo:base/Int";

import Array "mo:base/Array";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  // Types
  type EmployeeCategory = {
    #CSuite;
    #Senior;
    #Junior;
  };

  type Employee = {
    id: Nat;
    name: Text;
    category: EmployeeCategory;
  };

  type Expense = {
    id: Nat;
    employeeId: Nat;
    amount: Float;
    description: Text;
    date: Int;
  };

  // State
  stable var nextEmployeeId: Nat = 0;
  stable var nextExpenseId: Nat = 0;
  let employees = HashMap.HashMap<Nat, Employee>(0, Nat.equal, Nat.hash);
  let expenses = HashMap.HashMap<Nat, Expense>(0, Nat.equal, Nat.hash);

  // Helper functions
  func categoryToText(category: EmployeeCategory): Text {
    switch (category) {
      case (#CSuite) "CSuite";
      case (#Senior) "Senior";
      case (#Junior) "Junior";
    };
  };

  // Employee management
  public func addEmployee(name: Text, category: Text): async Nat {
    let id = nextEmployeeId;
    nextEmployeeId += 1;

    let employeeCategory = switch (category) {
      case "CSuite" #CSuite;
      case "Senior" #Senior;
      case "Junior" #Junior;
      case _ #Junior; // Default to Junior if invalid category
    };

    let employee: Employee = {
      id;
      name;
      category = employeeCategory;
    };

    employees.put(id, employee);
    id
  };

  public query func getEmployee(id: Nat): async ?Employee {
    employees.get(id)
  };

  public query func getAllEmployees(): async [Employee] {
    Iter.toArray(employees.vals())
  };

  // Expense management
  public func addExpense(employeeId: Nat, amount: Float, description: Text): async ?Nat {
    switch (employees.get(employeeId)) {
      case (null) { null };
      case (?_) {
        let id = nextExpenseId;
        nextExpenseId += 1;

        let expense: Expense = {
          id;
          employeeId;
          amount;
          description;
          date = Time.now();
        };

        expenses.put(id, expense);
        ?id
      };
    };
  };

  public query func getExpensesByEmployee(employeeId: Nat): async [Expense] {
    Iter.toArray(Iter.filter(expenses.vals(), func (e: Expense): Bool { e.employeeId == employeeId }))
  };

  public query func getExpensesByCategory(category: Text): async [Expense] {
    let filteredEmployees = Iter.filter(employees.vals(), func (e: Employee): Bool { 
      categoryToText(e.category) == category 
    });
    let employeeIds = Iter.map(filteredEmployees, func (e: Employee): Nat { e.id });
    Iter.toArray(Iter.filter(expenses.vals(), func (e: Expense): Bool { 
      Option.isSome(Array.find(Iter.toArray(employeeIds), func (id: Nat): Bool { id == e.employeeId }))
    }))
  };

  public query func getTotalExpenses(): async Float {
    var total: Float = 0;
    for (expense in expenses.vals()) {
      total += expense.amount;
    };
    total
  };

  public query func getTotalExpensesByCategory(category: Text): async Float {
    var total: Float = 0;
    for (expense in expenses.vals()) {
      switch (employees.get(expense.employeeId)) {
        case (?employee) {
          if (categoryToText(employee.category) == category) {
            total += expense.amount;
          };
        };
        case (null) {};
      };
    };
    total
  };
}
