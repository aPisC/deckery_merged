module.exports = ({ env }) => ({
  settings: {
    "serve-ui": {
      enabled: true,
      path: "ui/build",
      proxy: parseInt(process.env.REACT_PORT) || null,
    },
    socketio: {
      enabled: true,
    },
  },
  load: {
    after: ["socketio", "router", "serve-ui"],
  },
});
