import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
// import axios from 'axios'; // Importe se for usar API real para histórico

// URL da API para histórico (Ainda mockada, aguardando API real)
// const HISTORY_API_URL = 'http://127.0.0.1:8000/historico'; // Exemplo de URL real

function HistoryPage({ onGoBack }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Para futuro loading da API real
  const [error, setError] = useState(null); // Para futuro erro da API real

  useEffect(() => {
    // Por enquanto, carrega do localStorage. Quando a API real estiver pronta, use axios.get
    // const loadHistory = async () => {
    //   setIsLoading(true);
    //   setError(null);
    //   try {
    //     const userToken = localStorage.getItem('userToken');
    //     const response = await axios.get(HISTORY_API_URL, {
    //       headers: { 'Authorization': userToken }
    //     });
    //     // Adapte a resposta da API (ex: response.data para setHistory)
    //     setHistory(response.data.reverse());
    //   } catch (err) {
    //     setError("Erro ao carregar histórico da API.");
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // if (localStorage.getItem('userToken')) {
    //   loadHistory();
    // } else {
    //   setError("Faça login para ver seu histórico.");
    //   setIsLoading(false);
    // }

    const storedHistory = JSON.parse(localStorage.getItem('simuladoHistory') || '[]');
    setHistory(storedHistory.reverse()); // Exibe os mais recentes primeiro
  }, []);

  const clearHistory = () => {
    if (window.confirm("Você tem certeza que deseja limpar todo o histórico?")) {
      localStorage.removeItem('simuladoHistory');
      setHistory([]);
      // Se fosse API real, você faria uma chamada DELETE aqui
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    let parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}min`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
    return parts.join(' ');
  };

  return (
    <Flex minH="100vh" bg="gray.100">
      {/* Sidebar Simples para voltar */}
      <Box
        bg="gray.700"
        w="200px"
        p={4}
        color="white"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <VStack spacing={4} align="stretch">
          <Button colorScheme="blue" onClick={onGoBack}>
            ← Voltar
          </Button>
          <Button colorScheme="red" onClick={clearHistory}>
            Limpar Histórico
          </Button>
        </VStack>
      </Box>

      {/* Área de Conteúdo Principal do Histórico */}
      <Box flex="1" p={8} bg="blue.800" color="white" overflowY="auto">
        <Heading as="h1" size="xl" mb={8} textAlign="center">Histórico de Simulados</Heading>

        {isLoading ? (
          <Flex justify="center" align="center" minH="200px">
            <Spinner size="xl" color="white" />
          </Flex>
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        ) : history.length === 0 ? (
          <Flex justify="center" align="center" minH="200px">
            <Text fontSize="lg" color="whiteAlpha.700">Nenhum simulado realizado ainda.</Text>
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {history.map((entry) => (
              <Box key={entry.id} bg="white" p={5} borderRadius="lg" boxShadow="md" color="gray.800">
                <VStack align="start" spacing={2}>
                  <Heading size="md">{entry.title}</Heading>
                  <Text fontSize="sm" color="gray.600">Data: {entry.date}</Text>
                  <Divider />
                  <HStack justify="space-between" w="full">
                    <Text fontWeight="bold">Acertos:</Text>
                    <Text fontSize="lg" color="green.600" fontWeight="bold">{entry.score}</Text>
                  </HStack>
                  <Text>Total de Questões: {entry.totalQuestions}</Text>
                  <Text>Status: {entry.completed ? "Finalizado" : "Desistido/Tempo Esgotado"}</Text>
                  <Text>Tempo Gasto: {formatTime(entry.timeTaken)}</Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Flex>
  );
}

export default HistoryPage;