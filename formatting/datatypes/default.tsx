import { TypeFormat, TypeFormatOpts } from "../types.ts";
import { MutableRef, useEffect, useRef } from "preact/hooks"

function useAutoFocus(ref: MutableRef<any>) {
  useEffect(() => {
    if (!ref.current) return
    const tabIndex = (ref.current.parentNode.closest('[tabindex]') as HTMLDivElement)?.tabIndex ?? 0
    console.log(ref.current.parentNode.closest('[tabindex]'))
    ref.current.tabIndex = tabIndex
    ref.current.focus()
  }, [ref.current])
}

export function display({ store, column, row }: TypeFormatOpts) {
  return <div class="p-4">{row[column]}</div>
}

export function edit({ store, column, row }: TypeFormatOpts) {
  const ref = useRef(null)
  useAutoFocus(ref)
  return <textarea onKeyDownCapture={(ev)=> {
   
  }} onKeyDown={(ev) => {
 
  }} ref={ref} class="vt-edit textarea textarea-ghost w-full bg-accent/20 m-0 p-4 z-10 rounded-none" autofocus tabIndex={0} value={row[column]} style={{
    height: 'inherit',
  }}></textarea>;
}

export const Default: TypeFormat<"default"> = {
  datatype: "default",
  display,
  edit,
};
