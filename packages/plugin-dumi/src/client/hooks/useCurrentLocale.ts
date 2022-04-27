import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

type Locales = [string, string][]

export const useCurrentLocale = (locales: Locales) => {
  const localeRE = useMemo(() => new RegExp(`^\/(${locales.map(l => l[0]).join('|')})`), [locales])
  const [locale, setLocale] = useState(locales[0][0]);

  const location = useLocation()

  useEffect(() => {
    const locale = localeRE.exec(location.pathname)?.[1]
    setLocale(locale || locales[0][0])
  }, [location.pathname])

  return [locale, locale === locales[0][0]] as const;
}