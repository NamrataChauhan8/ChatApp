const { user, messages } = require("../config/Constant");

const sendMessage = async (req, res) => {
  try {
    const { message, senderId, receiverId } = req.body;
    const userId = req.user.id;
    if (userId !== req.body.senderId) {
      return res.status(400).json({ message: "Unauthorized user" });
    } else {
      const receiver = await user.findOne({ _id: receiverId });

      if (!receiver) {
        return res.status(400).json({ message: "receiver not found" });
      } else {
        const newMessage = new messages({
          message,
          senderId,
          receiverId,
        });

        const savedMessage = await newMessage.save();

        return res.status(201).json({ savedMessage });
      }
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
    const userId = req.user.id;
    const id = req.params.id;
    if (userId !== id) {
      return res.status(400).json({ message: "Unauthorized user" });
    } else {
      const msgs = await messages.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
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
    const userId = req.user.id;
    const messageId = req.params.messageId;

    const existingMessage = await messages.findById(messageId);

    if (!existingMessage) {
      return res.status(404).json({ message: "Message not found" });
    } else {

      if (existingMessage.senderId.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this message" });
      } else {
        await messages.deleteOne({ _id: messageId });
        return res
          .status(200)
          .json({ message: "Message deleted successfully" });
      }
    }
  } catch (error) {
    console.error("Error occurred while deleting message", error);
    return res
      .status(500)
      .json({ error: "Error occurred while deleting message" });
  }
};

const updateMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const messageId = req.params.messageId;

    const existingMessage = await messages.findById(messageId);

    if (!existingMessage) {
      return res.status(404).json({ message: "Message not found" });
    }else{
      if (existingMessage.senderId.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "Unauthorized to update this message" });
      } else {
        existingMessage.message = req.body.message;
        await existingMessage.save();
  
        return res.status(200).json({ message: "Message updated successfully" });
      }
    }

    
  } catch (error) {
    console.error("Error occurred while updating message", error);
    return res
      .status(500)
      .json({ error: "Error occurred while updating message" });
  }
};


const getChattedUsers = async (req, res) => {
  try {
    const userId = req.user._id; 
    console.log(userId)

    const chattedUsers = await messages.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      {
        $group: {
          _id: null,users: {
            $addToSet: {
              $cond: {
                if: { $eq: ["$senderId", userId] },
                then: "$receiverId",
                else: "$senderId",
               },
            },
          },
        },
      },
    ]);

    const userIds = chattedUsers.length > 0 ? chattedUsers[0].users : [];

    res.status(200).json({ users: userIds });
  } catch (error) {
    console.error("Error occurred while fetching chatted users", error);
    res.status(500).json({ error: "Error occurred while fetching chatted users" });
  }
};



module.exports = {
  sendMessage: sendMessage,
  getMessage: getMessage,
  deleteMessage: deleteMessage,
  updateMessage: updateMessage,
  getChattedUsers:getChattedUsers
};
