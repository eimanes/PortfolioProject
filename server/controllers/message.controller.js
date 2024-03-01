import {
    sendMessageService,
    getMessagesService
} from '../services/message.service.js';

const sendMessageController = async (req, res) => {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.userId;

	try {
		const result = await sendMessageService(message, receiverId, senderId);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getMessagesController = async (req, res) => {
    const { id: userToChatId } = req.params;
	const senderId = req.user.userId;

	try {
		const result = await getMessagesService(userToChatId, senderId);

		if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export {sendMessageController, getMessagesController};
