import * as fs from "fs";

export const writeLog = (file: string, data: string) => {
  console.log(`${file}: `, data);
  return new Promise((resolve, reject) => {
    fs.appendFile(`${__dirname}/../../logs/${file}.log`, `------\n${new Date().toISOString()}\n${data}\n------\n\n`, (err) => {
      if (err) {
        reject("Error during appending to log file");
      } else {
        resolve();
      }
    });
  });
};
