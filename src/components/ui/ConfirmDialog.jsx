import * as React from 'react';
import { Modal, ModalHeader, ModalContent, ModalFooter } from './Modal';
import { Button } from './Button';
import { HiExclamation } from 'react-icons/hi';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed with this action? This operation cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <ModalHeader title={title} onClose={onClose} />
      <ModalContent className="flex gap-3.5 pt-2">
        <div className="shrink-0 w-9 h-9 rounded-full bg-status-danger/10 text-status-danger flex items-center justify-center">
          <HiExclamation className="w-5 h-5" />
        </div>
        <div className="text-xs text-foreground-secondary leading-relaxed pt-1">
          {description}
        </div>
      </ModalContent>
      <ModalFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          type="button"
          variant={variant === 'danger' || variant === 'destructive' ? 'destructive' : 'default'}
          size="sm"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { ConfirmDialog };
