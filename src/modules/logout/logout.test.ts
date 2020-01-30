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

describe("logout", () => {
  it("multiple sessions", async () => {
    // Computer 1
    const sess1 = new TestClient(process.env.TEST_HOST as string);
    // Computer 2
    const sess2 = new TestClient(process.env.TEST_HOST as string);

    await sess1.login(email, password);
    await sess2.login(email, password);
    expect(await sess1.me()).toEqual(await sess2.me());
    await sess1.logout();
    expect(await sess1.me()).toEqual(await sess2.me());
  });

  it("Single session", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    await client.login(email, password);
    const response = await client.me();

    expect(response.data).toEqual({
      me: {
        id: userId,
        email
      }
    });

    await client.logout();
    const response2 = await client.me();
    expect(response2.data.me).toBeNull();
  });
});

afterAll(async () => {
  conn.close();
});
