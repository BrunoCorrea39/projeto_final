// src/App.jsx

import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import SimuladoSelectionPage from './components/SimuladoSelectionPage';
import QuestionPage from './components/QuestionPage';
import HistoryPage from './components/HistoryPage'; // Importe a nova página de histórico

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [simuladoStarted, setSimuladoStarted] = useState(false);
  const [simuladoTime, setSimuladoTime] = useState(0); // Tempo do simulado em minutos
  const [currentSimuladoTitle, setCurrentSimuladoTitle] = useState(''); // Novo: Título do simulado
  const [showHistory, setShowHistory] = useState(false); // Novo estado para mostrar histórico

  const handleLogin = (username, password) => {
    if (username && password) {
      setIsLoggedIn(true);
    } else {
      alert('Por favor, insira usuário e senha.');
    }
  };

  const handleLogout = () => { // Novo: Função para logout
    setIsLoggedIn(false);
    setSimuladoStarted(false);
    setSimuladoTime(0);
    setCurrentSimuladoTitle('');
    setShowHistory(false);
    // Opcional: Limpar histórico do localStorage no logout, dependendo da regra de negócio
    // localStorage.removeItem('simuladoHistory');
  };

  const startSimulado = (title, timeInMinutes) => { // Agora recebe o título
    setCurrentSimuladoTitle(title); // Salva o título do simulado
    setSimuladoTime(timeInMinutes);
    setSimuladoStarted(true);
    setShowHistory(false); // Garante que histórico está oculto
  };

  const finishSimulado = (historyEntry) => { // Recebe o objeto do histórico
    console.log("Simulado finalizado com entrada no histórico:", historyEntry);
    setSimuladoStarted(false); // Retorna à tela de seleção
    setSimuladoTime(0);
    setCurrentSimuladoTitle('');
    // Poderia mostrar a tela de resultados aqui, se existisse
  };

  const goToHistory = () => { // Novo: Função para ir para o histórico
    setShowHistory(true);
    setSimuladoStarted(false); // Garante que simulado não está rodando
  };

  const goBackToSelection = () => { // Novo: Função para voltar da histórico
    setShowHistory(false);
  };


  // Lógica de renderização principal
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  } else if (showHistory) { // Se for para mostrar o histórico
    return <HistoryPage onGoBack={goBackToSelection} />;
  } else if (simuladoStarted) { // Se um simulado foi iniciado
    return <QuestionPage
             simuladoTitle={currentSimuladoTitle} // Passa o título
             totalSimuladoTimeInMinutes={simuladoTime}
             onFinishSimulado={finishSimulado}
           />;
  } else { // Se logado, mas nenhum simulado iniciado e não está no histórico
    return <SimuladoSelectionPage onStartSimulado={startSimulado} onShowHistory={goToHistory} onLogout={handleLogout} />;
  }
}

export default App;