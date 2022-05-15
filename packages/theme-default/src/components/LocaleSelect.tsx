import type { FC } from 'react'
import React, { useContext } from 'react'
import { Link, context } from '@dumi/theme'
import { useLocation, useNavigate } from 'react-router-dom'
import './LocaleSelect.less'

const LocaleSelect: FC = () => {
  const {
    locale,
    config: { locales },
  } = useContext(context)

  const { pathname } = useLocation()
  const navigate = useNavigate()

  const firstDiffLocale = locales.find(([name]) => name !== locale)

  function getLocaleTogglePath(target: string) {
    const pathLocaleRE = new RegExp(`^\\/${locale}`)

    if (target !== locales[0][0]) {
      if (!pathLocaleRE.test(pathname)) return `/${target}${pathname}`

      return pathname.replace(pathLocaleRE, `/${target}`)
    }
    return pathname.replace(pathLocaleRE, '')
  }

  return firstDiffLocale ? (
    <div
      className="__dumi-default-locale-select"
      data-locale-count={locales.length}
    >
      {locales.length > 2 ? (
        <select
          value={locale}
          onChange={(ev) => navigate(getLocaleTogglePath(ev.target.value))}
        >
          {locales.map((localeItem) => (
            <option
              value={localeItem[0]}
              key={localeItem[0]}
            >
              {localeItem[1]}
            </option>
          ))}
        </select>
      ) : (
        <Link to={getLocaleTogglePath(firstDiffLocale[0])}>
          {firstDiffLocale[1]}
        </Link>
      )}
    </div>
  ) : null
}

export default LocaleSelect
