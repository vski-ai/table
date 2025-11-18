import { useEffect, useRef } from "preact/hooks";
import { Signal } from "@preact/signals";
import XIcon from "lucide-react/dist/esm/icons/x.js";

type DialogProps = {
  isOpen: Signal<boolean>;
  onClose: () => void;
  title: string;
  children: preact.ComponentChildren;
  icon?: preact.ComponentChildren;
  className?: string;
};

export const Dialog = ({
  isOpen,
  onClose,
  title,
  children,
  icon,
  className,
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen.value) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen.value]);

  const handleClose = () => {
    isOpen.value = false;
    onClose();
  };

  return (
    <dialog ref={dialogRef} class="modal modal-end">
      <div
        class={`modal-box dark:bg-gray-900 border-l-2 border-sky-600/10 rounded-none ${className}`}
      >
        <form
          class="absolute top-2 right-2"
          method="dialog"
          onSubmit={handleClose}
        >
          <button class="btn btn-xs btn-circle btn-ghost" type="submit">
            <XIcon />
          </button>
        </form>
        <h3 class="font-bold text-lg flex items-center gap-4">
          {icon}
          {title}
        </h3>
        <div class="py-4">{children}</div>
      </div>
      <form class="modal-backdrop" method="dialog" onSubmit={handleClose}>
        <button type="submit">close</button>
      </form>
    </dialog>
  );
};
