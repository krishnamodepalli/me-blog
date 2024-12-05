import { ReactNode, useEffect, useState } from "react";

import { jetbrains } from "@/app/_fonts";

interface ITopNote {
  active: boolean;
  closable?: boolean;
  children: ReactNode;
}

export const TopNoteContainer = ({ children }: { children?: ReactNode }) => {
  return <div>{children}</div>;
};

export const TopNote = ({ active, closable = true, children }: ITopNote) => {
  const [hidden, setHidden] = useState<boolean>(false);

  useEffect(() => {
    if (active) setHidden(false);
  }, [active]);

  return (
    active &&
    !hidden && (
      <div className="flex items-center bg-purple-700 px-4 transition-all duration-200">
        <p
          className={`${jetbrains.className} w-full py-1 text-center text-sm text-neutral-200`}
        >
          {children}
        </p>
        {closable && (
          <button
            onClick={() => {
              setHidden(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              width={16}
              className="fill-white"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </button>
        )}
      </div>
    )
  );
};
