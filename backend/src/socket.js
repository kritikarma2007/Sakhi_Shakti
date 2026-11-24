/**
 * Socket.io Server — Doctor Matchmaking + WebRTC Signaling
 */
const { Server } = require('socket.io');

const doctorQueue = new Map();  // socketId -> socket
const userQueue = [];           // array of { socket, userId }
const rooms = new Map();        // roomId -> { doctor, user }

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // ─── Doctor joins the available pool ─────────────────────────────
    socket.on('doctor-available', (data) => {
      doctorQueue.set(socket.id, { socket, ...data });
      console.log(`[Socket] Doctor available: ${socket.id}`);
      tryMatch(io);
    });

    // ─── User joins the queue ─────────────────────────────────────────
    socket.on('join-doctor-queue', (data) => {
      userQueue.push({ socket, ...data });
      console.log(`[Socket] User in queue: ${socket.id}`);
      socket.emit('queue-position', { position: userQueue.length });
      tryMatch(io);
    });

    // ─── WebRTC Signaling ─────────────────────────────────────────────
    socket.on('webrtc-offer', ({ roomId, offer }) => {
      socket.to(roomId).emit('webrtc-offer', { offer, from: socket.id });
    });

    socket.on('webrtc-answer', ({ roomId, answer }) => {
      socket.to(roomId).emit('webrtc-answer', { answer, from: socket.id });
    });

    socket.on('webrtc-ice-candidate', ({ roomId, candidate }) => {
      socket.to(roomId).emit('webrtc-ice-candidate', { candidate, from: socket.id });
    });

    // ─── Chat ─────────────────────────────────────────────────────────
    socket.on('chat-message', ({ roomId, message, sender }) => {
      io.to(roomId).emit('chat-message', {
        message, sender,
        timestamp: new Date().toISOString()
      });
    });

    // ─── Leave Room ───────────────────────────────────────────────────
    socket.on('leave-room', ({ roomId }) => {
      socket.leave(roomId);
      socket.to(roomId).emit('peer-left', { socketId: socket.id });
      rooms.delete(roomId);
    });

    // ─── Disconnect ───────────────────────────────────────────────────
    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
      doctorQueue.delete(socket.id);
      const idx = userQueue.findIndex(u => u.socket.id === socket.id);
      if (idx !== -1) userQueue.splice(idx, 1);
      // Notify peer in room
      for (const [roomId, room] of rooms.entries()) {
        if (room.doctor === socket.id || room.user === socket.id) {
          socket.to(roomId).emit('peer-left', { socketId: socket.id });
          rooms.delete(roomId);
        }
      }
    });
  });

  function tryMatch(io) {
    while (doctorQueue.size > 0 && userQueue.length > 0) {
      const [doctorSocketId, doctorData] = doctorQueue.entries().next().value;
      doctorQueue.delete(doctorSocketId);

      const userEntry = userQueue.shift();
      const roomId = `room_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      doctorData.socket.join(roomId);
      userEntry.socket.join(roomId);

      rooms.set(roomId, { doctor: doctorSocketId, user: userEntry.socket.id });

      io.to(roomId).emit('matched-room', {
        roomId,
        message: 'Connected! You are now in a private consultation room.',
        doctorName: doctorData.name || 'SakhiShakti Doctor',
        userName: userEntry.name || 'Patient'
      });

      console.log(`[Socket] Matched room: ${roomId}`);
    }
  }

  return io;
}

module.exports = setupSocket;
