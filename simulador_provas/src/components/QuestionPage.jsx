// src/QuestionPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  RadioGroup,
  Radio,
  Progress,
  Spinner, // Adicione Spinner
  Alert, AlertIcon, // Adicione Alert
  useToast,
} from '@chakra-ui/react';
import { fetchQuestionsForSimulado, submitSimuladoAnswers } from '../api/mockApi';

// --- Custom Hook para Cronômetro (o mesmo que já está aí) ---
function useCountdown(initialTimeInMinutes, onComplete) {
  const [timeLeft, setTimeLeft] = useState(initialTimeInMinutes * 60);
  const intervalRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (intervalRef.current === null && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            onComplete && onComplete();
            toast({
              title: 'Tempo Esgotado!',
              description: "O simulado foi finalizado automaticamente.",
              status: 'info',
              duration: 5000,
              isClosable: true,
            });
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [initialTimeInMinutes, onComplete, toast, timeLeft]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft: formatTime(timeLeft),
    rawTimeLeft: timeLeft,
    totalTime: initialTimeInMinutes * 60,
  };
}

// O componente agora recebe o simuladoId também
function QuestionPage({ simuladoTitle, totalSimuladoTimeInMinutes, simuladoId, onFinishSimulado }) {
  const [questions, setQuestions] = useState([]); // Estado para as questões vindas da API
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true); // Novo estado de loading
  const [errorQuestions, setErrorQuestions] = useState(null); // Novo estado de erro
  const toast = useToast();

  // Carrega as questões da API Mock ao montar o componente
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoadingQuestions(true);
      setErrorQuestions(null);
      try {
        const result = await fetchQuestionsForSimulado(simuladoId); // Chama a API Mock
        if (result.success) {
          setQuestions(result.data.questions);
          // Opcional: Você pode querer salvar o simulado completo retornado pela API aqui também
        } else {
          setErrorQuestions(result.message || "Falha ao carregar questões.");
        }
      } catch (err) {
        setErrorQuestions("Erro de rede ao carregar questões.");
        console.error("Erro ao carregar questões:", err);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    if (simuladoId) {
      loadQuestions();
    }
  }, [simuladoId]); // Recarrega questões se o ID do simulado mudar


  // Apenas inicia o cronômetro se as questões estiverem carregadas
  const { timeLeft, rawTimeLeft, totalTime } = useCountdown(totalSimuladoTimeInMinutes, () => handleFinishSimulado(true));

  const currentQuestion = questions[currentQuestionIndex];


  const handleAnswerChange = (value) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: value,
    });
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleGiveUp = () => {
    if (window.confirm("Você tem certeza que deseja desistir do simulado? Seu progresso não será salvo.")) {
      // Quando desiste, podemos enviar respostas vazias ou parciais para registro se necessário
      handleFinishSimulado(false, true); // Passa true para isGivingUp
    }
  };

  const handleFinishSimulado = async (timeUp = false, isGivingUp = false) => { // Tornar async
    if (timeUp || isGivingUp || window.confirm("Você tem certeza que deseja finalizar o simulado?")) {
      // --- Envia respostas para a API Mock e processa o resultado ---
      const submitResult = await submitSimuladoAnswers(simuladoId, selectedAnswers); // Chama a API Mock

      if (submitResult.success) {
        const { correctCount, totalQuestions, score } = submitResult.data;

        const historyEntry = {
          id: Date.now(),
          title: simuladoTitle,
          date: new Date().toLocaleDateString(),
          score: score,
          correctCount: correctCount,
          totalQuestions: totalQuestions,
          timeTaken: totalSimuladoTimeInMinutes * 60 - rawTimeLeft,
          completed: !isGivingUp && !timeUp, // Se foi finalizado pelo usuário e não por tempo/desistência
        };

        // Carrega histórico existente, adiciona o novo e salva (mantendo local storage por enquanto)
        const existingHistory = JSON.parse(localStorage.getItem('simuladoHistory') || '[]');
        localStorage.setItem('simuladoHistory', JSON.stringify([...existingHistory, historyEntry]));

        toast({
          title: "Simulado Finalizado!",
          description: `Você acertou ${score} questões.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        if (onFinishSimulado) {
          onFinishSimulado(historyEntry);
        }
      } else {
        toast({
          title: "Erro ao Finalizar",
          description: submitResult.message || "Não foi possível processar suas respostas.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };


  if (isLoadingQuestions) { // Exibe loading enquanto as questões carregam
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="blue.500" mr={4} />
        <Text fontSize="xl" color="gray.500">Carregando questões...</Text>
      </Flex>
    );
  }

  if (errorQuestions) { // Exibe erro se não conseguir carregar as questões
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Alert status="error">
          <AlertIcon />
          Erro: {errorQuestions}
        </Alert>
      </Flex>
    );
  }

  if (!currentQuestion || questions.length === 0) { // Se não houver questões após o carregamento
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Text fontSize="xl" color="gray.500">Nenhuma questão encontrada para este simulado.</Text>
      </Flex>
    );
  }

  const timerProgress = (rawTimeLeft / totalTime) * 100;

  return (
    <Flex minH="100vh" bg="gray.100">

      {/* Sidebar - Navegação de Questões */}
      <Box
        bg="gray.700"
        w="200px"
        p={4}
        color="white"
        display="flex"
        flexDirection="column"
      >
        <Heading size="md" mb={6} textTransform="uppercase">Questões</Heading>
        <VStack align="start" spacing={2} overflowY="auto" maxH="calc(100vh - 120px)">
          {questions.map((q, index) => ( // Mapeia as questões carregadas da API
            <Text
              key={q.id} // Usa o ID da questão como key
              cursor="pointer"
              fontWeight={currentQuestionIndex === index ? "bold" : "normal"}
              color={currentQuestionIndex === index ? "blue.300" : "white"}
              _hover={{ color: 'blue.300' }}
              onClick={() => navigateToQuestion(index)}
            >
              QUESTÃO {index + 1}
            </Text>
          ))}
        </VStack>
      </Box>

      {/* Área de Conteúdo Principal da Questão */}
      <Flex flex="1" flexDirection="column" p={8} bg="blue.800" color="white">
        {/* Cronômetro e Barra de Progresso */}
        <Box mb={6} textAlign="right">
          <Text fontSize="3xl" fontWeight="bold">Tempo Restante: {timeLeft}</Text>
          <Progress value={timerProgress} size="sm" colorScheme="orange" mt={2} />
        </Box>

        {/* Conteúdo da Questão */}
        <Box flex="1" bg="white" p={6} borderRadius="lg" boxShadow="xl" color="gray.800">
          <Heading size="lg" mb={4}>{simuladoTitle}: QUESTÃO {currentQuestion.id}</Heading>
          <Text fontSize="lg" mb={6}>{currentQuestion.text}</Text>

          {/* Opções de Resposta */}
          <RadioGroup onChange={handleAnswerChange} value={selectedAnswers[currentQuestion.id] || ""}>
            <VStack align="start" spacing={4}>
              {currentQuestion.options.map((option, index) => (
                <Radio key={index} value={option} colorScheme="blue">
                  <Text fontSize="md">{option}</Text>
                </Radio>
              ))}
            </VStack>
          </RadioGroup>
        </Box>

        {/* Botões de Ação */}
        <HStack mt={8} justify="space-between" width="full">
          <Button colorScheme="red" size="lg" onClick={handleGiveUp}>DESISTIR</Button>
          <Button colorScheme="green" size="lg" onClick={() => handleFinishSimulado(false)}>FINALIZAR</Button>
        </HStack>
      </Flex>
    </Flex>
  );
}

export default QuestionPage;