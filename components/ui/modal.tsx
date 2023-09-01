"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

type ModalProps = {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
};
const Modal = ({
  description,
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
