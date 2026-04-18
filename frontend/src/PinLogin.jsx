import React, { useRef, useState } from "react";
import "./pin.css";

const CORRECT_PIN = "1234";

const PinLogin = ({ onSuccess }) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const inputs = useRef([]);

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);
    setError(false);
    if (val && idx < 3) inputs.current[idx + 1].focus();
    if (newPin.every((d) => d !== "")) {
      setTimeout(() => checkPin(newPin.join("")), 100);
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !pin[idx] && idx > 0) {
      inputs.current[idx - 1].focus();
    }
  };

  const checkPin = (enteredPin) => {
    if (enteredPin === CORRECT_PIN) {
      onSuccess();
    } else {
      setError(true);
      setPin(["", "", "", ""]);
      setTimeout(() => inputs.current[0].focus(), 50);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon"></div>
        <h2 className="login-title">Enter PIN</h2>
        <p className="login-sub">4-digit PIN </p>
        <div className="pin-boxes">
          {pin.map((digit, idx) => (
            <input key={idx}ref={(el) => (inputs.current[idx] = el)}className={`pin-input ${error ? "pin-error" : ""}`}type="password"inputMode="numeric"maxLength={1}value={digit}onChange={(e) => handleChange(e.target.value, idx)}onKeyDown={(e) => handleKeyDown(e, idx)}autoFocus={idx === 0}/>))}
        </div>
        {error && <p className="pin-error-msg"> RightPIN!  try </p>}
      </div>
    </div>
  );
};

export default PinLogin;