import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { io } from "socket.io-client";
const socket = io('http://localhost:8000');
const socket = io(import.meta.env.VITE_API_URL);
import "./Ho.css"

const App = () => {
   const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [dark, setDark] = useState(true);

  const sendMessage = () => {

    socket.emit("send_message", { message });

    // ❌ OLD
    // setChat((prev) => [...prev, {message}])

    // ✅ NEW (self add kiya)
    setChat((prev) => [...prev, { message, self: true }])

    setMessage("");
  }

  useEffect(() => {
    const handleMessage = (data) => {

      // ❌ OLD
      // setChat((prev) => [...prev, data])

      // ✅ NEW (self false for other user)
      setChat((prev) => [...prev, { ...data, self: false }])
    };

    socket.on('receive_message', handleMessage);

    return () => {
      socket.off('receive_message', handleMessage);
    };
  }, []);

  const toggleTheme = () => {
  setDark(!dark);
};

  // const [message, setMessage] = useState("");
  // const [chat, setChat] = useState([]);

  // const sendMessage = () => {

  //   socket.emit("send_message", { message });
  //   setChat((prev) => [...prev, {message}])
  //   setMessage("");

  // }
  
  // useEffect(() => {
  //   const handleMessage = (data) => {
  //     setChat((prev) => [...prev, data])
  //   };
    
  //   socket.on('receive_message', handleMessage);
    
  //   return () => {
  //     socket.off('receive_message', handleMessage);
  //   };
  // }, []);
  
  // useEffect(() => {
  //   socket.on('receive_message', (data) => {
  //     setChat((prev) => [...prev, data])
  //   })
  // }, [])
  return (
    <>

  <div className={`app ${dark ? "dark" : "light"}`}>

      <h1 className="title">wellcome my chat app</h1>

      <button className="theme-btn" onClick={toggleTheme}>
        {dark ? "☀️" : "🌙"}
      </button>

      <div className="chat-container">

    <div className="chat-box">
      {chat.map((msg) => (
        <div className={`chat-message ${msg.self ? "right" : "left"}`}>
          <p>{msg.message}</p>
        </div>
      ))}
    </div>

    <div className="chat-input">
      <input
        type='text'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>

  </div>

</div>

      {/* <h1>wellcome my chat app</h1>


      <input type='text' value={message} onChange={(e) => { setMessage(e.target.value) }} />
      <button onClick={sendMessage}>send</button>

      <div>



        {chat.map((msg)=>(

        <tr>
          <p>{msg.message}</p>
        </tr>
  ))}
      </div> */}


    </>
  )
}

export default App;