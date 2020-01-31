import { createConnection, getConnectionOptions } from "typeorm";

export const createTypeormConn = async (resetDB: boolean = false) => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return await createConnection({
    ...connectionOptions,
    name: "default",
    synchronize: resetDB,
    dropSchema: resetDB
  });
};
