import { useState, useEffect } from 'react'
import './App.css'
import { SiteConfig } from './components/SiteConfig'
import { StatusList } from './components/StatusList'
import { wordPressService } from './services/WordPressService'

type View = 'feed' | 'settings'

function App() {
  const [currentView, setCurrentView] = useState<View>('feed')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const storedConfig = localStorage.getItem('wordpressSiteConfig')
    if (storedConfig) {
      const config = JSON.parse(storedConfig)
      wordPressService.setSite(config)
      setIsConnected(true)
    }
  }, [])

  const handleConnect = () => {
    setIsConnected(true)
    setCurrentView('feed')
  }

  const handleDisconnect = () => {
    localStorage.removeItem('wordpressSiteConfig')
    setIsConnected(false)
    setCurrentView('settings')
  }

  if (!isConnected) {
    return (
      <div className="app">
        <SiteConfig onConnect={handleConnect} />
      </div>
    )
  }

  return (
    <div className="app">
      {currentView === 'settings' && (
        <SiteConfig 
          onConnect={handleConnect}
          onBack={() => setCurrentView('feed')}
          onDisconnect={handleDisconnect}
          isEditMode={true}
        />
      )}

      {currentView === 'feed' && (
        <StatusList onSettingsClick={() => setCurrentView('settings')} />
      )}
    </div>
  )
}

export default App
