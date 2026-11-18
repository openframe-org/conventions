export type AccountParams = {
  identifier: string;
  displayName: string | null;
};

export const ACCOUNT_ROLES = ["owner", "member"] as const;

export type AccountRole = (typeof ACCOUNT_ROLES)[number];

export class Account {
  identifier: string;
  displayName: string | null;

  constructor(params: AccountParams) {
    this.identifier = params.identifier;
    this.displayName = params.displayName;
  }

  getDisplayNameOrIdentifier(): string {
    return this.displayName ?? this.identifier;
  }
}

export function isAccountRole(value: string): value is AccountRole {
  return ACCOUNT_ROLES.some((role) => role === value);
}

export function findAccountByIdentifier(accounts: Account[], identifier: string): Account | null {
  for (const account of accounts) {
    if (account.identifier === identifier) {
      return account;
    }
  }

  return null;
}

export async function loadAccountRoles(): Promise<readonly AccountRole[]> {
  return Promise.resolve(ACCOUNT_ROLES);
}

export function startLoadingAccountRoles(): void {
  void loadAccountRoles();
}
