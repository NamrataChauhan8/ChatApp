// const messages = require("../model/message");
// const user = require("../model/User");
const {user,messages}=require("../config/Constant")


const sendMessage = async (req, res) => {
  try {
    const { message, senderEmail, receiverEmail } = req.body;
    const userEmail = req.user.email;
    if (userEmail !== req.body.senderEmail) {
      return res.status(400).json({ message: "Unauthorized user" });
    } else {
      const receiver = await user.findOne({ email: receiverEmail });

      if (!receiver) {
        return res.status(400).json({ message: "receiver not found" });
      }

      const newMessage = new messages({
        message,
        senderEmail,
        receiverEmail,
      });

      const savedMessage = await newMessage.save();

      return res.status(201).json({ savedMessage });
    }
  } catch (error) {
    console.error("Error occurred while sending message", error);
    return res
      .status(500)
      .json({ error: "Error occurred while sending message" });
  }
};


const getMessage = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userId = req.user.id;
    const email = req.params.email;
    if (userEmail !== email) {
      return res.status(400).json({ message: "Unauthorized user" });
    } else {
      const msgs = await messages.find({
        $or: [{ senderEmail: userEmail }, { receiverEmail: userEmail }],
      });
      return res.status(200).json({ messages: msgs });
    }
  } catch (error) {
    console.error("Error occurred while getting messages", error);
    return res
      .status(500)
      .json({ error: "Error occurred while getting messages" });
  }
};



const deleteMessage = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const messageId = req.params.messageId;

    const existingMessage = await messages.findById(messageId);

    if (!existingMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (existingMessage.senderEmail !== userEmail) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this message" });
    } else {
      await messages.deleteOne({ _id: messageId });
      return res.status(200).json({ message: "Message deleted successfully" });
    }
  } catch (error) {
    console.error("Error occurred while deleting message", error);
    res.status(500).json({ error: "Error occurred while deleting message" });
  }
};



const updateMessage = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const messageId = req.params.messageId;

    const existingMessage = await messages.findById(messageId);

    if (!existingMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (existingMessage.senderEmail !== userEmail) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this message" });
    }

    existingMessage.message = req.body.message;
    await existingMessage.save();

    return res.status(200).json({ message: "Message updated successfully" });
  } catch (error) {
    console.error("Error occurred while updating message", error);
    res.status(500).json({ error: "Error occurred while updating message" });
  }
};


module.exports = {
  sendMessage: sendMessage,
  getMessage: getMessage,
  deleteMessage: deleteMessage,
  updateMessage: updateMessage,
};
