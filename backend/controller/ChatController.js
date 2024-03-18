const messages = require("../model/message");
const user = require("../model/User");
const authentication = require("../middleware/Authentication");
const message = require("../model/message");

const handleMessage = async (req, res) => {
  try {
    const { message, senderEmail, receiverEmail } = req.body;

    const sender = await user.findOne({ email: senderEmail });
    const receiver = await user.findOne({ email: receiverEmail });

    if (!sender) {
      return res.status(400).json({ message: "Sender not found" });
    }

    if (!receiver) {
      return res.status(400).json({ message: "receiver not found" });
    }

    const newMessage = new messages({
      message,
      senderEmail,
      receiverEmail,
    });

    const savedMessage = await newMessage.save();

    res.status(201).json({ savedMessage });
  } catch (error) {
    console.error("Error occurred while sending message", error);
    res.status(500).json({ error: "Error occurred while sending message" });
  }
};

const getMessage = async (req, res) => {
    try {
        const userEmail = req.user.email; 
        if (!userEmail) {
            return res.status(400).json({ message: "User email not provided" });
        } else {
            const msgs = await message.find({ $or: [{ senderEmail: userEmail }, { receiverEmail: userEmail }] });
            return res.status(200).json({ messages: msgs });
        }
    } catch (error) {
        console.error("Error occurred while getting messages", error);
        res.status(500).json({ error: "Error occurred while getting messages" });
    }
}


module.exports = { handleMessage: handleMessage , getMessage:getMessage};
