const path = require("path");
const dir = process.cwd();

module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "7fd9ae1adf6ef945043fee3d315ed0c9"),
    },
    watchIgnoreFiles: [path.join(dir, "ui/**")],
  },
  url: env("SITE_URL", "localhost"),
});
