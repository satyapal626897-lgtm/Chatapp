import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Ho.css";

const socket = io("http://localhost:8000");

const App = () => {
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [chat, setChat] = useState([]);
  const [typingUser, setTypingUser] = useState(""); // ✅ NEW

  // send message
  const sendMessage = (user, msg) => {
    if (msg.trim() === "") return;

    socket.emit("send_message", { message: msg, userId: user });
  };

  useEffect(() => {
    const receiveHandler = (data) => {
      setChat((prev) => [...prev, data]);
    };

    // ✅ typing receive
    const typingHandler = (user) => {
      setTypingUser(user);

      setTimeout(() => {
        setTypingUser("");
      }, 1500);
    };

    socket.on("receive_message", receiveHandler);
    socket.on("typing", typingHandler); // ✅ NEW

    return () => {
      socket.off("receive_message", receiveHandler);
      socket.off("typing", typingHandler); // ✅ NEW
    };
  }, []);

  return (
    <div className="main-container">
      <h1>💬 Chat App</h1>

      <div className="chat-wrapper">
        
        {/* USER 1 */}
        <div className="chat-card">
          <div className="header">User 1</div>

          <div className="chat-box">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.userId === "user1"
                    ? "message my-msg"
                    : "message other-msg"
                }
              >
                {msg.message}
              </div>
            ))}

            {/* ✅ typing show */}
            {typingUser === "user2" && (
              <p className="typing">User2 typing...</p>
            )}
          </div>

          <div className="input-area">
            <input
              type="text"
              value={message1}
              onChange={(e) => {
                setMessage1(e.target.value);
                socket.emit("typing", "user1"); // ✅ NEW
              }}
              placeholder="User1 message..."
            />
            <button
              onClick={() => {
                sendMessage("user1", message1);
                setMessage1("");
              }}
            >
              <i className="fa-regular fa-paper-plane"></i>
            </button>
          </div>
        </div>

        {/* USER 2 */}
        <div className="chat-card">
          <div className="header">User 2</div>

          <div className="chat-box">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.userId === "user2"
                    ? "message my-msg"
                    : "message other-msg"
                }
              >
                {msg.message}
              </div>
            ))}

            {/* ✅ typing show */}
            {typingUser === "user1" && (
              <p className="typing">User1 typing...</p>
            )}
          </div>

          <div className="input-area">
            <input
              type="text"
              value={message2}
              onChange={(e) => {
                setMessage2(e.target.value);
                socket.emit("typing", "user2"); // ✅ NEW
              }}
              placeholder="User2 message..."
            />
            <button
              onClick={() => {
                sendMessage("user2", message2);
                setMessage2("");
              }}
            >
              <i className="fa-regular fa-paper-plane"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;