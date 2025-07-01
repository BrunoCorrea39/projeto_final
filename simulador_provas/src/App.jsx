// src/App.jsx

import React, { useState, useEffect } from 'react';
import { Flex, Spinner, Text } from '@chakra-ui/react'; // <--- ADICIONE ESTA LINHA
import LoginPage from './components/LoginPage';
import SimuladoSelectionPage from './components/SimuladoSelectionPage';
import QuestionPage from './components/QuestionPage';
import HistoryPage from './components/HistoryPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState('');
  const [userRole, setUserRole] = useState('student');
  const [simuladoStarted, setSimuladoStarted] = useState(false);
  const [simuladoTime, setSimuladoTime] = useState(0);
  const [currentSimuladoTitle, setCurrentSimuladoTitle] = useState('');
  const [currentSimuladoId, setCurrentSimuladoId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const [initialAuthCheckComplete, setInitialAuthCheckComplete] = useState(false);

  useEffect(() => {
    console.log("App.jsx: Iniciando useEffect para verificação inicial de autenticação.");
    const token = localStorage.getItem('userToken');
    const storedUserName = localStorage.getItem('userName');

    if (token) {
      console.log("App.jsx: Token encontrado no localStorage. Definindo isLoggedIn para true.");
      setIsLoggedIn(true);
      setLoggedInUserName(storedUserName || 'Usuário');
      setUserRole(localStorage.getItem('userRole') || 'student');
    } else {
      console.log("App.jsx: Nenhum token encontrado no localStorage. isLoggedIn permanece false.");
      setIsLoggedIn(false);
    }
    setInitialAuthCheckComplete(true);
    console.log("App.jsx: Verificação inicial de autenticação completa.");
  }, []);


  const handleLogin = (token, username) => {
    console.log("App.jsx: handleLogin chamado. Definindo isLoggedIn para true e nome do usuário.");
    setIsLoggedIn(true);
    setLoggedInUserName(username);
    localStorage.setItem('userName', username);
    localStorage.setItem('userToken', token);
    setUserRole('student');
  };

  const handleLogout = () => {
    console.log("App.jsx: handleLogout chamado. Resetando estados e limpando localStorage.");
    setIsLoggedIn(false);
    setLoggedInUserName('');
    setUserRole('student');
    setSimuladoStarted(false);
    setSimuladoTime(0);
    setCurrentSimuladoTitle('');
    setCurrentSimuladoId(null);
    setShowHistory(false);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
  };

  const startSimulado = (title, timeInMinutes, id) => {
    console.log("App.jsx: startSimulado chamado. Iniciando simulado ID:", id);
    setCurrentSimuladoTitle(title);
    setSimuladoTime(timeInMinutes);
    setCurrentSimuladoId(id);
    setSimuladoStarted(true);
    setShowHistory(false);
  };

  const finishSimulado = (historyEntry) => {
    console.log("App.jsx: finishSimulado chamado. Retornando à seleção de simulados.");
    setSimuladoStarted(false);
    setSimuladoTime(0);
    setCurrentSimuladoTitle('');
    setCurrentSimuladoId(null);
  };

  const goToHistory = () => {
    console.log("App.jsx: goToHistory chamado. Exibindo histórico.");
    setShowHistory(true);
    setSimuladoStarted(false);
  };

  const goBackToSelection = () => {
    console.log("App.jsx: goBackToSelection chamado. Voltando à seleção de simulados.");
    setShowHistory(false);
  };


  // Lógica de renderização
  if (!initialAuthCheckComplete) {
    console.log("App.jsx: Renderizando tela de carregamento inicial (Auth Check).");
    return (
      // AQUI ESTÃO OS COMPONENTES QUE NÃO ESTAVAM IMPORTADOS
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="blue.500" mr={4} />
        <Text fontSize="xl" color="gray.500">Iniciando aplicação...</Text>
      </Flex>
    );
  }

  if (!isLoggedIn) {
    console.log("App.jsx: Usuário não logado. Renderizando LoginPage.");
    return <LoginPage onLogin={handleLogin} />;
  }

  if (showHistory) {
    console.log("App.jsx: Usuário logado, mostrando histórico. Renderizando HistoryPage.");
    return <HistoryPage onGoBack={goBackToSelection} />;
  }

  if (simuladoStarted) {
    console.log("App.jsx: Usuário logado, simulado iniciado. Renderizando QuestionPage.");
    return <QuestionPage
             simuladoTitle={currentSimuladoTitle}
             totalSimuladoTimeInMinutes={simuladoTime}
             simuladoId={currentSimuladoId}
             onFinishSimulado={finishSimulado}
           />;
  }

  console.log("App.jsx: Usuário logado, nada mais. Renderizando SimuladoSelectionPage.");
  return <SimuladoSelectionPage
           onStartSimulado={startSimulado}
           onShowHistory={goToHistory}
           onLogout={handleLogout}
           userName={loggedInUserName}
         />;
}

export default App;