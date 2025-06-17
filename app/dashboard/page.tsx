import { CodeEditor, AIChatPanel, OptimizationPanel } from '@/components'
import { fetchInitialCode } from '@/lib/actions'

export default async function Dashboard() {
  const initialCode = await fetchInitialCode()
  
  return (
    <div className="grid grid-cols-[1fr_400px] h-screen">
      <div className="border-r p-4">
        <CodeEditor initialValue={initialCode} />
      </div>
      
      <div className="flex flex-col">
        <AIChatPanel className="border-b h-1/2" />
        <OptimizationPanel className="h-1/2" />
      </div>
    </div>
  )
}