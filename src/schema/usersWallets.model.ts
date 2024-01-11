

import { Model, Table, Column, DataType, PrimaryKey, AutoIncrement} from 'sequelize-typescript';

@Table
export class UsersWallets extends Model<UsersWallets> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

  @Column({ type: DataType.NUMBER, allowNull: false })
  userId: number;

  @Column({ type: DataType.DECIMAL(18, 2), defaultValue: 0.00, allowNull: false })
  walletBalance: number;

  @Column({ type: DataType.STRING, allowNull: false })
  transactionType: string;


}

