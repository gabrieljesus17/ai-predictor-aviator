'use client'

import { useState, useEffect } from 'react'
import { Star, LogOut } from 'lucide-react'

export default function Home() {
  const [showPopup, setShowPopup] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showStep4, setShowStep4] = useState(false)
  const [showStep5, setShowStep5] = useState(false)
  const [userCards, setUserCards] = useState<Array<{ id: number; username: string; value: number }>>([])]
  
  // Estados para Etapa 6
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisLines, setAnalysisLines] = useState<string[]>([])
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [betSizeClicked, setBetSizeClicked] = useState(false)

  // Estados para Etapa 7
  const [signalClicked, setSignalClicked] = useState(false)
  const [signalLines, setSignalLines] = useState<string[]>([])
  const [signalComplete, setSignalComplete] = useState(false)
  const [multiplierValue, setMultiplierValue] = useState('1.00')
  const [showAnotherSignal, setShowAnotherSignal] = useState(false)
  const [isAnimatingMultiplier, setIsAnimatingMultiplier] = useState(false)

  // Função para gerar valor USD baseado nas porcentagens especificadas
  const generateUSDValue = () => {
    const random = Math.random() * 100
    
    if (random < 20) {
      // 20% das vezes: U$ 15 até U$ 40
      return Math.floor(Math.random() * (40 - 15 + 1)) + 15
    } else if (random < 50) {
      // 30% das vezes: U$ 41 até U$ 140
      return Math.floor(Math.random() * (140 - 41 + 1)) + 41
    } else if (random < 85) {
      // 35% das vezes: U$ 141 até U$ 450
      return Math.floor(Math.random() * (450 - 141 + 1)) + 141
    } else {
      // 15% das vezes: U$ 451 até U$ 860
      return Math.floor(Math.random() * (860 - 451 + 1)) + 451
    }
  }

  // Função para formatar valor USD
  const formatUSD = (value: number) => {
    if (value >= 1000) {
      return `${Math.floor(value / 1000)}.${String(value % 1000).padStart(3, '0')} USD`
    }
    return `${value} USD`
  }

  // Função para gerar username aleatório
  const generateUsername = () => {
    const randomNum = Math.floor(Math.random() * 9000) + 1000
    return `username${randomNum}`
  }

  // Função para gerar multiplicador randomizado (Etapa 7)
  const generateMultiplier = () => {
    const random = Math.random() * 100
    
    if (random < 63) {
      // 63% das vezes: até 2.60x
      return (Math.random() * (2.60 - 1.20) + 1.20).toFixed(2)
    } else if (random < 87) {
      // 24% das vezes: entre 2.61x e 4.60x
      return (Math.random() * (4.60 - 2.61) + 2.61).toFixed(2)
    } else {
      // 13% das vezes: até 13.50x
      return (Math.random() * (13.50 - 4.61) + 4.61).toFixed(2)
    }
  }

  // Função para animar multiplicador subindo (Etapa 7)
  const animateMultiplier = (targetValue: string) => {
    setIsAnimatingMultiplier(true)
    const target = parseFloat(targetValue)
    const duration = 600 // 0.6 segundos
    const steps = 30
    const increment = (target - 1.00) / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      const currentValue = 1.00 + (increment * currentStep)
      
      if (currentStep >= steps) {
        setMultiplierValue(targetValue)
        setIsAnimatingMultiplier(false)
        clearInterval(interval)
      } else {
        setMultiplierValue(currentValue.toFixed(2))
      }
    }, duration / steps)
  }

  // Adicionar novo card de usuário
  const addNewUserCard = () => {
    const newCard = {
      id: Date.now(),
      username: generateUsername(),
      value: generateUSDValue()
    }
    
    setUserCards(prev => [newCard, ...prev].slice(0, 10)) // Mantém apenas 10 cards
  }

  // Timer para adicionar novos cards a cada 9-21 segundos
  useEffect(() => {
    if (isAuthenticated) {
      // Adiciona 3 cards iniciais
      addNewUserCard()
      setTimeout(() => addNewUserCard(), 500)
      setTimeout(() => addNewUserCard(), 1000)

      const interval = setInterval(() => {
        addNewUserCard()
      }, Math.random() * (21000 - 9000) + 9000) // Entre 9 e 21 segundos

      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  // Função para processar análise (Etapa 6)
  const handleGetBetSize = () => {
    if (betSizeClicked) return // Previne múltiplos cliques
    
    setBetSizeClicked(true)
    setIsAnalyzing(true)
    setAnalysisLines([])
    setAnalysisComplete(false)

    const lines = [
      '> Connecting to data stream...',
      '> Analyzing market volatility...',
      '> Calculating risk-to-reward ratio...',
      '> Running predictive model v3.4...',
      '> Finalizing bet size...',
      '> SUCCESS: Bet parameters calculated.'
    ]

    // Adiciona linhas progressivamente com delay de 1.8s
    lines.forEach((line, index) => {
      setTimeout(() => {
        setAnalysisLines(prev => [...prev, line])
        
        // Quando chegar na última linha
        if (index === lines.length - 1) {
          setIsAnalyzing(false)
          setAnalysisComplete(true)
        }
      }, index * 1800) // 1.8 segundos entre cada linha
    })
  }

  // Função para processar sinal (Etapa 7)
  const handleGetSignal = () => {
    if (signalClicked) return // Previne múltiplos cliques
    
    setSignalClicked(true)
    setIsAnalyzing(true) // Mostra "Analyzing data..." novamente
    setSignalLines([])
    setSignalComplete(false)
    setAnalysisComplete(false) // Remove o texto "Aposte um valor..."

    const lines = [
      '> Initiating flight path analysis...',
      '> Processing real-time exit vectors...',
      '> Calibrating for atmospheric variance...',
      '> Cross-referencing historical data...',
      '> LOCKING SIGNAL...',
      '> SUCCESS: Multiplier signal acquired.'
    ]

    // Adiciona linhas progressivamente com delay de 0.5s
    lines.forEach((line, index) => {
      setTimeout(() => {
        setSignalLines(prev => [...prev, line])
        
        // Quando chegar na última linha
        if (index === lines.length - 1) {
          setIsAnalyzing(false) // Remove "Analyzing data..."
          setSignalComplete(true)
          
          // Gera e anima o multiplicador
          const targetMultiplier = generateMultiplier()
          setTimeout(() => {
            animateMultiplier(targetMultiplier)
          }, 100)
          
          // Mostra botão "Get another Signal"
          setTimeout(() => {
            setShowAnotherSignal(true)
          }, 100)
        }
      }, index * 500) // 0.5 segundos entre cada linha
    })
  }

  // Função para resetar e voltar à Etapa 5 (loop)
  const handleGetAnotherSignal = () => {
    // Reset todos os estados para Etapa 5
    setIsAnalyzing(false)
    setAnalysisLines([])
    setAnalysisComplete(false)
    setBetSizeClicked(false)
    setSignalClicked(false)
    setSignalLines([])
    setSignalComplete(false)
    setMultiplierValue('1.00')
    setShowAnotherSignal(false)
    setIsAnimatingMultiplier(false)
  }

  const handleValidate = () => {
    if (accessCode === '1898') {
      setError(false)
      setShowPopup(false)
      setIsAuthenticated(true)
    } else {
      setError(true)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setShowStep4(false)
    setShowStep5(false)
    setAccessCode('')
    setUserCards([])
    // Reset estados da Etapa 6 e 7
    setIsAnalyzing(false)
    setAnalysisLines([])
    setAnalysisComplete(false)
    setBetSizeClicked(false)
    setSignalClicked(false)
    setSignalLines([])
    setSignalComplete(false)
    setMultiplierValue('1.00')
    setShowAnotherSignal(false)
    setIsAnimatingMultiplier(false)
  }

  const handleActivate = () => {
    setShowStep4(true)
  }

  const handleBackToMenu = () => {
    setShowStep4(false)
    setShowStep5(false)
    // Reset estados da Etapa 6 e 7
    setIsAnalyzing(false)
    setAnalysisLines([])
    setAnalysisComplete(false)
    setBetSizeClicked(false)
    setSignalClicked(false)
    setSignalLines([])
    setSignalComplete(false)
    setMultiplierValue('1.00')
    setShowAnotherSignal(false)
    setIsAnimatingMultiplier(false)
  }

  const handleFoundGame = () => {
    setShowStep5(true)
  }

  const handleBackToStep4 = () => {
    setShowStep5(false)
    // Reset estados da Etapa 6 e 7
    setIsAnalyzing(false)
    setAnalysisLines([])
    setAnalysisComplete(false)
    setBetSizeClicked(false)
    setSignalClicked(false)
    setSignalLines([])
    setSignalComplete(false)
    setMultiplierValue('1.00')
    setShowAnotherSignal(false)
    setIsAnimatingMultiplier(false)
  }

  // Tela Inicial (Etapa 1)
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4">
        <h1 className="text-[#00FF00] text-3xl sm:text-4xl font-mono font-bold text-center mb-8 tracking-wide">
          AI PREDICTOR
        </h1>
        
        <button 
          onClick={() => setShowPopup(true)}
          className="border-2 border-[#00FF00] text-[#00FF00] px-8 py-3 text-lg font-mono font-semibold hover:bg-[#00FF00] hover:text-black transition-all duration-300 ease-in-out active:scale-95 rounded-sm"
        >
          GET AI SIGNALS
        </button>

        {/* Pop-up de Acesso (Etapa 2) */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0a0a0a] border-2 border-[#00FF00]/30 rounded-lg p-6 w-full max-w-md relative">
              <button 
                onClick={() => {
                  setShowPopup(false)
                  setAccessCode('')
                  setError(false)
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                ✕
              </button>

              <p className="text-red-500 text-xs sm:text-sm font-mono text-center mb-4">
                // 3 access codes available for today
              </p>

              <h2 className="text-[#00FF00] text-xl sm:text-2xl font-mono font-bold text-center mb-6">
                Type access code
              </h2>

              <input
                type="text"
                placeholder="Access code"
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value)
                  setError(false)
                }}
                className={`bg-[#1A1A2E] text-gray-300 font-mono w-full p-3 rounded border-2 ${
                  error ? 'border-red-500' : 'border-transparent'
                } focus:outline-none focus:border-[#00FF00] transition-colors`}
              />

              {error && (
                <p className="text-red-500 text-sm font-mono text-center mt-2">
                  Código inválido. Tente novamente.
                </p>
              )}

              <button
                onClick={handleValidate}
                className="bg-[#00FF00] text-black font-mono font-bold w-full p-3 rounded mt-4 hover:bg-[#00DD00] transition-all duration-300 active:scale-95"
              >
                VALIDATE
              </button>

              <p className="text-gray-400 text-sm sm:text-base font-mono text-center mt-6 mb-3">
                Se ainda não adquiriu seu código de acesso clique no botão abaixo
              </p>

              <button className="border-2 border-[#00FF00] text-[#00FF00] font-mono font-semibold w-full p-3 rounded hover:bg-[#00FF00] hover:text-black transition-all duration-300 active:scale-95">
                ADQUIRIR CÓDIGO
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Etapa 5 - Predictor Principal
  if (showStep5) {
    return (
      <div className="min-h-screen bg-black text-white font-mono pb-8">
        {/* Header com botões Lottery e Logout (mesmo da Etapa 3) */}
        <div className="flex justify-end items-center gap-2 p-4">
          <button className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded font-bold text-sm hover:bg-yellow-400 transition-colors">
            <Star className="w-4 h-4" fill="currentColor" />
            LOTTERY
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded font-bold text-sm hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            LOGOUT
          </button>
        </div>

        {/* Seção MY STUDENTS (mesmo da Etapa 3) */}
        <div className="px-4 mt-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h2 className="text-[#00FF00] text-lg font-bold">// MY STUDENTS //</h2>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
              LIVE
            </span>
          </div>

          {/* Linha divisória superior */}
          <div className="h-px bg-gray-700 mb-4"></div>

          {/* Cards de usuários rolantes */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-3 min-w-max">
              {userCards.map((card, index) => (
                <div 
                  key={card.id}
                  className={`bg-[#1A1A2E] border border-gray-700 rounded-lg p-3 min-w-[140px] h-[70px] flex flex-col justify-center transition-all duration-500 ${
                    index === 0 ? 'animate-slideIn' : ''
                  }`}
                >
                  <p className="text-gray-400 text-sm mb-1">{card.username}</p>
                  <p className="text-[#00FF00] text-base font-bold">{formatUSD(card.value)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Linha divisória inferior */}
          <div className="h-px bg-gray-700 mt-4 mb-6"></div>
        </div>

        {/* Card Principal do Predictor - EXTENSO */}
        <div className="px-4">
          <div className="bg-[#0a0a0a] border-2 border-[#00FF00]/30 rounded-lg p-6 min-h-[calc(100vh-400px)]">
            {/* Botões Voltar e Como Usar */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <button 
                onClick={handleBackToStep4}
                className="border-2 border-yellow-500 text-yellow-500 bg-black px-6 py-2 rounded font-bold text-sm hover:bg-yellow-500 hover:text-black transition-all duration-300"
              >
                Voltar
              </button>
              <button className="border-2 border-orange-500 text-orange-500 bg-black px-4 py-2 rounded font-bold text-xs sm:text-sm hover:bg-orange-500 hover:text-black transition-all duration-300">
                COMO USAR O PREDICTOR
              </button>
            </div>

            {/* Título Centralizado */}
            <h1 className="text-[#00FF00] text-2xl sm:text-3xl font-bold text-center mb-8">
              Aviator AI PREDICTOR
            </h1>

            {/* Multiplicador Grande */}
            <div className="flex justify-center mb-6">
              <div className={`text-white text-6xl sm:text-7xl font-bold font-mono ${
                isAnimatingMultiplier ? 'animate-pulse' : ''
              }`}>
                x{multiplierValue}
              </div>
            </div>

            {/* Texto de Status (Analyzing data / Aposte um valor) */}
            <div className="flex justify-center mb-6 min-h-[32px]">
              {isAnalyzing && (
                <p className="text-[#dbdd1c] text-lg font-bold animate-pulse">
                  Analyzing data...
                </p>
              )}
              {analysisComplete && !signalClicked && (
                <p className="text-[#dbdd1c] text-lg font-bold">
                  Aposte um valor entre 10 U$ até 30 U$
                </p>
              )}
            </div>

            {/* Botões - Condicional baseado no estado */}
            {!showAnotherSignal ? (
              <>
                {/* Botão Get Bet Size */}
                <div className="mb-4">
                  <button 
                    onClick={handleGetBetSize}
                    disabled={betSizeClicked}
                    className={`font-bold w-full py-4 rounded text-lg transition-all duration-300 ${
                      betSizeClicked 
                        ? 'bg-[#00FF00] text-black cursor-default' 
                        : 'bg-[#00FF00] text-black hover:bg-[#00DD00] active:scale-95'
                    }`}
                  >
                    Get Bet Size
                  </button>
                </div>

                {/* Botão Get Signal */}
                <div className="mb-6">
                  <button 
                    onClick={handleGetSignal}
                    disabled={!analysisComplete}
                    className={`font-bold w-full py-4 rounded text-lg transition-all duration-300 ${
                      analysisComplete 
                        ? 'bg-[#00FF00] text-black hover:bg-[#00DD00] active:scale-95' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    Get Signal
                  </button>
                </div>
              </>
            ) : (
              /* Botão Get another Signal (Etapa 7) */
              <div className="mb-6">
                <button 
                  onClick={handleGetAnotherSignal}
                  className="bg-yellow-500 text-black font-bold w-full py-4 rounded text-lg hover:bg-yellow-400 transition-all duration-300 active:scale-95"
                >
                  Get another Signal
                </button>
              </div>
            )}

            {/* Campo de Análise com Linhas Progressivas */}
            <div className="border-2 border-gray-700 rounded-lg p-6 min-h-[180px] bg-black/30 font-mono">
              {/* Linhas da Etapa 6 */}
              {!signalClicked && analysisLines.map((line, index) => (
                <div 
                  key={`analysis-${index}`}
                  className={`mb-2 text-sm ${
                    line.includes('SUCCESS') 
                      ? 'text-[#00FF00]' 
                      : 'text-[#a4cbc8]'
                  } animate-fadeIn`}
                >
                  {line}
                </div>
              ))}
              
              {/* Linhas da Etapa 7 */}
              {signalClicked && signalLines.map((line, index) => (
                <div 
                  key={`signal-${index}`}
                  className={`mb-2 text-sm ${
                    line.includes('SUCCESS') 
                      ? 'text-[#00FF00]' 
                      : 'text-[#a4cbc8]'
                  } animate-fadeIn`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-slideIn {
            animation: slideIn 0.5s ease-out;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in;
          }
        `}</style>
      </div>
    )
  }

  // Etapa 4 - Tutorial Aviator
  if (showStep4) {
    return (
      <div className="min-h-screen bg-black text-white font-mono">
        {/* Header com botões Lottery e Logout (mesmo da Etapa 3) */}
        <div className="flex justify-end items-center gap-2 p-4">
          <button className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded font-bold text-sm hover:bg-yellow-400 transition-colors">
            <Star className="w-4 h-4" fill="currentColor" />
            LOTTERY
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded font-bold text-sm hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            LOGOUT
          </button>
        </div>

        {/* Seção MY STUDENTS (mesmo da Etapa 3) */}
        <div className="px-4 mt-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h2 className="text-[#00FF00] text-lg font-bold">// MY STUDENTS //</h2>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
              LIVE
            </span>
          </div>

          {/* Linha divisória superior */}
          <div className="h-px bg-gray-700 mb-4"></div>

          {/* Cards de usuários rolantes */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-3 min-w-max">
              {userCards.map((card, index) => (
                <div 
                  key={card.id}
                  className={`bg-[#1A1A2E] border border-gray-700 rounded-lg p-3 min-w-[140px] h-[70px] flex flex-col justify-center transition-all duration-500 ${
                    index === 0 ? 'animate-slideIn' : ''
                  }`}
                >
                  <p className="text-gray-400 text-sm mb-1">{card.username}</p>
                  <p className="text-[#00FF00] text-base font-bold">{formatUSD(card.value)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Linha divisória inferior */}
          <div className="h-px bg-gray-700 mt-4 mb-6"></div>
        </div>

        {/* Botão Voltar */}
        <div className="px-4 mb-4">
          <button 
            onClick={handleBackToMenu}
            className="border-2 border-yellow-500 text-yellow-500 bg-black px-6 py-2 rounded font-bold text-sm hover:bg-yellow-500 hover:text-black transition-all duration-300"
          >
            Voltar
          </button>
        </div>

        {/* Título Principal */}
        <div className="px-4 mb-6">
          <h1 className="text-[#00FF00] text-2xl sm:text-3xl font-bold text-center">
            Primeiro, encontre o jogo "Aviator"
          </h1>
        </div>

        {/* Subtítulo */}
        <div className="px-4 mb-4">
          <p className="text-gray-400 text-base text-center">
            Como encontrar o Aviator dentro da plataforma
          </p>
        </div>

        {/* Card para Vídeo */}
        <div className="px-4 mb-6">
          <div className="bg-[#1A1A2E] border-2 border-gray-700 rounded-lg overflow-hidden">
            <div className="h-64 flex items-center justify-center bg-black/50">
              <p className="text-gray-500 text-center px-4">
                [Espaço reservado para vídeo]
              </p>
            </div>
          </div>
        </div>

        {/* Botão Encontrei o Jogo */}
        <div className="px-4 mb-8">
          <button 
            onClick={handleFoundGame}
            className="bg-[#00FF00] text-black font-bold w-full py-3 rounded hover:bg-[#00DD00] transition-all duration-300 active:scale-95"
          >
            ENCONTREI O JOGO
          </button>
        </div>

        <style jsx>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-slideIn {
            animation: slideIn 0.5s ease-out;
          }
        `}</style>
      </div>
    )
  }

  // Menu Principal (Etapa 3)
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header com botões Lottery e Logout */}
      <div className="flex justify-end items-center gap-2 p-4">
        <button className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded font-bold text-sm hover:bg-yellow-400 transition-colors">
          <Star className="w-4 h-4" fill="currentColor" />
          LOTTERY
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded font-bold text-sm hover:bg-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          LOGOUT
        </button>
      </div>

      {/* Seção MY STUDENTS - CENTRALIZADA */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <h2 className="text-[#00FF00] text-lg font-bold">// MY STUDENTS //</h2>
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
            LIVE
          </span>
        </div>

        {/* Linha divisória superior */}
        <div className="h-px bg-gray-700 mb-4"></div>

        {/* Cards de usuários rolantes - ALTURA REDUZIDA */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-3 min-w-max">
            {userCards.map((card, index) => (
              <div 
                key={card.id}
                className={`bg-[#1A1A2E] border border-gray-700 rounded-lg p-3 min-w-[140px] h-[70px] flex flex-col justify-center transition-all duration-500 ${
                  index === 0 ? 'animate-slideIn' : ''
                }`}
              >
                <p className="text-gray-400 text-sm mb-1">{card.username}</p>
                <p className="text-[#00FF00] text-base font-bold">{formatUSD(card.value)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Linha divisória inferior */}
        <div className="h-px bg-gray-700 mt-4 mb-6"></div>
      </div>

      {/* Seção AI SIGNALS - CENTRALIZADA E 15% MAIOR */}
      <div className="px-4">
        <h2 className="text-[#00FF00] text-[1.265rem] font-bold mb-4 text-center">// AI SIGNALS //</h2>

        {/* Card do Jogo Aviator */}
        <div className="bg-[#1A1A2E] border-2 border-gray-700 rounded-lg overflow-hidden mb-6">
          {/* Imagem do jogo (50% superior) */}
          <div className="h-48 flex items-center justify-center bg-black">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/7de9e687-f3c0-4575-aa71-3efb4a828dd9.png" 
              alt="Aviator Spribe" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Informações do jogo (50% inferior) */}
          <div className="p-4">
            <h3 className="text-white text-xl font-bold mb-3">Aviator AI PREDICTOR</h3>
            
            <div className="flex justify-between text-sm text-gray-400 mb-4">
              <span>Signals/sec: <span className="text-[#00FF00]">552</span></span>
              <span>Success rate: <span className="text-[#00FF00]">96.2%</span></span>
            </div>

            <button 
              onClick={handleActivate}
              className="bg-[#00FF00] text-black font-bold w-full py-3 rounded hover:bg-[#00DD00] transition-all duration-300 active:scale-95"
            >
              ACTIVATE
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
