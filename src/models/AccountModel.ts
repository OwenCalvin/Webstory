import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity
} from "typeorm";
import { Socket } from "rakkit";

@Entity("account")
export class AccountModel extends BaseEntity {
  private _sockets: Socket[];

  @PrimaryGeneratedColumn({
    name: "id"
  })
  private readonly _id: number;

  @Column({
    name: "user_id",
    length: 15,
    unique: true,
    nullable: false
  })
  private _userId: string;

  get Id() {
    return this._id;
  }

  get UserId() {
    return this._userId;
  }

  get Sockets() {
    return this._sockets;
  }
  set Sockets(val: Socket[]) {
    this._sockets = val;
  }

  constructor(userId: string) {
    super();
    this._userId = userId;
    this.Sockets = [];
  }
}
