import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

export default () => ({
  server_port: process.env.SERVER_PORT,
  global_prefix : process.env.GLOBAL_PREFIX,
  backend_url : process.env.BACKEND_URL,
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [process.env.DB_ENTITIES],
    synchronize: false,
    autoLoadEntities: true,
    sid: "ORCL",
    poolMax: process.env.POOL_MAX,  // Maximum number of connections
    poolMin: process.env.POOL_MIN,   // Minimum number of connections
    poolIncrement: process.env.POOL_INCREMENT, // Number of connections to be added if needed
    poolTimeout: process.env.POOL_TIMEOUT,  // Timeout for idle connections
    queueMax: process.env.QUEUE_MAX,  // Maximum number of queued connection requests
  },
  mailConfig: {
    transport: {
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME, // generated ethereal user
        pass: process.env.MAIL_PASSWORD
      },
    },
    defaults: {
      from: '"nest-modules" <modules@nestjs.com>',
    },
    template: {
      dir: join(__dirname, 'common/helpers/mail/templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  },
});

// export const mailConfig = {
//   host: 'smtp.gmail.com',
//   username: 'a77623802@gmail.com',
//   password: 'kqroammikghfheqq',
// };

// export const basicConfig = {
//   DB_TYPE: 'mysql',
//   DB_PORT: 3306,
//   DB_HOST: '127.0.0.1',
//   DB_USER: 'root',
//   DB_PASSWORD: '',
//   DB_NAME: 'edi-submitter',
//   SERVER_PORT: 3000,
// };

