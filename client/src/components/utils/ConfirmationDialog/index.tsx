"use client";

import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";
import ReactFocusLock from "react-focus-lock";
import { IShowConfirmationDialogEvent } from "./Events";

interface IConfirmationDialog {
  /** It is already wrapped inside a h2
   * Directly provide the string or You can directly style it👍 */
  prompt: ReactNode;
  subPrompt?: string;
  theme?: "danger" | "warn";
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  closeModal: () => void;
}

interface IConfirmationDialogData {
  /** It is already wrapped inside a h2
   * Directly provide the string or You can directly style it👍 */
  prompt: ReactNode;
  subPrompt?: string;
  theme?: "danger" | "warn";
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const CDCanvas: FC = () => {
  const [data, setData] = useState<IConfirmationDialogData>({
    prompt: "",
  });
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    const handleShowCD = (e: CustomEvent<IShowConfirmationDialogEvent>) => {
      setActive(true);
      setData(e.detail as IConfirmationDialogData);
    };
    const handleHideCD = () => {
      setActive(false);
    };

    window.addEventListener(
      "showConfirmationDialog",
      handleShowCD as EventListener,
    );
    window.addEventListener(
      "hideConfirmationDialog",
      handleHideCD as EventListener,
    );

    return () => {
      window.removeEventListener(
        "showConfirmationDialog",
        handleShowCD as EventListener,
      );
      window.removeEventListener(
        "hideConfirmationDialog",
        handleHideCD as EventListener,
      );
    };
  }, []);

  return (
    <div
      id="ynCanvas"
      className={`fixed inset-0 flex h-screen items-center justify-center overflow-hidden bg-[#1115] backdrop-blur-sm ${active ? "" : "z-[-4]"}`}
    >
      {active && (
        <ConfirmationDialog {...data} closeModal={() => setActive(false)} />
      )}
    </div>
  );
};

export const fireConfirmationDialog = (data: IConfirmationDialogData): void => {
  const myEvent = new CustomEvent<IShowConfirmationDialogEvent>(
    "showConfirmationDialog",
    {
      detail: {
        message: "Event to delete a draft.",
        ...data,
      },
    },
  );

  window.dispatchEvent(myEvent);
};

const ConfirmationDialog: FC<IConfirmationDialog> = ({
  prompt,
  subPrompt,
  theme,
  confirmLabel = "yes",
  cancelLabel = "no",
  onConfirm,
  onCancel,
  closeModal,
}) => {
  const handleConfirm = useCallback(() => {
    if (onConfirm) onConfirm();
    closeModal();
  }, [onConfirm, closeModal]);
  const handleCancel = useCallback(() => {
    if (onCancel) onCancel();
    closeModal();
  }, [onCancel, closeModal]);

  const themedButtonStyles =
    theme === "danger"
      ? "focus:bg-rose-500 transition-all duration-200 bg-transparent border border-rose-500 hover:border-transparent focus:border-transparent text-t2 border-t2 hover:text-t1 focus:text-t1 hover:bg-rose-500 outline-rose-500"
      : "bg-amber-400";

  return (
    <div role="modal" className="min-h-[200px] w-[500px] rounded-2xl bg-bg2">
      <div className="flex justify-end p-2">
        <button
          tabIndex={-1}
          className="rounded-md bg-transparent p-1 px-[6px] hover:bg-[#eee3]"
          onClick={closeModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            width={18}
            className="fill-t2 hover:fill-t1"
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      </div>
      <ReactFocusLock>
        <div className="mb-6 px-6 text-t3">
          <h2 className="mb-4 text-wrap text-xl font-semibold tracking-wider text-t2">
            {prompt}
          </h2>
          <p className="mb-4 tracking-wider">{subPrompt}</p>
          <div className="mt-6 flex justify-end">
            <div className="flex w-fit justify-end gap-4 text-lg font-semibold">
              <button
                className={`hove1 outline-0; -t1 min-w-[100px] rounded-md bg-t2 p-3 py-1 text-bg1 outline-offset-1 hover:bg-t1 focus:outline-1`}
                onClick={handleCancel}
              >
                {cancelLabel}
              </button>
              <button
                className={`${themedButtonStyles} min-w-[100px] rounded-md p-3 py-1 outline-none outline-0 outline-offset-2 focus:outline-1`}
                onClick={handleConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </ReactFocusLock>
    </div>
  );
};

export default ConfirmationDialog;
