

async function hello(socket, ...p) {
  socket.emitters.m2();
  console.log('got hello', p);
}



module.exports = {
  hello,
};