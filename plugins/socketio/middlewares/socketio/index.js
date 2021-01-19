const IO = require("socket.io");
const loadSockets = require("./load-sockets");

module.exports = (strapi) => {
  return {
    initialize: async () => {
      console.log("Socket IO Initialization");
      const sockets = await loadSockets();
      console.log(sockets);
      strapi.io = IO(strapi.server);

      for (const namespace of Object.keys(sockets)) {
        const io = namespace ? strapi.io.of(namespace) : strapi.io;
        io.on("connection", (socket, ...p) => {
          for (const funname of Object.keys(sockets[namespace])) {
            if (funname != "connection") {
              const fn = sockets[namespace][funname];
              socket.on(funname, (...p) => {
                strapi.log.debug("Socket event", funname, ...p);
                try {
                  fn(socket, ...p);
                } catch (ex) {
                  strapi.log.error("Socket ahndling error", ex);
                }
              });
            }
          }
          if (sockets[namespace]["connection"])
            sockets[namespace]["connection"](socket, ...p);
        });
      }
    },
  };
};
