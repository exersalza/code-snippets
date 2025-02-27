import { useEffect, useRef, useState } from "preact/hooks";
import { Icons } from "./Icons";

interface Props {
  id?: "",
  values: string[],
  disabled?: boolean,
  placeholder?: string,
  addEmptyValue?: boolean,
  inputRef?: any,
  inputValue?: string,
  callback: (value: string) => void,
  className?: string,
  disabledChilds?: string[]
}

type DropdownStates = {
  open: boolean,
  values: string[],
  searchReg: RegExp,
  lastSelectedValue: string,
  isSearching: boolean
}

/**
 *
 *
 * # Arguments
 *
 * - id?: string,
 * - values: string[],
 * - disabled?: boolean,
 * - placeholder?: string,
 * - addEmptyValue?: boolean,
 * - callback: (value: string) => void,
 *
 * */
export function Dropdown(props: Props) {
  const [states, setStates] = useState<DropdownStates>({
    open: false,
    values: props.values,
    searchReg: /.*/g,
    lastSelectedValue: "",
    isSearching: false
  })

  let itemsRef = useRef<HTMLDivElement>(null);
  let bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStates((prev) => ({
      ...prev,
      values:
        prev.isSearching ?
          props.values.filter((i) => {
            prev.searchReg.lastIndex = 0;
            return prev.searchReg.test(i);
          }) : props.values,
    }));
  }, [props.values])


  const inputHandler = (e: InputEvent) => {
    const value = (e.target as HTMLInputElement).value;
    const reg = new RegExp(`.*(${value}).*`, "gi");

    setStates((prev) => ({
      ...prev,
      isSearching: true,
      searchReg: reg,
      values: props.values.filter((i) => {
        reg.lastIndex = 0; return reg.test(i)
      }),
      lastSelectedValue: value
    }))
  }

  // make the dropdown close when you click outside of it
  const outsideClickHandler = (e: MouseEvent) => {
    const target = e.target as Node;

    if (!!bodyRef.current && !bodyRef.current.contains(target)) {
      setStates((prev) => ({ ...prev, open: false }));
    }
  }

  function cb(value: string) {
    props.callback(value);
    setStates((prev) => ({
      ...prev,
      isSearching: false,
      open: false,
      lastSelectedValue: value,
      values: props.values
    }));
  }

  useEffect(() => {
    document.addEventListener("click", outsideClickHandler);

    return () => {
      document.removeEventListener("click", outsideClickHandler);
    }
  }, [])


  return (
    <div id={props.id} className={`w-46 max-h-60 z-100 bg-gray-200/80 relative ${states.open && states.values.length !== 0 ? "z-101 rounded-t-lg" : "rounded-lg"} select-none transition-all dropdown-parent ${props.className}`} ref={bodyRef}>
      <div className={"flex place-items-center "} onClick={() => {
        setStates((prev) => ({ ...prev, open: props.values.length !== 0 && true }))
      }}>
        <input
          onInput={inputHandler}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              cb(e.target.value)
            }
          }}
          className={"p-1 outline-none w-8/9"}
          disabled={props.disabled}
          placeholder={props.placeholder ?? "Search..."}
          value={props.inputValue ?? states.lastSelectedValue}
        />
        <p onClick={(e) => {
          e.stopPropagation();
          setStates((prev) => ({ ...prev, open: props.values.length !== 0 && !prev.open }))
        }}>

          {Icons.chevron_down}
        </p>
      </div>
      <div className={`px-1 max-h-49 w-full absolute flex flex-col transition-all overflow-auto good-scrollbar rounded-b-lg scrollbar scrollbar-thumb-zinc-400 bg-gray-100 duration-100`}
        ref={itemsRef}
        style={{
          height: `calc(${states.open ? Math.min((props.addEmptyValue ? states.values.length + 1 : states.values.length), 9) : 0} * 1.5rem)`,
          top: '100%',
          visibility: states.open ? 'visible' : 'hidden',
          opacity: states.open ? 1 : 0,
        }}>
        {
          props.addEmptyValue
          && <p
            onClick={() => cb("")}
            className={"cursor-pointer hover:bg-gray-200 rounded"}>
            -
          </p>

        }
        {states.values.map((value) => {
          return <button
            onClick={() => cb(value)}
            disabled={( props.disabledChilds ?? [] ).includes(value)}
            className={"text-left disabled:text-gray-400 not-disabled:hover:bg-gray-200  rounded"}>
            {value}
          </button>
        })}
      </div>
    </div>
  )
}
