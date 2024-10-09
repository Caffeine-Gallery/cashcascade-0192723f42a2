import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Employee {
  'id' : bigint,
  'name' : string,
  'category' : EmployeeCategory,
}
export type EmployeeCategory = { 'Junior' : null } |
  { 'Senior' : null } |
  { 'CSuite' : null };
export interface Expense {
  'id' : bigint,
  'date' : bigint,
  'description' : string,
  'employeeId' : bigint,
  'amount' : number,
}
export interface _SERVICE {
  'addEmployee' : ActorMethod<[string, string], bigint>,
  'addExpense' : ActorMethod<[bigint, number, string], [] | [bigint]>,
  'getAllEmployees' : ActorMethod<[], Array<Employee>>,
  'getEmployee' : ActorMethod<[bigint], [] | [Employee]>,
  'getExpensesByCategory' : ActorMethod<[string], Array<Expense>>,
  'getExpensesByEmployee' : ActorMethod<[bigint], Array<Expense>>,
  'getTotalExpenses' : ActorMethod<[], number>,
  'getTotalExpensesByCategory' : ActorMethod<[string], number>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
