import type { ButtonHTMLAttributes } from 'react'

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: string
  label: string
}
