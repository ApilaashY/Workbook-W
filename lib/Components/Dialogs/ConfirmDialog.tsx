import { createRoot } from "react-dom/client";
import "./Dialogs.css";

interface ConfirmDialogProps {
  title: string;
  body: string;
  onResolve: (value: boolean) => void;
}

function ConfirmDialog({ title, body, onResolve }: ConfirmDialogProps) {
  const handleConfirm = () => {
    onResolve(true);
  };

  const handleCancel = () => {
    onResolve(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <div
      className="prompt-overlay"
      onClick={handleCancel}
      onKeyDown={handleKeyDown}
    >
      <div className="prompt-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="prompt-header">
          <h3>{title}</h3>
        </div>

        <div className="prompt-body">
          <p>{body}</p>
        </div>

        <div className="prompt-footer">
          <button
            onClick={handleCancel}
            className="prompt-btn prompt-btn-cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="prompt-btn prompt-btn-confirm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export function confirmDialog(title: string, body: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Create a container for the dialog
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    const cleanup = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    const handleResolve = (value: boolean) => {
      cleanup();
      resolve(value);
    };

    root.render(
      <ConfirmDialog title={title} body={body} onResolve={handleResolve} />
    );
  });
}

// Convenience function that matches browser prompt API
export function confirmMessage(title: string, body: string): Promise<boolean> {
  return confirmDialog(title, body);
}
