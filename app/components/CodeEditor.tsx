'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then(mod => mod.default),
  { ssr: false }
);

export default function CodeEditor() {
  const [code, setCode] = useState<string>('// Start coding...')

  return (
    <MonacoEditor
      height="90vh"
      language="typescript"
      theme="vs-dark"
      value={code}
      onChange={(value?: string) => setCode(value || '')}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on'
      }}
    />
  )
}