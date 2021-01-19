module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "mysql",
        host: env("DB_PORT_3306_TCP_ADDR", "localhost"),
        port: env.int("DB_PORT_3306_TCP_PORT", 3306),
        database: env("DB_ENV_MYSQL_DATABASE", "strapi"),
        username: env("DB_ENV_MYSQL_USER", "root"),
        password: env("DB_ENV_MYSQL_PASSWORD", "strapi"),
      },
      options: {
        // useNullAsDefault: true,
      },
    },
  },
});
