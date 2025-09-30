import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import ModalComponent from "../components/ModalComponent";

interface ModalContextProps {
  openModal: (options: {
    title?: string;
    content: ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
  }) => void;
  closeModal: () => void;
  isOpen: boolean;
}

export const ModalContext = createContext<ModalContextProps | undefined>(
  undefined
);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>(
    undefined
  );
  const [onCancel, setOnCancel] = useState<(() => void) | undefined>(undefined);
  const [confirmText, setConfirmText] = useState("Potvrdiť");
  const [cancelText, setCancelText] = useState("Zrušiť");

  const openModal = (options: {
    title?: string;
    content: ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
  }) => {
    setTitle(options.title);
    setContent(options.content);
    setOnConfirm(() => options.onConfirm);
    setOnCancel(() => options.onCancel);
    setConfirmText(options.confirmText || "Potvrdiť");
    setCancelText(options.cancelText || "Zrušiť");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    if (onCancel) onCancel();
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      <ModalComponent
        open={isOpen}
        title={title}
        onClose={closeModal}
        onConfirm={onConfirm}
        confirmText={confirmText}
        cancelText={cancelText}
      >
        {content}
      </ModalComponent>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};
