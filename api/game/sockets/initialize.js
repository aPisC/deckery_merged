async function initialize(socket) {
  socket.emitters && socket.emitters.initialize();
}
module.exports = initialize;
