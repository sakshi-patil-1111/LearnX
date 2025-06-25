import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8080";

const Chat = ({ courseId, userId, userName, userRole }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { withCredentials: true });
    socketRef.current.emit("joinCourseChat", courseId);
    socketRef.current.emit("fetchMessages", courseId);

    socketRef.current.on("chatHistory", (msgs) => {
      setMessages(msgs);
    });
    socketRef.current.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socketRef.current.on("error", (err) => {
      alert(err.message);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [courseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socketRef.current.emit("sendMessage", {
      courseId,
      senderId: userId,
      senderRole: userRole,
      message: input,
    });
    setInput("");
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 max-w-2xl mx-auto shadow-lg">
      <h3 className="text-xl font-bold text-indigo-400 mb-4">Course Chat</h3>
      <div className="max-h-80 overflow-y-auto mb-4 bg-gray-800 p-4 rounded-lg space-y-2">
        {messages.map((msg) => {
          const isOwn = msg.senderId?._id === userId;
          return (
            <div
              key={msg._id}
              className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs break-words shadow-md text-sm font-medium ${
                  isOwn
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-gray-700 text-indigo-200 rounded-bl-none"
                }`}
              >
                <span className="block text-xs font-semibold mb-1 text-indigo-200/80">
                  {msg.senderId?.name || userName} ({msg.senderRole})
                </span>
                <span>{msg.message}</span>
              </div>
              <span className="text-xs text-gray-400 mt-1">
                {new Date(msg.timestamp).toLocaleString()}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
