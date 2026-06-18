const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const createNotification = require('../utils/createNotification');

// GET /api/messages/unread-count — must be before /:conversationId
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({ receiverId: req.user.userId, read: false });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/messages/conversations — all conversations for logged-in user
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.userId })
      .populate('participants', 'fullName email')
      .sort({ lastMessageAt: -1 });
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching conversations' });
  }
});

// POST /api/messages/conversation — create or get existing conversation
router.post('/conversation', auth, async (req, res) => {
  try {
    const { receiverId, projectId } = req.body;
    const senderId = req.user.userId;

    // Check if conversation already exists between these two users
    const existing = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
      ...(projectId ? { projectId } : {}),
    });

    if (existing) return res.json(existing);

    const conversation = new Conversation({
      participants: [senderId, receiverId],
      ...(projectId ? { projectId } : {}),
    });

    await conversation.save();
    const populated = await conversation.populate('participants', 'fullName email');
    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating conversation' });
  }
});

// GET /api/messages/:conversationId — all messages in a conversation
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const isParticipant = conversation.participants.some(
      p => p.toString() === req.user.userId
    );
    if (!isParticipant) return res.status(403).json({ message: 'Not a participant' });

    // Mark messages sent to this user as read
    await Message.updateMany(
      { conversationId: req.params.conversationId, receiverId: req.user.userId, read: false },
      { read: true }
    );

    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
});

// POST /api/messages/:conversationId — send a message
router.post('/:conversationId', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const isParticipant = conversation.participants.some(
      p => p.toString() === req.user.userId
    );
    if (!isParticipant) return res.status(403).json({ message: 'Not a participant' });

    const receiverId = conversation.participants.find(
      p => p.toString() !== req.user.userId
    );

    const message = new Message({
      conversationId: req.params.conversationId,
      senderId: req.user.userId,
      receiverId,
      content: req.body.content,
    });

    await message.save();

    // Update conversation preview
    conversation.lastMessage = req.body.content;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Notify receiver — skip if there's already an unread new_message notif in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentNotif = await Notification.findOne({
      userId: receiverId,
      type: 'new_message',
      read: false,
      createdAt: { $gte: fiveMinutesAgo },
    });
    if (!recentNotif) {
      await createNotification(
        receiverId,
        'new_message',
        'New Message',
        `${req.user.fullName} sent you a message`,
        '/messages'
      );
    }

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error sending message' });
  }
});

module.exports = router;
