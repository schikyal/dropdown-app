import { useState, useRef, useEffect } from 'react';

import styles from './Dropdown.module.css'

type OptionProps = {
  label: string;
  value: string | number;
}

type MultiDropdownProps = {
  multiple: true;
  value: Array<OptionProps>;
  onChange: (value: OptionProps[]) => void;
}

type SingleDropdownProps = {
  multiple?: false;
  value?: OptionProps;
  onChange: (value: OptionProps | undefined) => void;
}

type DropdownProps = {
  options: Array<OptionProps>;
} & (SingleDropdownProps | MultiDropdownProps)

export default function Dropdown({multiple, options, value, onChange}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function clearOptions() {
    if (multiple) {
      onChange([])
    }
    else {
      onChange(undefined)
    }
  }

  function addAllOptions() {
    if (multiple) {
      onChange(options)
    }
  }

  function selectOption(option: OptionProps) {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter(o => o != option))
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) {
        onChange(option)
      }
    }
  }

  function isOptionSelected(option: OptionProps) {
    return multiple ? value.includes(option) : option === value
  }

  useEffect(() => {
    if (open) {
      setHighlightedIndex(0)
    }
  }, [open])

  /*
    This is to support keyboard accessibility
    Space and Enter - Allow you to open the dropdown and select a value
    Up and Down - Go up and down the dropdown menu
    Escape - escape the dropdown menu
  */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return
      switch (e.code) {
        case "Enter":
        case "Space":
          setOpen(prev => !prev)
          if (open) selectOption(options[highlightedIndex])
          break
        case "ArrowUp":
        case "ArrowDown": {
          if (!open) {
            setOpen(true)
            break
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue)
          }
          break
        }
        case "Escape":
          setOpen(false)
          break
      }
    }
    containerRef.current?.addEventListener("keydown", handler)

    return () => {
      containerRef.current?.removeEventListener("keydown", handler)
    }
  }, [open, highlightedIndex, options])

  return (
    <div
      ref={containerRef} 
      onBlur={() => setOpen(false)} 
      onClick={() => setOpen(prev => !prev)} 
      tabIndex={0} 
      className={styles.dropdown}
    >
      <span className={styles.value}>
        {multiple ? value.map(v => (
          <button 
            key={v.value} 
            onClick={e => {
              e.stopPropagation()
              selectOption(v)
            }}
            className={styles["option-badge"]}
          >
            {v.label}
            <span className={styles["remove-btn"]}>&times;</span>
          </button>
        )): value?.label}
      </span>
      {multiple ? 
      <button
        onClick={e => {
          e.stopPropagation()
          addAllOptions()
        }}
        className={styles["add-btn"]}
      >
        <span className={styles.checkmark}>
        <div className={styles.checkmark_stem}></div>
        <div className={styles.checkmark_kick}></div>
        </span>
      </button> : null
      }
      <button
        onClick={e => {
          e.stopPropagation()
          clearOptions()
        }}
        className={styles["clear-btn"]}
      >
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul className={`${styles.options} ${open ? styles.show : ""}`}>
        {options.map((option, index) => (
          <li
            onClick={e => {
              e.stopPropagation()
              selectOption(option)
              setOpen(false)
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
            key={option.value} 
            className={`${styles.option} ${
              isOptionSelected(option) ? styles.selected : ""
            } ${index === highlightedIndex ? styles.highlighted : ""}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
  