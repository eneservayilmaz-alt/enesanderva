import { useId, useState } from 'react'
import { memoryDateKey } from '../memories/memoryGroups'
import './memory-date-input.css'

export function MemoryDateInput({ value, onChange, dates, label, placeholder }: { value: string; onChange: (date: string) => void; dates: string[]; label: string; placeholder: string }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const unique = new Map<string, string>()
  for (const date of dates) if (date.trim() && !unique.has(memoryDateKey(date))) unique.set(memoryDateKey(date), date.trim())
  const query = value.trim().toLocaleLowerCase('tr-TR')
  const options = Array.from(unique.values()).filter(date => date.toLocaleLowerCase('tr-TR').includes(query))
  const visible = open && options.length > 0
  const select = (date: string) => { onChange(date); setOpen(false); setActive(-1) }
  return <div className="memory-date-input" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) { setOpen(false); setActive(-1) } }}>
    <label htmlFor={id}><span>{label}</span></label>
    <input id={id} role="combobox" aria-autocomplete="list" aria-expanded={visible} aria-controls={`${id}-list`} aria-activedescendant={visible && active >= 0 ? `${id}-${active}` : undefined} autoComplete="off" value={value} placeholder={placeholder} onFocus={() => setOpen(true)} onChange={event => { onChange(event.target.value); setActive(-1); setOpen(true) }} onKeyDown={event => {
      if (event.key === 'Escape') { setOpen(false); setActive(-1); return }
      if (event.key === 'Enter' && visible && active >= 0) { event.preventDefault(); select(options[active]); return }
      if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && options.length) {
        event.preventDefault(); setOpen(true)
        const next = event.key === 'ArrowDown' ? (active + 1) % options.length : (active <= 0 ? options.length - 1 : active - 1)
        setActive(next)
        document.getElementById(`${id}-${next}`)?.scrollIntoView({ block: 'nearest' })
      }
    }} />
    {visible && <div id={`${id}-list`} role="listbox" aria-label={label} className="memory-date-options">
      {options.map((date, index) => <div key={date} id={`${id}-${index}`} role="option" aria-selected={index === active} className={index === active ? 'active' : ''} onMouseDown={event => event.preventDefault()} onClick={() => select(date)}>{date}</div>)}
    </div>}
  </div>
}
