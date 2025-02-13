import { useEffect, useRef, useState } from "preact/hooks";
import { Icons } from "./Icons";

interface Props {
  values: string[],
  callback: (value: string) => void;
}

type DropdownStates = {
  open: boolean,
  values: string[],
  searchReg: RegExp,
}

export function Dropdown(props: Props) {
  const [states, setStates] = useState<DropdownStates>({
    open: false,
    values: props.values,
    searchReg: /.*/g,
  })

  let itemsRef = useRef<HTMLDivElement>(null);
  let bodyRef = useRef<HTMLDivElement>(null);

  const valueClickHandler = (v: string) => {

  }

  const inputHandler = (e: InputEvent) => {
    const value = (e.target as HTMLInputElement).value;
    const reg = new RegExp(`.*(${value}).*`, "gi");

    setStates((prev) => ({ ...prev, values: props.values.filter((i) => { reg.lastIndex = 0; return reg.test(i) }) }))
  }

  const outsideClickHandler = (e: MouseEvent) => {
    const target = e.target as Node;

    if (!!bodyRef.current && !bodyRef.current.contains(target)) {
      setStates((prev) => ({ ...prev, open: false }));
    }
  }

  useEffect(() => {
    document.addEventListener("click", outsideClickHandler);

    return () => {
      document.removeEventListener("click", outsideClickHandler);
    }
  }, [])


  return (
    <div className={"w-46 max-h-60 bg-gray-100 rounded-lg select-none transition-all dropdown-parent"} ref={bodyRef}>
      <div className={"flex place-items-center "} onClick={() => {
        setStates((prev) => ({ ...prev, open: true }))
      }}>
        <input
          onInput={inputHandler}
          className={"px-1 py-1 outline-none w-8/9"}
          placeholder={"Search..."} />
        <p onClick={(e) => {
          e.stopPropagation();
          setStates((prev) => ({ ...prev, open: !prev.open }))
        }}>

          {Icons.chevron_down}
        </p>
      </div>
      <div className={`px-1 max-h-49 flex flex-col transition-all duration-100 overflow-auto good-scrollbar rounded-lg scrollbar scrollbar-thumb-zinc-400`}
        ref={itemsRef}
        style={{ height: `calc(${states.open ? props.values.length : 0} * 1.5rem)` }}>
        {states.values.map((value) => {
          return <p onClick={() => valueClickHandler(value)}>{value}</p>
        })}
      </div>
    </div>
  )
}
