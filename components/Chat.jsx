import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";

const Chat = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const loggedInUser = user?.user?._id;
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!loggedInUser) return;
    const socket = createSocketConnection();

    // Join chat room
    socket.emit("joinChat", {
      firstName: user?.user?.firstName,
      userId,
      loggedInUser,
    });

    // Listen for new messages
    socket.on("receivedMessage", ({ firstName, text }) => {
      setMessages((prev) => [...prev, { firstName, text }]);

      // Auto-scroll when new message arrives
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => socket.disconnect();
  }, [userId, loggedInUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/messages/${userId}`, {
          withCredentials: true,
        });
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      loggedInUser,
      userId,
      firstName: user?.user?.firstName,
      text: newMessage,
    });
    setNewMessage("");
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (new line)
      sendMessage();
    }
  };

  return (
    <div className="p-5 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-5 text-primary">
        Chat with a Friend
      </h1>

      {/* Messages container */}
      <div className="bg-base-200 p-4 rounded-lg h-96 overflow-y-auto mb-4 shadow-inner">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            No messages yet. Start a conversation!
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isCurrentUser =
                msg.fromUserId === loggedInUser ||
                msg.firstName === user?.user?.firstName;

              return (
                <div
                  key={index}
                  className={`chat ${
                    isCurrentUser ? "chat-end" : "chat-start"
                  } mb-2`}
                >
                  <div
                    className={`chat-bubble ${
                      isCurrentUser ? "bg-primary text-white" : "bg-base-300"
                    } shadow-sm`}
                  >
                    <div className="font-bold text-sm mb-1">
                      {msg.firstName ||
                        (isCurrentUser ? user?.user?.firstName : "Friend")}
                    </div>
                    <div className="break-words">{msg.text}</div>
                    {msg.createdAt && (
                      <div className="text-xs mt-1 opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message input */}
      <div className="flex gap-2">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="textarea textarea-bordered flex-grow focus:outline-none focus:ring-2 focus:ring-primary"
          rows="2"
        />
        <button
          onClick={sendMessage}
          className="btn btn-primary"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
};

export default Chat;
