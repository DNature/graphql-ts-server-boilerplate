import * as SparkPost from 'sparkpost';

const client = new SparkPost(process.env.SPARKPOST_API_KEY);

export const sendEmail = async (recipient: string, url: string) => {
  await client.transmissions.send({
    options: {
      sandbox: true
    },
    content: {
      from: 'divinehycenth8@gmail.com',
      subject: 'Hello World bro',
      html: `
            <html>
            <body>
            <p>Testing sparkpost API</p>
            <a href="${url}">confirm email</a>
            </body>
            </html>
            `
    },
    recipients: [{ address: recipient }]
  });
};
