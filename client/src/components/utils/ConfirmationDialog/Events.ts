import { ReactNode } from "react";

interface IShowConfirmationDialogEvent {
  message: string;
  prompt: ReactNode;
  subPrompt?: string;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
}

interface IHideConfirmationDialogEvent {
  message: string;
}

export type { IShowConfirmationDialogEvent, IHideConfirmationDialogEvent };
