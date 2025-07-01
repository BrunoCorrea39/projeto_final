// src/SimuladoSelectionPage.jsx

import React, { useState, useEffect, useMemo } from 'react'; // Adicione useEffect
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Avatar,
  Input,
  Button,
  Spacer,
  SimpleGrid,
  Divider,
  Image,
  Spinner, // Adicione Spinner para o estado de loading
  Alert, AlertIcon, // Adicione Alert para mensagens de erro
} from '@chakra-ui/react';
import { fetchSimulados } from '../api/mockapi'; // Importe a função da API Mock

function SimuladoSelectionPage({ onStartSimulado, onShowHistory, onLogout }) {
  const userName = "Fulano Beltrano";

  const [simulados, setSimulados] = useState([]); // Estado para os simulados vindos da API
  const [isLoading, setIsLoading] = useState(true); // Estado de loading
  const [error, setError] = useState(null); // Estado para erros

  // Estados para os filtros
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');


  // useEffect para carregar os simulados da API Mock ao montar o componente
  useEffect(() => {
    const loadSimulados = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchSimulados({
          searchTerm,
          institution: selectedInstitution,
          discipline: selectedDiscipline,
          difficulty: selectedDifficulty,
        });
        if (result.success) {
          setSimulados(result.data);
        } else {
          setError(result.message || "Falha ao carregar simulados.");
        }
      } catch (err) {
        setError("Erro de rede ao carregar simulados.");
        console.error("Erro ao carregar simulados:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSimulados();
  }, [searchTerm, selectedInstitution, selectedDiscipline, selectedDifficulty]); // Recarrega quando filtros mudam

  // Funções para lidar com a seleção dos filtros (iguais, mas agora acionam o useEffect)
  const handleInstitutionClick = (institution) => {
    setSelectedInstitution(prev => prev === institution ? '' : institution);
  };
  const handleDisciplineClick = (discipline) => {
    setSelectedDiscipline(prev => prev === discipline ? '' : discipline);
  };
  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(prev => prev === difficulty ? '' : difficulty);
  };
  const handleSearchChange = (e) => { // Novo handler para a busca
    setSearchTerm(e.target.value);
  };


  // Obter listas únicas de disciplinas, instituições e dificuldades
  // Agora baseadas nos 'simulados' carregados da API, não nos mockSimuladosData
  const uniqueDisciplines = useMemo(() => {
    const allDisciplines = new Set();
    simulados.forEach(simulado => {
      simulado.disciplines.forEach(d => allDisciplines.add(d));
    });
    return Array.from(allDisciplines).sort();
  }, [simulados]);

  const uniqueInstitutions = useMemo(() => {
    const allInstitutions = new Set(simulados.map(s => s.institution));
    return Array.from(allInstitutions).sort();
  }, [simulados]);

  const uniqueDifficulties = ['Fácil', 'Médio', 'Difícil'];


  return (
    <Flex minH="100vh" bg="gray.100">

      {/* Sidebar - Fixa e com largura definida */}
      <Box
        bg="gray.700"
        w="250px"
        p={4}
        color="white"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <VStack spacing={6} align="stretch">
          {/* Avatar e Nome do Usuário */}
          <HStack spacing={3} mb={4}>
            <Avatar size="md" name={userName} src="https://via.placeholder.com/50" />
            <Text fontSize="lg" fontWeight="bold">{userName}</Text>
          </HStack>

          <Divider borderColor="gray.600" />

          {/* Seção de Instituições */}
          <Box>
            <Heading size="sm" mb={2} textTransform="uppercase">Instituição</Heading>
            <VStack align="start" spacing={1}>
              {uniqueInstitutions.map(institution => (
                <Text
                  key={institution}
                  cursor="pointer"
                  _hover={{ color: 'blue.300' }}
                  onClick={() => handleInstitutionClick(institution)}
                  fontWeight={selectedInstitution === institution ? "bold" : "normal"}
                  color={selectedInstitution === institution ? "blue.300" : "white"}
                >
                  • {institution}
                </Text>
              ))}
            </VStack>
          </Box>

          <Divider borderColor="gray.600" />


          {/* Seção de Disciplinas */}
          <Box>
            <Heading size="sm" mb={2} textTransform="uppercase">Disciplinas</Heading>
            <VStack align="start" spacing={1}>
              {uniqueDisciplines.map(discipline => (
                <Text
                  key={discipline}
                  cursor="pointer"
                  _hover={{ color: 'blue.300' }}
                  onClick={() => handleDisciplineClick(discipline)}
                  fontWeight={selectedDiscipline === discipline ? "bold" : "normal"}
                  color={selectedDiscipline === discipline ? "blue.300" : "white"}
                >
                  • {discipline}
                </Text>
              ))}
            </VStack>
          </Box>

          <Divider borderColor="gray.600" />

          {/* Seção de Dificuldade */}
          <Box>
            <Heading size="sm" mb={2} textTransform="uppercase">Dificuldade</Heading>
            <VStack align="start" spacing={1}>
              {uniqueDifficulties.map(difficulty => (
                <Text
                  key={difficulty}
                  cursor="pointer"
                  _hover={{ color: 'blue.300' }}
                  onClick={() => handleDifficultyClick(difficulty)}
                  fontWeight={selectedDifficulty === difficulty ? "bold" : "normal"}
                  color={selectedDifficulty === difficulty ? "blue.300" : "white"}
                >
                  • {difficulty}
                </Text>
              ))}
            </VStack>
          </Box>

          <Divider borderColor="gray.600" />

          {/* Botão Histórico */}
          <Button variant="ghost" colorScheme="blue" justifyContent="flex-start" _hover={{ bg: 'blue.700' }} onClick={onShowHistory}>
            HISTÓRICO
          </Button>
        </VStack>

        <Spacer />

        {/* Botão Sair */}
        <Button colorScheme="red" mt={8} onClick={onLogout}>
          SAIR
        </Button>
      </Box>

      {/* Área de Conteúdo Principal */}
      <Box flex="1" p={8} bg="blue.800" color="white">
        {/* Barra de Busca */}
        <HStack mb={8}>
          <Input
            placeholder="Buscar simulado..."
            bg="whiteAlpha.900"
            color="gray.800"
            _placeholder={{ color: 'gray.500' }}
            value={searchTerm}
            onChange={handleSearchChange} // Usa o novo handler
          />
        </HStack>

        {error && ( // Exibe mensagem de erro se houver
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        {isLoading ? ( // Exibe spinner enquanto carrega
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" color="white" />
          </Flex>
        ) : simulados.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {simulados.map(simulado => (
              <Box key={simulado.id} bg="white" p={4} borderRadius="lg" boxShadow="md" color="gray.800">
                <VStack spacing={3} align="center">
                  <Image src={simulado.image} alt={simulado.title} boxSize="150px" objectFit="contain" mb={2} />
                  <Heading size="md" textAlign="center">{simulado.title}</Heading>
                  <VStack align="flex-start" spacing={1} fontSize="sm">
                    <Text>• Prova {simulado.title.includes('Enem') ? simulado.title.split(' ')[2] : ''}</Text> {/* Adapta para ENEM */}
                    <Text>• {simulado.subject}</Text>
                    <Text>• {simulado.duration}</Text>
                    <Text>• Instituição: {simulado.institution}</Text>
                    <Text>• Dificuldade: {simulado.difficulty}</Text>
                  </VStack>
                  <Button
                    colorScheme="blue"
                    mt={4}
                    width="full"
                    onClick={() => onStartSimulado(simulado.title, simulado.timeInMinutes, simulado.id)} // Adiciona simulado.id
                  >
                    INICIAR
                  </Button>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Flex justify="center" align="center" h="200px">
            <Text fontSize="xl" color="whiteAlpha.700">Nenhum simulado encontrado com os filtros aplicados.</Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}

export default SimuladoSelectionPage;