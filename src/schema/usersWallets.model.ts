import { Model, Table, Column, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo} from 'sequelize-typescript';
import { Users } from './users.model';

@Table
export class UsersWallets extends Model<UsersWallets> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  reference: string;

  @Column({ type: DataType.STRING, allowNull: false })
  currency: string;

  @Column({ type: DataType.DECIMAL(18, 2), defaultValue: 0.00, allowNull: false })
  amount: number;

  @Column({ type: DataType.STRING, allowNull: false })
  transactionType: string;

  // Define the association with Users
  @ForeignKey(() => Users)
  @Column
  userId: number;

  @BelongsTo(() => Users)
  user: Users; // This sets up the association to the Users model
  totalCredits: number;
  totalDebits: number;
}
