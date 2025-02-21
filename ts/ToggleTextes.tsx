interface Props {
  active?: string,
  options: string[],
  className?: string,
  setActive: (x: string) => void;
}

export function ChangeButton(props: Props) {

  return (
    <div className={`flex gap-2 relative ${props.className ?? ""}`}>
      {props.options.map((val) => (
        <button onClick={()=>{props.setActive(val)}} className={`${props?.active === val ? "text-gray-800" : "text-gray-400"} ${props.active === undefined ? "first:text-gray-800" : ""} transition-color cursor-pointer`}>{val}</button>
      ))}
    </div>
  )
}
