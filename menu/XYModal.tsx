import { JSX } from "preact/jsx-runtime";
import { useEffect, useRef, useState } from "preact/hooks";
import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import CloseIcon from "lucide-react/dist/esm/icons/circle-x.js";

export interface XYModalProps {
  target: string;
  openSignal: Signal<boolean>;
  children: JSX.Element | JSX.Element[];
  margins?: Partial<Record<"top" | "x", number>>;
}

/**
 * This modal places itself in bounds of a target element.
 *
 * @nesterow:
 *   In this project you'll often see that sometimes I use a modal
 *   instead of a popup (modal styled as popup).
 *   The reason being that when dealing with tables it's safer
 *   to get rid of a scroll (or control it programmatically) when user
 *   setups columns, grouping and other things that would grow space or change format.
 */
export const XYModal = ({
  target,
  openSignal,
  children,
  margins = {
    x: 6,
    top: 12,
  },
}: XYModalProps) => {
  const margin = {
    ...{
      x: 6,
      top: 12,
    },
    ...margins,
  };

  const modalRef = useRef<HTMLDivElement>(null);
  const topPosition = useSignal(0);
  const leftPosition = useSignal(0);
  const boxWidth = useSignal(0);

  const onBlur = () => {
    openSignal.value = false;
  };

  const clickOutside = (ev: MouseEvent) => {
    if (
      !modalRef.current || modalRef.current?.contains(ev.target as Node) ||
      !openSignal.value
    ) return;
    openSignal.value = false;
  };

  function allign() {
    if (!modalRef.current) {
      return;
    }

    const el = document.querySelector(target);
    if (!el) return;
    const { top, left, width } = el.getBoundingClientRect();
    topPosition.value = top;
    leftPosition.value = left;
    boxWidth.value = width;
  }

  useEffect(() => {
    if (openSignal.value) {
      setTimeout(allign);
      document.addEventListener("click", clickOutside);
      document.addEventListener("resize", allign);
      modalRef.current?.addEventListener("blur", onBlur);
    } else {
      document.removeEventListener("click", clickOutside);
      document.removeEventListener("resize", allign);
      modalRef.current?.removeEventListener("blur", onBlur);
    }
    return () => {
      document.removeEventListener("click", clickOutside);
      document.removeEventListener("resize", allign);
      modalRef.current?.removeEventListener("blur", onBlur);
    };
  }, [openSignal.value, modalRef.current]);

  if (!(openSignal.value)) return null;

  return (
    <div className="modal modal-open bg-transparent pointer-events-none">
      <div
        style={{
          width: boxWidth.value - margin.x * 2,
          top: topPosition.value + margin.top,
          left: leftPosition.value + margin.x,
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
