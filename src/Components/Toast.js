import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let toastClass = 'toast-success';

        if (toast.type === 'danger' || toast.type === 'error') {
          Icon = AlertCircle;
          toastClass = 'toast-danger';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          toastClass = 'toast-warning';
        } else if (toast.type === 'info') {
          Icon = Info;
          toastClass = 'toast-info';
        }

        return (
          <div key={toast.id} className={`toast-item ${toastClass}`}>
            <Icon size={18} />
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="btn btn-link p-0 text-current opacity-75"
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'inherit' }}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
