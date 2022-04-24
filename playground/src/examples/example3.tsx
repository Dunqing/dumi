import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
export default function Example3() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => {
        return c + 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])
  return <div>Example3 {count} <Link to={'/'}>首页</Link></div>
}
