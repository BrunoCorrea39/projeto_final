// src/App.jsx

import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import SimuladoSelectionPage from './components/SimuladoSelectionPage';
import QuestionPage from './components/QuestionPage';
import HistoryPage from './components/HistoryPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('student');
  const [simuladoStarted, setSimuladoStarted] = useState(false);
  const [simuladoTime, setSimuladoTime] = useState(0); // Este é o estado que guarda o tempo
  const [currentSimuladoTitle, setCurrentSimuladoTitle] = useState('');
  const [currentSimuladoId, setCurrentSimuladoId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleLogin = (token, role = 'student') => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('student');
    setSimuladoStarted(false);
    setSimuladoTime(0);
    setCurrentSimuladoTitle('');
    setCurrentSimuladoId(null);
    setShowHistory(false);
  };

  const startSimulado = (title, timeInMinutes, id) => {
    setCurrentSimuladoTitle(title);
    setSimuladoTime(timeInMinutes); // Atualiza o estado simuladoTime
    setCurrentSimuladoId(id);
    setSimuladoStarted(true);
    setShowHistory(false);
  };

  const finishSimulado = (historyEntry) => {
    console.log("Simulado finalizado com entrada no histórico:", historyEntry);
    setSimuladoStarted(false);
    setSimuladoTime(0);
    setCurrentSimuladoTitle('');
    setCurrentSimuladoId(null);
  };

  const goToHistory = () => {
    setShowHistory(true);
    setSimuladoStarted(false);
  };

  const goBackToSelection = () => {
    setShowHistory(false);
  };


  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  } else if (showHistory) {
    return <HistoryPage onGoBack={goBackToSelection} />;
  } else if (simuladoStarted) {
    return <QuestionPage
             simuladoTitle={currentSimuladoTitle}
             totalSimuladoTimeInMinutes={simuladoTime} // <--- CORREÇÃO AQUI: usar o estado 'simuladoTime'
             simuladoId={currentSimuladoId}
             onFinishSimulado={finishSimulado}
           />;
  } else {
    return <SimuladoSelectionPage onStartSimulado={startSimulado} onShowHistory={goToHistory} onLogout={handleLogout} />;
  }
}

export default App;