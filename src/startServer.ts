import { GraphQLServer } from 'graphql-yoga';
import { redis } from './redis';
import { createTypeormConn } from './utils/createTypormConn';
import { confirmEmail } from './routes/confirmEmail';
import { genSchema } from './utils/genSchema';

export const startServer = async () => {
  const server = new GraphQLServer({
    schema: genSchema(),
    context: ({ request }) => ({
      redis,
      url: request.protocol + '://' + request.get('hos')
    })
  });

  server.express.get('/confirm/:id', confirmEmail);

  await createTypeormConn();
  const app = await server.start({
    port: process.env.NODE_ENV === 'test' ? 0 : 4000
  });
  console.log('Server is running on http://localhost:4000');

  return app;
};
