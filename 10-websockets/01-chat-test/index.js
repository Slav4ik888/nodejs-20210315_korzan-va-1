const app = require('./app');
const { Server } = require('http');
const server = new Server(app.callback());

// const socket = require('./socket');

const io = require('socket.io')(server);

io.on(`connection`, socket => {
  console.log(`a user connected`);

  socket.on(`disconnect`, () => {
    console.log(`disconnection...`);
  });

  socket.on(`message`, msg => {
    console.log(`Message: `, msg);
    io.emit(`chat message`, msg);
    // socket.broadcast.emit(`hi`); 

  })

});

server.listen(3000, () => {
  console.log('App is running on http://localhost:3000');
});


// socket(server);
