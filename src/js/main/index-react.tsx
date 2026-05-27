import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { evalTS, selectFolder } from "../lib/utils/bolt"; // Imported selectFolder utility
import "./main.scss";

export default function IndexReact() {
  const [activeTab, setActiveTab] = useState<"MAIN" | "SFX" | "GFX" | "PRESETS">("MAIN");
  const [isHoverPlayEnabled, setIsHoverPlayEnabled] = useState<boolean>(false);
  
  // Manage the selected asset path via React state
  const [currentPath, setCurrentPath] = useState<string>("Click to select a folder...");

  // --- 1. CORE SYSTEM ACTIONS ---
  
  // Opens a native OS file dialog window to pick a directory
  const handleChooseFolder = () => {
    // Starting directory default, prompt message, and callback function
    selectFolder("", "Select your Sniprr Assets Folder", (chosenFolder) => {
      if (chosenFolder) {
        setCurrentPath(chosenFolder);
        localStorage.setItem("sniprr_last_path", chosenFolder); // Remembers it when AE restarts
      }
    });
  };

  // Triggers your custom ExtendScript frame-saver script
  const handleSnapshotClick = (e: React.MouseEvent) => {
    if (currentPath.includes("Click to select")) {
      alert("Please select a valid destination folder first by clicking on the path bar.");
      return;
    }
    
    // Shift+Click changes folder, normal Click saves frame
    if (e.shiftKey) {
      handleChooseFolder();
    } else {
      // Calls your export function saveSnapshot(folderPath) inside src/jsx/index.ts
      evalTS("saveSnapshot" as any, currentPath as any).then((savedPath: any) => {
        if (savedPath && !savedPath.startsWith("ERROR")) {
          console.log("Snapshot successfully written to: " + savedPath);
        } else if (savedPath) {
          alert(savedPath);
        }
      });
    }
  };

  const handlePasteClick = (e: React.MouseEvent) => {
    // If shift key is held down, we let our backend layer know
    const isShiftHeld = e.shiftKey;
    alert(`Paste active! (Shift Held: ${isShiftHeld}). In the next step, we will hook this up to map items into your timeline.`);
  };

  // --- 2. EXPRESSIONS & UTILITIES ---
  const handleExpressionClick = (exprType: string) => {
    evalTS("applyExpression" as any, exprType as any);
  };

  const handlePurgeClick = () => {
    evalTS("purgeAllCaches" as any);
  };

  // --- 3. PERSISTENCE LAYER ---
  // Automatically loads your last used folder pathway when the panel boots up
  useEffect(() => {
    const savedPath = localStorage.getItem("sniprr_last_path");
    if (savedPath) {
      setCurrentPath(savedPath);
    }
  }, []);

  return (
    <div className="app-container">
      {/* HEADER BAR */}
      <header className="top-bar">
        <span className="app-logo-text" style={{ fontWeight: 900, color: "#fff", fontSize: "12px", letterSpacing: "1px" }}>SniprrSPACE</span>
        <div className="top-action-dock">
          <button 
            className="mini-btn" 
            onClick={handleSnapshotClick} 
            title="Click: Save Snapshot to Current Path&#10;Shift+Click: Choose Folder Location"
          >
            SNAP
          </button>
          <button 
            className="mini-btn" 
            onClick={handlePasteClick} 
            title="Click: Paste to Project Panel&#10;Shift+Click: Place on Active Timeline Track"
          >
            PASTE
          </button>
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
              {/* Clickable Info Path Bar */}
              <div 
                className="info-bar" 
                onClick={handleChooseFolder}
                style={{ fontSize: "10px", color: "#aaa", cursor: "pointer", textDecoration: "underline", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}
                title="Click here to change targeted directory folder"
              >
                {currentPath}
              </div>
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

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <IndexReact />
  </React.StrictMode>
);