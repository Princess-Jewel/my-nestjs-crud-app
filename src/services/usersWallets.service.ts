

import { Injectable } from '@nestjs/common';
import { UsersWallets } from 'src/schema/usersWallets.model';


@Injectable()
export class UsersWalletsService {
  // Retrieve the current balance for a user
  async getUserBalance(userId: string): Promise<number> {
    const userWallet = await UsersWallets.findByPk(userId);
    console.log("userWallet", userWallet)
    return userWallet ? userWallet.walletBalance : 0;
  }


  

  // Update the user's wallet balance
//   async updateBalance(userId: number, amount: number, transactionType: string): Promise<void> {
//     let userWallet = await UsersWallets.findByPk(userId);

//     console.log("userWallet", userWallet)
//     console.log("userId", userId, "amount", amount)

//     const amountConvertedFromKoboToNaira = amount / 100;
//       // Update the existing user's wallet balance
//       userWallet.walletBalance += amountConvertedFromKoboToNaira;
//       await userWallet.save();
    

//     console.log(`Updated balance for user ${userId}: ${userWallet.walletBalance} (Transaction Type: ${transactionType})`);
//   }
}
