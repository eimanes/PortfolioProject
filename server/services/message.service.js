import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { getReceiverSocketId, io } from "../utils/socket.js";

const sendMessageService = async (message, receiverId, senderId) => {

	if (!message || !receiverId || !senderId) {
		return {
			success: false,
			error: "Invalid parameters. Message, receiverId, and senderId are required."
		};
	}

	let conversation = await Conversation.findOne({
		participants: { $all: [senderId, receiverId] },
	});

	if (!conversation) {
		conversation = await Conversation.create({
			participants: [senderId, receiverId],
		});
	}

	const newMessage = new Message({
		senderId,
		receiverId,
		message,
	});

	if (!newMessage) {
		return {
			success: false,
			error: "Failed to create a new message."
		}
	}

	conversation.messages.push(newMessage._id);

	await Promise.all([conversation.save(), newMessage.save()]);

	// SOCKET IO FUNCTIONALITY WILL GO HERE
	const receiverSocketId = getReceiverSocketId(receiverId);
	if (receiverSocketId) {
		// io.to(<socket_id>).emit() used to send events to specific client
		io.to(receiverSocketId).emit("newMessage", newMessage);
	}

	return {
		success: true,
		message: newMessage
	}
};

const getMessagesService = async (userToChatId, senderId) => {
	if (!userToChatId || !senderId) {
		return {
			success: false,
			error: "Invalid parameters. userToChatId and senderId are required."
		};
	}
	const conversation = await Conversation.findOne({
		participants: { $all: [senderId, userToChatId] },
	}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

	if (!conversation) {
		return {
			success: true,
			messages: []
		};
	}

	const messages = conversation.messages;

	return {
		success: true,
		messages
	}

};

export { sendMessageService, getMessagesService };
