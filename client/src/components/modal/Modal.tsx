import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 ${open ? 'visible' : 'invisible'}`} // Cambié 'absolute' por 'fixed' y agregué fondo semitransparente
    >
      <div
        onClick={(e) => e.stopPropagation()} // Impide que el clic dentro del modal cierre el modal
        className={`rounded-xl p-4 transition-all ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
}
