

import { UsersWallets } from "src/schema/usersWallets.model";

export const usersWalletsProviders = [
  {
    provide: 'USERS_WALLETS_REPOSITORY',
    useValue: UsersWallets,
  },
];