type Props = {
  items: string[]
  speed?: number
}

export function Marquee({ items, speed = 50 }: Props) {
  const all = [...items, ...items, ...items]
  return (
    <div className="ordi-marquee">
      <div className="ordi-marquee__track" style={{ animationDuration: `${speed}s` }}>
        {all.map((it, i) => (
          <span key={i} className="ordi-marquee__item">
            <span className="ordi-marquee__star">✦</span>
            <span>{it}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
