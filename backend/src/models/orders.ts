import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import User from "./user";
import OrderItem from "./order_item";

@Table({ tableName: "orders", timestamps: true })
export default class Order extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId!: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  totalAmount!: number;

  @Column({
    type: DataType.ENUM("pending", "completed", "cancelled"),
    defaultValue: "pending",
  })
  status!: string;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => OrderItem)
  orderItems!: OrderItem[];
}
