import { User } from "../../entity/User";
import { createTypeormConn } from "../../utils/createTypormConn";
import {
  duplicateEmail,
  emailNotLongEnouch,
  invalidEmail,
  passwordNotLongEnough
} from "./errorMessages";
import { Connection } from "typeorm";
import { TestClient } from "../../utils/TestClient";

let conn: Connection;
beforeAll(async () => {
  conn = await createTypeormConn();
});

afterAll(async () => {
  await conn.close();
});
const email = "tom@bob.com";
const password = "aksdfhasd";

describe("Register test", () => {
  it("test for duplicate email", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const response: any = await client.register(email, password);
    expect(response.data).toEqual({ register: null });

    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);

    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const response2: any = await client.register(email, password);
    expect(response2.data.register).toHaveLength(1);
    expect(response2.data.register[0]).toEqual({
      path: "email",
      message: duplicateEmail
    });
  });

  it("Invalid and short email ", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const response3: any = await client.register("kl", password);
    expect(response3.data).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnouch
        },
        {
          path: "email",
          message: invalidEmail
        }
      ]
    });
  });

  it("bad password length", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const response4: any = await client.register(email, "as");
    expect(response4.data).toEqual({
      register: [
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    });
  });

  it("bad email and password", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const response5: any = await client.register("ds", "ds");
    expect(response5.data).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnouch
        },
        {
          path: "email",
          message: invalidEmail
        },
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    });
  });
});
