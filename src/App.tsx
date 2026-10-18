import { useMeetingStore } from '@/store/useMeetingStore'
import { SetupScreen } from '@/screens/SetupScreen'
import { PresentationScreen } from '@/screens/PresentationScreen'
import { TemplateEditorScreen } from '@/screens/TemplateEditorScreen'

export default function App() {
  const screen = useMeetingStore(s => s.screen)

  return (
    <div className="w-screen h-screen overflow-hidden">
      {screen === 'setup' && <SetupScreen />}
      {screen === 'presentation' && <PresentationScreen />}
      {screen === 'template-editor' && <TemplateEditorScreen />}
    </div>
  )
}
