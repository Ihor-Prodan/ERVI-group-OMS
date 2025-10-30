import React from "react";
import "./Loader.css";

interface LoaderProps {
  fullscreen?: boolean;
  size?: number;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ fullscreen = false, size = 48, text }) => {
  return (
    <div className={fullscreen ? "loader-overlay" : "loader-inline"}>
      <div
        className="spinner"
        style={{ width: size, height: size, borderWidth: size / 8 }}
      />
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;
