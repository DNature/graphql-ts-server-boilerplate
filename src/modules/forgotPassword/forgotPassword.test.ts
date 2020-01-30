import { User } from "../../entity/User";
import { Connection } from "typeorm";
import { createTypeormConn } from "../../utils/createTypormConn";
import { TestClient } from "../../utils/TestClient";

let conn: Connection;

let userId = "";
const email = "bob5@bob.com";
const password = "jlkajoioiqwe";

beforeAll(async () => {
  conn = await createTypeormConn();
  const user = await User.create({
    email,
    password,
    confirmed: true
  }).save();
  userId = user.id;
});

describe("forgot password", () => {
  it("make sure it works", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
  });
});

afterAll(async () => {
  conn.close();
});
