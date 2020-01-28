import * as bcrypt from 'bcryptjs';
import * as yup from 'yup';
import { ResolverMap } from '../../types/graphql-utils';
import { User } from '../../entity/User';
import { formatYupError } from '../../utils/formatYupError';
import {
  duplicateEmail,
  emailNotLongEnouch,
  invalidEmail,
  passwordNotLongEnough
} from './errorMessages';
// import { createConfirmEmailLink } from '../../utils/createConfirmEmailLink';
// import { sendEmail } from '../../utils/sendEmail';

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3, emailNotLongEnouch)
    .max(255)
    .email(invalidEmail),
  password: yup
    .string()
    .min(3, passwordNotLongEnough)
    .max(255)
});

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: GQL.IHelloOnQueryArguments) =>
      `Hello ${name || 'World|'}`
  },

  Mutation: {
    register: async (
      _,
      args: GQL.IRegisterOnMutationArguments
      // { redis, url }
    ) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }
      const { email, password } = args;
      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ['id']
      });
      if (userAlreadyExists) {
        return [
          {
            path: 'email',
            message: duplicateEmail
          }
        ];
      }
      try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = User.create({
          email,
          password: hashedPassword
        });

        await user.save();
        // TODO: to send email
        // if (process.env.NODE_ENV !== 'test') {
        //   await sendEmail(
        //     email,
        //     await createConfirmEmailLink(url, user.id, redis)
        //   );
        // }
        // await createConfirmEmailLink(url, user.id, redis)
      } catch (err) {
        console.log(err);
      }
      return null;
    }
  }
};
