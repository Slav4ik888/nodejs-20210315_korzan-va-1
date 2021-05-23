const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

console.log(`SOCKET LOAD >>>`);

function socket(server) {
  const io = socketIO(server);
  console.log(`SOCKET 1 ...`);

  io.use(async function (socket, next) {

    console.log('socket.connected: ', socket.connected);
    // console.log('socket.disconnected: ', socket.disconnected);
    next();
  });

  io.on('connection', function (socket) {
    console.log(`SOCKET connection ...`);

    socket.on('message', async (msg) => {
      console.log(`SOCKET message ...`, msg);

    });
    
    socket.on(`disconnect`, () => {
      console.log(`disconnection...`);
    });
  });


  // socket.user = session.user; 


  return io;
}

module.exports = socket;
