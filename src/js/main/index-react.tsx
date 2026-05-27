import React, { useState } from "react";
import { evalTS } from "../lib/utils/bolt"; 

export default function IndexReact() {
  const [activeTab, setActiveTab] = useState<"MAIN" | "SFX" | "GFX" | "PRESETS">("MAIN");
  const [isHoverPlayEnabled, setIsHoverPlayEnabled] = useState<boolean>(false);
  const [currentPath] = useState<string>("Select a folder...");

  const handleExpressionClick = (exprType: string) => {
    evalTS("applyExpression", exprType);
  };

  const handlePurgeClick = () => {
    evalTS("purgeAllCaches");
  };

  return (
    <div className="app-container">
      {/* HEADER BAR */}
      <header className="top-bar">
        <span className="app-logo-text" style={{ fontWeight: 900, color: "#fff", fontSize: "12px", letterSpacing: "1px" }}>SniprrSPACE</span>
        <div className="top-action-dock">
          <button className="mini-btn" id="btnSnap" title="Save Snapshot">SNAP</button>
          <button className="mini-btn" id="btnPaste" title="Paste to Project">PASTE</button>
          <button className="mini-btn" onClick={handlePurgeClick} title="Purge All Memory & Disk Cache">PRG</button>
        </div>
      </header>

      {/* TABS */}
      <nav className="tab-navigation-bar" style={{ display: "flex", gap: "2px", marginTop: "10px" }}>
        {(["MAIN", "SFX", "GFX", "PRESETS"] as const).map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* VIEWS */}
      <div className="content-area" style={{ marginTop: "10px" }}>
        {activeTab === "MAIN" && (
          <div id="toolsView">
            <div style={{ margin: "10px 0 5px 0" }}>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "#7f00ff", letterSpacing: "1px", textTransform: "uppercase" }}>
                Expressions
              </span>
            </div>
            
            <div className="compact-grid" style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
              <button className="tool-btn" onClick={() => handleExpressionClick("bounce")} title="Elastic Overshoot">BNC</button>
              <button className="tool-btn" onClick={() => handleExpressionClick("wiggle")} title="Wiggle(2, 20)">WIGL</button>
              <button className="tool-btn" onClick={() => handleExpressionClick("loop")} title="Loop Out Cycle">LOOP</button>
              <button className="tool-btn" onClick={() => handleExpressionClick("spin")} title="Continuous Rotation">SPIN</button>
            </div>
            
            <div className="compact-grid" style={{ display: "flex", gap: "4px" }}>
              <button className="tool-btn" onClick={() => handleExpressionClick("timer")} title="Stopwatch Timer">TMR</button>
              <button className="tool-btn" onClick={() => handleExpressionClick("counter")} title="Animated Number Counter">NUM</button>
              <button className="tool-btn" onClick={() => handleExpressionClick("trail")} title="Follow Layer Above">TRL</button>
              <button className="tool-btn" onClick={() => handleExpressionClick("strobe")} title="Strobe Flicker">STRB</button>
            </div>
          </div>
        )}

        {activeTab !== "MAIN" && (
          <div id="browserView">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="info-bar" style={{ fontSize: "10px", color: "#aaa" }}>{currentPath}</div>
              {activeTab === "SFX" && (
                <button 
                  className={`tool-btn ${isHoverPlayEnabled ? "active-toggle" : ""}`}
                  style={{ fontSize: "9px", padding: "2px 6px" }}
                  onClick={() => setIsHoverPlayEnabled(!isHoverPlayEnabled)}
                >
                  HOVER: {isHoverPlayEnabled ? "ON" : "OFF"}
                </button>
              )}
            </div>
            <div style={{ fontSize: "11px", color: "#666", textAlign: "center", marginTop: "30px" }}>
              {activeTab} Asset Stream Grid
            </div>
          </div>
        )}
      </div>
    </div>
  );
}