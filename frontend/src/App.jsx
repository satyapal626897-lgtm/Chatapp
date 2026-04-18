import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import PinLogin from "./PinLogin";
import "./Ho.css";

const socket = io("http://localhost:8000");

const getTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [chat, setChat] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const typingTimer = useRef(null);
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);

  const sendMessage = (user, msg) => {
    if (msg.trim() === "") return;
    socket.emit("send_message", { message: msg, userId: user, time: getTime() });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
      setTimeout(() => {
        box1Ref.current?.scrollTo({ top: 9999, behavior: "smooth" });
        box2Ref.current?.scrollTo({ top: 9999, behavior: "smooth" });
      }, 50);
    });

    socket.on("typing", (user) => {
      setTypingUser(user);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setTypingUser(""), 1500);
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
    };
  }, []);

  const handleTyping = (user, setter, value) => {
    setter(value);
    socket.emit("typing", user);
  };

  if (!loggedIn) return <PinLogin onSuccess={() => setLoggedIn(true)} />;

  return (
    <div className="main-container">
      <h1>Chat App</h1>
      <div className="chat-wrapper">

        <div className="chat-card">
          <div className="chat-header">
            <div className="avatar avatar-1">S</div>
            <span className="header-name">Satya</span>
            <div className="online-dot"></div>
          </div>
          <div className="chat-box" ref={box1Ref}>
            {chat.map((msg, i) => (
              <div key={i} className={`msg-group ${msg.userId === "satya" ? "mine" : "theirs"}`}>
                <div className={`message ${msg.userId === "satya" ? "my-msg" : "other-msg"}`}>
                  {msg.message}
                </div>
                <span className="msg-time">{msg.time}</span>
              </div>
            ))}
            <div className="typing-indicator" style={{ visibility: typingUser === "vikash" ? "visible" : "hidden" }}>
              <div className="typing-dots"><span/><span/><span/></div>
              <span className="typing-text">Vikash typing...</span>
            </div>
          </div>
          <div className="input-area">
            <input
              type="text"
              value={message1}
              onChange={(e) => handleTyping("satya", setMessage1, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { sendMessage("satya", message1); setMessage1(""); }}}
              placeholder="Satya ka message..."
            />
            <button onClick={() => { sendMessage("satya", message1); setMessage1(""); }}>
              <i className="fa-regular fa-paper-plane"></i>
            </button>
          </div>
        </div>

        <div className="chat-card">
          <div className="chat-header">
            <div className="avatar avatar-2">V</div>
            <span className="header-name">Vikash</span>
            <div className="online-dot"></div>
          </div>
          <div className="chat-box" ref={box2Ref}>
            {chat.map((msg, i) => (
              <div key={i} className={`msg-group ${msg.userId === "vikash" ? "mine" : "theirs"}`}>
                <div className={`message ${msg.userId === "vikash" ? "my-msg" : "other-msg"}`}>
                  {msg.message}
                </div>
                <span className="msg-time">{msg.time}</span>
              </div>
            ))}
            <div className="typing-indicator" style={{ visibility: typingUser === "satya" ? "visible" : "hidden" }}>
              <div className="typing-dots"><span/><span/><span/></div>
              <span className="typing-text">Satya typing...</span>
            </div>
          </div>
          <div className="input-area">
            <input
              type="text"
              value={message2}
              onChange={(e) => handleTyping("vikash", setMessage2, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { sendMessage("vikash", message2); setMessage2(""); }}}
              placeholder="Vikash ka message..."
            />
            <button onClick={() => { sendMessage("vikash", message2); setMessage2(""); }}>
              <i className="fa-regular fa-paper-plane"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;