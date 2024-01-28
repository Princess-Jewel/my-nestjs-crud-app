

import { Transactions } from "src/schema/transactions.model";

export const transactionsProviders = [
  {
    provide: 'USERS_WALLETS_REPOSITORY',
    useValue: Transactions,
  },
];