import * as React from 'react'
import styled, { CSSProperties } from 'styled-components'

interface OptionProps {
  [key: string]: any
  background?: string
  opacity?: number
  zIndex?: number
  duration?: number
  timing?: string
  height?: number
  width?: number
  outDuration?: number
  className?: string
  innerHTML?: string
  appendTo?: HTMLElement
  style?: CSSProperties
}

interface RippleProps {
  children: JSX.Element
}

const defaultOption = {
  background: '#000',
  opacity: 0.25,
  zIndex: 99,
  duration: 2000,
  timing: 'cubic-bezier(0.1, 0.1, 0, 1)',
  outDuration: 200
}

function styles(el: HTMLElement, option: OptionProps) {
  const elmt = el as HTMLElement
  if (typeof option === 'string') return getComputedStyle(el).getPropertyValue(option)

  for (let key in option) {
    elmt.style.setProperty(key, option[key])
  }
  return
}

function tag(el: HTMLElement | string , option: OptionProps) {
  const newEl = el instanceof HTMLElement ? el : document.createElement(el)

  for (let key in option) {
    const val = option[key]

    switch (key) {
      case 'style':
        styles(newEl, val)
        break
      case 'appendTo':
        if (!val) break
        val.appendChild(newEl)
        break
      default:
        (newEl as any)[key] = val
    }
  }
  return newEl
}

function edit(el: HTMLElement) {
  return {
    on: (event: 'touchend touchcancel' | 'mouseleave mouseup' | 'touchstart' | 'mousedown', callback: (e: Event) => void) => {
      event.split(' ').forEach((ev) => {
        el.addEventListener(ev, callback)
      })
    },
    off: (event: 'touchend touchcancel' | 'mouseleave mouseup' | 'touchstart' | 'mousedown', callback: (e: Event) => void) => {
      event.split(' ').forEach((ev) => {
        el.removeEventListener(ev, callback)
      })
    }
  }
}

export function rippleEventListener(elmnt: HTMLElement | string | null = '_', option: OptionProps = {}) {
  // Configuration
  option = {
    ...defaultOption,
    ...option
  }
  const { background, opacity, zIndex, duration, timing, height, width, outDuration } = option

  const isTouch = 'ontouchstart' in window

  function createRipple(e: Event) {
    // Touch Events
    const mouseEvent = e as MouseEvent

    const offsetTop = this.getBoundingClientRect().top
    const offsetLeft = this.getBoundingClientRect().left
    const cx = mouseEvent.pageX - offsetLeft
    const cy = mouseEvent.pageY - offsetTop

    // Elements to append in
    const { offsetWidth, offsetHeight } = this
    const divParent = tag('div', {
      appendTo: this,
      className: 'rippleParent__',
      style: {
        zIndex,
        height: offsetHeight + 'px',
        width: offsetWidth + 'px',
        transition: `opacity ${outDuration}ms ease-out`
      }
    })

    tag('div', {
      appendTo: divParent,
      className: 'ripple__',
      style: {
        top: cy + 'px',
        left: cx + 'px',
        opacity,
        width: width || offsetWidth * Math.PI + 'px',
        height: height || offsetWidth * Math.PI + 'px',
        background,
        animation: `rippleEffect__ ${duration}ms ${timing} both`
      }
    })

    const events = isTouch ? 'touchend touchcancel' : 'mouseleave mouseup'

    function removeRipple() {
      divParent.style.opacity = `0`
      setTimeout(() => this.removeChild(divParent), outDuration) // extend the duration to maintain element animation
      edit(this).off(events, removeRipple)
    }
    edit(this).on(events, removeRipple) // Add a remove
  }

  // Add the event
  const event = isTouch ? 'touchstart' : 'mousedown'

  const elements = new Array(elmnt) 
  elements.forEach((el: HTMLElement) => {
    edit(el).on(event, createRipple)
  })

  return {
    removeEventListener: () => {
      elements.forEach((el: HTMLElement) => edit(el).off(event, createRipple))
    }
  }

}

export default function Ripple({ children }: RippleProps) {
  return <RippleWrapper>{children}</RippleWrapper>
}

const RippleWrapper = styled.div`
  position: relative;
  .rippleParent__ {
    pointer-events: none;
    overflow: hidden;
    background: transparent;
    position: absolute;
    top: 50%;
    left: 50%;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    transform: translate(-50%, -50%);
  }
  .ripple__ {
    border-radius: 50%;
    position: absolute;
    will-change: transform;
    pointer-events: none;
  }
  @keyframes rippleEffect__ {
    0% {
      opacity: 0.2;
      transform: translate(-50%, -50%) scale(0);
    }
    100% {
      opacity: 0.25;
      transform: translate(-50%, -50%) scale(0.7);
    }
  }
`

