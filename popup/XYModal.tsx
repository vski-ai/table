import { JSX } from "preact/jsx-runtime";
import { useEffect, useRef, useState } from "preact/hooks";
import { Signal, useSignal } from "@preact/signals";
import CloseIcon from "lucide-react/dist/esm/icons/circle-x.js";

export interface XYModalProps {
  target: string;
  openSignal: Signal<boolean>;
  children: JSX.Element | JSX.Element[];
}

// Places itself contained or around a target element
export const XYModal = ({ target, openSignal, children }: XYModalProps) => {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const topPosition = useSignal(0);
  const leftPosition = useSignal(0);
  const boxWidth = useSignal(0);

  const focused = useSignal(false);

  const onBlur = () => {
    if (focused.value) {
      focused.value = false;
      return;
    }
    openSignal.value = false;
  };

  const keepFocus = () => {
    focused.value = true;
    modalRef.current?.focus();
  };
  useEffect(() => {
    if (!target) return;

    function allign() {
      if (!modalRef.current) {
        return console.error(modalRef.current, "element is not in dom");
      }
      modalRef.current?.removeEventListener("blur", onBlur);
      modalRef.current?.addEventListener("blur", onBlur);
      modalRef.current?.removeEventListener("mousedown", keepFocus);
      modalRef.current.addEventListener("mousedown", keepFocus);
      modalRef.current?.focus();

      const el = document.querySelector(target);
      if (!el) return console.error(target, "element is not in dom");
      const { top, left, width } = el.getBoundingClientRect();
      topPosition.value = top;
      leftPosition.value = left;
      boxWidth.value = width;
    }

    setTimeout(allign);
    const listener = () => allign();

    document.addEventListener("click", listener);
    document.addEventListener("resize", listener);
    document.addEventListener("mousemove", listener);

    setMounted(true);
    return () => {
      modalRef.current?.removeEventListener("blur", onBlur);
      modalRef.current?.removeEventListener("mousedown", keepFocus);

      document.removeEventListener("click", listener);
      document.removeEventListener("resize", listener);
      document.removeEventListener("mousemove", listener);
    };
  }, [target]);

  if (!(mounted && openSignal.value)) return null;

  return (
    <div className="modal modal-open bg-transparent pointer-events-none">
      <div
        style={{
          width: boxWidth.value - 12,
          top: topPosition.value + 64 + 12,
          left: leftPosition.value + 6,
        }}
        tabIndex={0}
        ref={modalRef}
        className="modal-box p-0 bg-base-300 min-w-76 max-w-full absolute pointer-events-auto"
      >
        <a
          onClick={() => {
            openSignal.value = false;
          }}
          role="button"
          aria-label="Close"
          title="Close"
          class="btn-xs p-0 text-base-100 absolute top-2 right-2"
        >
          <CloseIcon />
        </a>
        {children}
      </div>
    </div>
  );
};
