import { ACCOUNT_ROLES } from "./clean.js";

export * from "./clean.ts";

export type AccountParams = { identifier: string };

export enum AccountState {
  Active,
}

export class Account {
  public displayName = "account";
  private secret = "secret";

  constructor(readonly identifier: string) {}
}

export function totalOf(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0);
}

export function describeLength(value: string | null): string {
  return value ? (value.length > 3 ? "long" : "short") : "none";
}

export function getFirstCharacter(value: string | null): string {
  return value!.charAt(0);
}

export function parseText(text: string): any {
  return JSON.parse(text);
}

export function logRoles(): void {
  for (let i = 0; i < ACCOUNT_ROLES.length; i += 1) {
    console.log(ACCOUNT_ROLES[i]);
  }
}

export async function loadRoles(): Promise<string[]> {
  return Promise.resolve([...ACCOUNT_ROLES]);
}

export function startLoadingRoles(_unusedOption: string): void {
  loadRoles();
}

export function countRoles(roles: string[]): number {
  return roles.filter((roles) => roles.length > 0).length;
}

export default Account;
