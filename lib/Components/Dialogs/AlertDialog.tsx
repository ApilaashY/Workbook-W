import { createRoot } from "react-dom/client";
import "./Dialogs.css";

interface PromptDialogProps {
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  validator?: (value: string) => string | null;
  multiLine?: boolean;
  onResolve: (value: null) => void;
}

function AlertDialog({ title, message, onResolve }: PromptDialogProps) {
  const handleCancel = () => {
    onResolve(null);
  };

  return (
    <div className="prompt-overlay" onClick={handleCancel}>
      <div className="prompt-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="prompt-header">
          <h3>{title}</h3>
        </div>

        <div className="prompt-body">
          {message && <p className="prompt-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

interface AlertOptions {
  title: string;
  message?: string;
}

export function alertDialog(options: AlertOptions): Promise<null> {
  return new Promise((resolve) => {
    // Create a container for the dialog
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    const cleanup = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    const handleResolve = (value: null) => {
      cleanup();
      resolve(value);
    };

    root.render(<AlertDialog {...options} onResolve={handleResolve} />);
  });
}

// Convenience function that matches browser alert API
export function alertMessage(title: string, message: string): Promise<null> {
  return alertDialog({
    title,
    message,
  });
}
