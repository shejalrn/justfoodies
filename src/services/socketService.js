const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join order room for real-time updates
    socket.on('join-order', (orderNumber) => {
      socket.join(`order-${orderNumber}`);
      console.log(`Client ${socket.id} joined order room: ${orderNumber}`);
    });

    // Leave order room
    socket.on('leave-order', (orderNumber) => {
      socket.leave(`order-${orderNumber}`);
      console.log(`Client ${socket.id} left order room: ${orderNumber}`);
    });

    // Admin joins all orders room
    socket.on('join-admin', () => {
      socket.join('admin');
      console.log(`Admin ${socket.id} joined admin room`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

const emitOrderUpdate = (io, orderNumber, orderData) => {
  io.to(`order-${orderNumber}`).emit('order-update', orderData);
  io.to('admin').emit('order-update', orderData);
};

const emitNewOrder = (io, orderData) => {
  io.to('admin').emit('new-order', orderData);
};

module.exports = {
  setupSocketHandlers,
  emitOrderUpdate,
  emitNewOrder
};