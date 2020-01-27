import { request } from 'graphql-request';
// import { AddressInfo } from 'net';
// import { startServer } from '../../startServer';
import { User } from '../../entity/User';
import {
  duplicateEmail,
  emailNotLongEnouch,
  invalidEmail,
  passwordNotLongEnough
} from './errorMessages';

// let getHost = () => '';
// beforeAll(async () => {
//   const app = await startServer();
//   const { port } = app.address() as AddressInfo;
//   getHost = () => `http://127.0.0.1:${port}`;
// });

const email = 'tom@bob.com';
const password = 'aksdfhasd';

const mutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}"){
      path
      message
    }
  }
`;

describe('Register test', () => {
  it('test for duplicate email', async () => {
    const response = await request(
      process.env.TEST_HOST as string,
      mutation(email, password)
    );
    expect(response).toEqual({ register: null });

    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);

    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const response2: any = await request(
      process.env.TEST_HOST as string,
      mutation(email, password)
    );
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0]).toEqual({
      path: 'email',
      message: duplicateEmail
    });
  });

  it('Invalid and short email ', async () => {
    const response3: any = await request(
      process.env.TEST_HOST as string,
      mutation('b', password)
    );
    expect(response3).toEqual({
      register: [
        {
          path: 'email',
          message: emailNotLongEnouch
        },
        {
          path: 'email',
          message: invalidEmail
        }
      ]
    });
  });

  it('bad password length', async () => {
    const response4: any = await request(
      process.env.TEST_HOST as string,
      mutation(email, 'as')
    );
    expect(response4).toEqual({
      register: [
        {
          path: 'password',
          message: passwordNotLongEnough
        }
      ]
    });
  });

  it('bad email and password', async () => {
    const response5: any = await request(
      process.env.TEST_HOST as string,
      mutation('sd', 'as')
    );
    expect(response5).toEqual({
      register: [
        {
          path: 'email',
          message: emailNotLongEnouch
        },
        {
          path: 'email',
          message: invalidEmail
        },
        {
          path: 'password',
          message: passwordNotLongEnough
        }
      ]
    });
  });
});
