import { useEffect } from 'react'
import Other from './other'

export default function example() {
  useEffect(() => {
    require('react')
  }, [])

  return <>
    example
    <Other></Other>
  </>
}
