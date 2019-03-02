import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity
} from "typeorm";
import { Socket } from "rakkit";
import * as Crypto from "crypto";

@Entity("user")
export class UserModel extends BaseEntity {
  private _socket?: Socket;

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

  @Column({
    name: "token",
    length: 255,
    nullable: true,
    unique: true,
    default: null
  })
  private _token: string;

  get Id() {
    return this._id;
  }

  get UserId() {
    return this._userId;
  }

  get Premium() {
    return !!this._token;
  }
  set Premium(val: boolean) {
    this.setPremium(val);
  }

  get Socket() {
    return this._socket;
  }
  set Socket(val: Socket) {
    this._socket = val;
  }

  get Token() {
    return this._token;
  }

  constructor(userId: string, premium?) {
    super();
    this._userId = userId;
    this.setPremium(premium);
  }

  setPremium(premium: boolean) {
    this._token = premium ? Crypto.randomBytes(64).toString("hex") : null;
  }
}
