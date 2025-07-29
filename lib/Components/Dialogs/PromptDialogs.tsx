import { useState } from "react";
import { createRoot } from "react-dom/client";
import "./Dialogs.css";

interface PromptDialogProps {
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  validator?: (value: string) => string | null;
  multiLine?: boolean;
  onResolve: (value: string | null) => void;
}

function PromptDialog({
  title,
  message,
  placeholder = "",
  defaultValue = "",
  validator,
  multiLine = false,
  onResolve,
}: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    if (validator) {
      const validationError = validator(value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    onResolve(value);
  };

  const handleCancel = () => {
    onResolve(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (multiLine) {
      // For multiline, only trigger confirm on Ctrl+Enter or Cmd+Enter
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleConfirm();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    } else {
      // For single line, Enter confirms, Escape cancels
      if (e.key === "Enter") {
        e.preventDefault();
        handleConfirm();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    }
  };

  return (
    <div className="prompt-overlay" onClick={handleCancel}>
      <div className="prompt-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="prompt-header">
          <h3>{title}</h3>
        </div>

        <div className="prompt-body">
          {message && <p className="prompt-message">{message}</p>}

          {multiLine ? (
            <textarea
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
              autoFocus
              className="prompt-textarea"
              rows={6}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
              autoFocus
              className="prompt-input"
            />
          )}

          {error && <p className="prompt-error">{error}</p>}

          {multiLine && (
            <p className="prompt-hint">
              Press Ctrl+Enter (Cmd+Enter on Mac) to confirm
            </p>
          )}
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
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

interface PromptOptions {
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  validator?: (value: string) => string | null;
  multiLine?: boolean;
}

export function promptDialog(options: PromptOptions): Promise<string | null> {
  return new Promise((resolve) => {
    // Create a container for the dialog
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    const cleanup = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    const handleResolve = (value: string | null) => {
      cleanup();
      resolve(value);
    };

    root.render(<PromptDialog {...options} onResolve={handleResolve} />);
  });
}

// Convenience function that matches browser prompt API
export function promptMessage(
  message: string,
  defaultValue?: string,
  multiLine?: boolean
): Promise<string | null> {
  return promptDialog({
    title: "Input Required",
    message,
    defaultValue,
    multiLine: multiLine ?? false,
  });
}
