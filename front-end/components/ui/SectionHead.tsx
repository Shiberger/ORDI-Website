import type { ReactNode } from 'react'
import { MonoTag } from './MonoTag'

type Props = {
  kicker: ReactNode
  title: ReactNode
  right?: ReactNode
}

export function SectionHead({ kicker, title, right }: Props) {
  return (
    <header className="ordi-secthead">
      <div className="ordi-secthead__left">
        <MonoTag>{kicker}</MonoTag>
        <h2 className="ordi-display-md">{title}</h2>
      </div>
      {right && <div className="ordi-secthead__right">{right}</div>}
    </header>
  )
}
