import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import * as path from 'path';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import { readdirSync } from 'fs';

import { redis } from './redis';
import { createTypeormConn } from './utils/createTypormConn';
import { confirmEmail } from './routes/confirmEmail';

export const startServer = async () => {
  const schemas: GraphQLSchema[] = [];
  const folders = readdirSync(path.join(__dirname, './modules'));
  folders.forEach(folder => {
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    const typeDefs = importSchema(
      path.join(__dirname, `./modules/${folder}/schema.graphql`)
    );
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  });

  const server = new GraphQLServer({
    schema: mergeSchemas({ schemas }),
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
