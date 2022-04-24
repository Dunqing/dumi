import { useEffect, useState } from 'react'
export default function Example2() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => {
        return c + 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])
  return <div>Example2 {count}</div>
}
