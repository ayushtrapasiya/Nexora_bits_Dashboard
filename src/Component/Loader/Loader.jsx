import React, { useEffect, useState } from 'react';
import './Loader.css';
import { useAppContext } from '../../Context/AppContext';

export default function Loader({ loading = false, text = "Loading...", fullScreen = false }) {
  const [visible, setVisible] = useState(loading);

  useEffect(() => {
    setVisible(loading);
  }, [loading]);

  if (!visible) return null;

  return (
    <div className={`modaloverlay ${fullScreen ? "fullscreen" : ""}`}>
      <div className="loader">
        {/* <div className="box">🍎</div> */}
        {/* <div className="box">🥛</div> */}
        {/* <div className="box">🍞</div> */}
        {/* <div className="box">🥔</div> */}
        {/* <div className="box">🥕</div> */}
        <div className="box">🍫</div>
        <div className="box">🍔</div>
        <div className="box">🍕</div>
        <div className="box">🍟</div>
        <div className="box">🍩</div>
        {/* <div className="box">🍪</div> */}
        {/* <div className="box">🍦</div> */}
        <div className="box">🍿</div>
        {/* <div className="box">🍗</div> */}
        {/* <div className="box">🍣</div> */}
      </div>
    <p className="loading-text">
  {"Loading...".split("").map((ch, i) => (
    <span key={i} style={{ animationDelay: `${i * 0.15}s` }}>
      {ch}
    </span>
  ))}
</p>
    </div>

  );
}
