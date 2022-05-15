import React from 'react'
import type { LinkProps } from 'react-router-dom'
import { useLocation, useResolvedPath } from 'react-router-dom'
import Link from './Link'

export interface NavLinkProps
  extends Omit<LinkProps, 'className' | 'style' | 'children'> {
  children?:
    | React.ReactNode
    | ((props: { isActive: boolean }) => React.ReactNode)
  caseSensitive?: boolean
  className?: string | ((props: { isActive: boolean }) => string | undefined)
  end?: boolean
  active?: boolean
  style?:
    | React.CSSProperties
    | ((props: { isActive: boolean }) => React.CSSProperties)
}

/**
 * A <Link> wrapper that knows if it's "active" or not.
 */
// eslint-disable-next-line react/display-name
const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    {
      'aria-current': ariaCurrentProp = 'page',
      caseSensitive = false,
      className: classNameProp = '',
      end = false,
      style: styleProp,
      to,
      children,
      active,
      ...rest
    },
    ref
  ) => {
    const location = useLocation()
    const path = useResolvedPath(to)

    let locationPathname = location.pathname
    let toPathname = path.pathname
    if (!caseSensitive) {
      locationPathname = locationPathname.toLowerCase()
      toPathname = toPathname.toLowerCase()
    }

    const isActive =
      active !== undefined
        ? active
        : locationPathname === toPathname ||
          (!end &&
            locationPathname.startsWith(toPathname) &&
            locationPathname.charAt(toPathname.length) === '/')

    const ariaCurrent = isActive ? ariaCurrentProp : undefined

    let className: string | undefined
    if (typeof classNameProp === 'function') {
      className = classNameProp({ isActive })
    } else {
      // If the className prop is not a function, we use a default `active`
      // class for <NavLink />s that are active. In v5 `active` was the default
      // value for `activeClassName`, but we are removing that API and can still
      // use the old default behavior for a cleaner upgrade path and keep the
      // simple styling rules working as they currently do.
      className = [classNameProp, isActive ? 'active' : null]
        .filter(Boolean)
        .join(' ')
    }

    const style =
      typeof styleProp === 'function' ? styleProp({ isActive }) : styleProp

    return (
      <Link
        {...rest}
        aria-current={ariaCurrent}
        className={className}
        ref={ref}
        style={style}
        to={to}
      >
        {typeof children === 'function' ? children({ isActive }) : children}
      </Link>
    )
  }
)

export default NavLink
