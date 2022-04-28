import React from 'react'
import type { Language } from 'prism-react-renderer'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { useCopy } from '@dumi/theme'
import 'prismjs/themes/prism.css'
import './index.less'

/**
 * define DSL which can be highlighted as similar language
 */
const SIMILAR_DSL = {
  acss: 'css',
  axml: 'xml',
}

export interface ICodeBlockProps {
  code?: string
  children?: string
  lang: Language
  showCopy?: boolean
}

export default function SourceCode({ code, children, lang, showCopy = true }: ICodeBlockProps) {
  const [copyCode, copyStatus] = useCopy()

  return (
    <div className="__dumi-default-code-block">
      <Highlight
        {...defaultProps}
        code={(code || children)?.replace(/\n$/, '')!}
        language={SIMILAR_DSL[lang] || lang}
        theme={undefined}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {showCopy && (
              <button
                className="__dumi-default-icon __dumi-default-code-block-copy-btn"
                data-status={copyStatus}
                onClick={() => copyCode(code || children)!}
              />
            )}
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
