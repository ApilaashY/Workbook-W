import { Toolbar } from "../Toolbar/Toolbar";
import "./Settings.css";

export function Settings() {
    return <div className="main-window">
        <Toolbar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: "1" }}>
            <div className="settings-list">
                {/* Settings Go Here */}
            </div>
        </div>
    </div>
}