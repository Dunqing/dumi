import { useEffect, useState } from 'react'
import Example2 from './example2'
import Example3 from './example3'
export default function Example1() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => {
        return c + 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])
  return (
    <div>
      <p>Example1 {count}</p>
      <p>
        <Example2 />
      </p>
      <p>
        <Example3 />
      </p>
    </div>
  )
}
