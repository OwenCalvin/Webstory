import "reflect-metadata";
import * as BodyParser from "koa-bodyparser";
import * as Path from "path";
import { Rakkit, MetadataStorage } from "rakkit";
import { createConnection } from "typeorm";
import { InstagramService, LoginService } from "./services";

export class Main {
  private _instance: Main;

  get Instance() {
    if (!this._instance) {
      this._instance = new Main();
    }
    return this._instance;
  }

  private constructor() {
  }

  static async start() {
    await createConnection({
      name: "default",
      username: "root",
      password: "root",
      database: "webstory",
      synchronize: true,
      type: "mysql",
      entities: [
        this.getGlob("models", "Model")
      ]
    });

    await Rakkit.start({
      globalRestMiddlewares: [
        BodyParser()
      ],
      routers: [
        this.getGlob("routers", "Router")
      ],
      websockets: [
        this.getGlob("websockets", "Ws")
      ]
    });

    MetadataStorage.getService(LoginService).login();
  }

  private static getGlob(pathEnd: string, cond: string) {
    const path = Path.resolve(__dirname, pathEnd);
    return `${path}/*${cond}.ts`;
  }
}

Main.start();
