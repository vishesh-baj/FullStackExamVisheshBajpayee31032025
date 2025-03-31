import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Order from "./orders";

@Table({ tableName: "order_items", timestamps: true })
export default class OrderItem extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID, allowNull: false })
  orderId!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  productId!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  productName!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity!: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  price!: number;

  @BelongsTo(() => Order)
  order!: Order;
}
