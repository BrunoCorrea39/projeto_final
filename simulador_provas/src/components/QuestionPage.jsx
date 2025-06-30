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
  useToast,
} from '@chakra-ui/react';

// --- Custom Hook para Cronômetro (tempo decrescente) ---
function useCountdown(initialTimeInMinutes, onComplete) {
  const [timeLeft, setTimeLeft] = useState(initialTimeInMinutes * 60); // Tempo em segundos
  const intervalRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    // Inicia o cronômetro apenas uma vez
    if (intervalRef.current === null && timeLeft > 0) { // Garante que não inicia se já 0
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

// --- Dados Mockados de Questões (REUTILIZE AS SUAS QUESTÕES ATUAIS) ---
const mockQuestions = [
  {
    id: 1,
    text: "QUESTÃO 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    options: ["Alternativa 1", "Alternativa 2", "Alternativa 3", "Alternativa 4", "Alternativa 5"],
    correctAnswer: "Alternativa 3",
  },
  {
    id: 2,
    text: "QUESTÃO 2: Qual é a capital do Brasil? a) Buenos Aires b) Brasília c) Madri d) Paris e) Lisboa",
    options: ["Buenos Aires", "Brasília", "Madri", "Paris", "Lisboa"],
    correctAnswer: "Brasília",
  },
  {
    id: 3,
    text: "QUESTÃO 3: Quanto é 7 multiplicado por 8? a) 49 b) 54 c) 56 d) 63 e) 72",
    options: ["49", "54", "56", "63", "72"],
    correctAnswer: "56",
  },
  {
    id: 4,
    text: "QUESTÃO 4: Quem escreveu 'Dom Quixote'? a) William Shakespeare b) Miguel de Cervantes c) Johann Wolfgang von Goethe d) Leo Tolstoy e) Charles Dickens",
    options: ["William Shakespeare", "Miguel de Cervantes", "Johann Wolfgang von Goethe", "Leo Tolstoy", "Charles Dickens"],
    correctAnswer: "Miguel de Cervantes",
  },
  {
    id: 5,
    text: "QUESTÃO 5: Qual elemento químico tem o símbolo 'O'? a) Ouro b) Oxigênio c) Osmio d) Ósmio e) Óxido",
    options: ["Ouro", "Oxigênio", "Osmio", "Ósmio", "Óxido"],
    correctAnswer: "Oxigênio",
  },
];

// Recebe o título do simulado e o tempo da prova, e a função para finalizar
function QuestionPage({ simuladoTitle = "Simulado Padrão", totalSimuladoTimeInMinutes, onFinishSimulado }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: "resposta" }
  const { timeLeft, rawTimeLeft, totalTime } = useCountdown(totalSimuladoTimeInMinutes, () => handleFinishSimulado(true));

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const toast = useToast();

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
      handleFinishSimulado(false);
    }
  };

  const handleFinishSimulado = (timeUp = false) => {
    if (timeUp || window.confirm("Você tem certeza que deseja finalizar o simulado?")) {
      // --- Lógica para calcular acertos e salvar no histórico ---
      let correctCount = 0;
      mockQuestions.forEach(q => {
        if (selectedAnswers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      });

      const totalQuestions = mockQuestions.length;
      const score = `${correctCount}/${totalQuestions}`; // Ex: "3/5"

      const historyEntry = {
        id: Date.now(), // ID único para o registro
        title: simuladoTitle, // Título do simulado
        date: new Date().toLocaleDateString(), // Data de hoje
        score: score, // Quantidade de acertos
        correctCount: correctCount,
        totalQuestions: totalQuestions,
        timeTaken: totalSimuladoTimeInMinutes * 60 - rawTimeLeft, // Tempo gasto
        completed: !timeUp, // Se foi finalizado ou desistido/tempo esgotado
      };

      // Carrega histórico existente, adiciona o novo e salva
      const existingHistory = JSON.parse(localStorage.getItem('simuladoHistory') || '[]');
      localStorage.setItem('simuladoHistory', JSON.stringify([...existingHistory, historyEntry]));

      toast({
        title: "Simulado Finalizado!",
        description: `Você acertou ${score} questões.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Chama a função onFinishSimulado para retornar à tela de seleção
      if (onFinishSimulado) {
        onFinishSimulado(historyEntry); // Passa o resultado para o App.jsx
      } else {
        window.location.reload();
      }
    }
  };


  if (!currentQuestion) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Text fontSize="xl" color="gray.500">Nenhuma questão encontrada.</Text>
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
          {mockQuestions.map((_, index) => (
            <Text
              key={index}
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