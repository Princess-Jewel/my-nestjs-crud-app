

import { Injectable } from '@nestjs/common';
import { Users } from 'src/schema/users.model';
import { Transactions } from 'src/schema/transactions.model';


@Injectable()
export class TransactionsService {
  constructor(){}
  // Retrieve the current balance for a user
  // async getUserBalance(userId: number): Promise<number> {
  //   const userWallet = await Transactions.findByPk(userId);
  //   console.log("userWallet", userWallet)

  //   console.log("userWallet amount", userWallet.amount)
  //   return userWallet ? userWallet.amount : 0;
  // }


  

  // Update the user's wallet balance
  // async updateBalance(email: string, reference: string, currency: string, amount: number, transactionType: string): Promise<void> {
  //   let userWallet = await Transactions.findOne({
  //     where: {
  //       email
  //     },
  //     include: [Users],
  //   });
  
  //   console.log("userWallet", userWallet);
  
  //   if (userWallet) {
  //     // Convert the amount from kobo to naira and ensure it's a valid decimal
  //     // const amountConvertedFromKoboToNaira = parseFloat((amount / 100).toFixed(2));
  
  //     // console.log("amountConvertedFromKoboToNaira amount", amountConvertedFromKoboToNaira);
  //     // console.log("userWallet amount", userWallet.amount);
  
  //     // Update the existing user's wallet balance
  //     userWallet.amount += amount;
  
  //     // Save the userWallet
  //     await userWallet.save();
  
  //     console.log(`Updated balance for user: ${amount} (Transaction Type: ${transactionType}) (email: ${email}) (currency: ${currency}) (reference: ${reference})`);
  //   } else {
  //     console.log(`User with email ${email} not found.`);
  //   }
  // }
  
}
