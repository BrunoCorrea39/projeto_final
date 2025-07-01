// src/components/SimuladoSelectionPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
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
  // Removido: Image (não é mais importado se não for usado)
  Spinner,
  Alert, AlertIcon,
} from '@chakra-ui/react';
import axios from 'axios';
import { fetchSimulados } from '../api/mockApi';

const SIMULADOS_API_URL = 'http://127.0.0.1:8000/simulados';

function SimuladoSelectionPage({ onStartSimulado, onShowHistory, onLogout, userName }) {
  const [simulados, setSimulados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // --- NOVA FUNÇÃO: Para obter a parte do nome antes do @ ---
  const getDisplayName = (email) => {
    if (!email || typeof email !== 'string') return 'Usuário';
    return email.split('@')[0];
  };

  const displayName = getDisplayName(userName); // Usa a nova função para o nome de exibição

  useEffect(() => {
    const loadSimulados = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) {
          setError("Token de autenticação não encontrado. Faça login novamente.");
          setIsLoading(false);
          onLogout();
          return;
        }

        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('search_term', searchTerm);
        if (selectedInstitution) queryParams.append('institution', selectedInstitution);
        if (selectedDiscipline) queryParams.append('discipline', selectedDiscipline);
        if (selectedDifficulty) queryParams.append('difficulty', selectedDifficulty);

        const url = `${SIMULADOS_API_URL}?${queryParams.toString()}`;

        // Substitua por chamada Axios real quando a API estiver pronta
        // const response = await axios.get(url, { headers: { 'Authorization': userToken } });
        // const apiSimulados = response.data;
        // const mappedSimulados = apiSimulados.map(s => ({
        //   id: s.id,
        //   title: s.titulo,
        //   subject: s.disciplinas && s.disciplinas.length > 0 ? s.disciplinas[0] : 'Geral',
        //   duration: `${Math.floor(s.tempo_em_minutos / 60)}h${s.tempo_em_minutos % 60}min`,
        //   timeInMinutes: s.tempo_em_minutos,
        //   institution: s.instituicao,
        //   disciplines: s.disciplinas,
        //   difficulty: s.dificuldade,
        // }));
        // setSimulados(mappedSimulados);

        // Por enquanto, continua usando a mockApi sem imagem
        const result = await fetchSimulados({
          searchTerm,
          institution: selectedInstitution,
          discipline: selectedDiscipline,
          difficulty: selectedDifficulty,
        });
        if (result.success) {
            setSimulados(result.data.map(s => {
                const { image, ...rest } = s;
                return rest;
            }));
        } else {
          setError(result.message || "Falha ao carregar simulados (API Mock).");
        }


      } catch (err) {
        let errorMessage = "Erro ao carregar simulados.";
        if (err.response) {
          errorMessage = err.response.data.detail || err.response.data.message || errorMessage;
          if (err.response.status === 401) {
            errorMessage = "Sessão expirada ou não autorizada. Faça login novamente.";
            onLogout();
          }
        } else if (err.request) {
          errorMessage = "Nenhuma resposta do servidor de simulados.";
        }
        setError(errorMessage);
        console.error("Erro ao carregar simulados:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (localStorage.getItem('userToken')) {
      loadSimulados();
    } else {
      setIsLoading(false);
      setError("Faça login para ver os simulados.");
    }
  }, [searchTerm, selectedInstitution, selectedDiscipline, selectedDifficulty, onLogout]);


  const handleInstitutionClick = (institution) => {
    setSelectedInstitution(prev => prev === institution ? '' : institution);
  };
  const handleDisciplineClick = (discipline) => {
    setSelectedDiscipline(prev => prev === discipline ? '' : discipline);
  };
  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(prev => prev === difficulty ? '' : difficulty);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const uniqueDisciplines = useMemo(() => {
    const allDisciplines = new Set();
    simulados.forEach(simulado => {
      if (simulado.disciplines && Array.isArray(simulado.disciplines)) {
        simulado.disciplines.forEach(d => allDisciplines.add(d));
      }
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
            {/* Usa displayName para o nome e para o gerador de avatar */}
            <Avatar size="md" name={displayName} src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=50`} />
            <Text fontSize="lg" fontWeight="bold">{displayName}</Text> {/* Usa displayName aqui */}
          </HStack>

          <Divider borderColor="gray.600" />

          {/* ... restante da sidebar (filtros, histórico, sair) ... */}

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
            onChange={handleSearchChange}
          />
          <Button colorScheme="blue" bg="blue.600" _hover={{ bg: 'blue.700' }} onClick={() => {}}>BUSCAR</Button>
        </HStack>

        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" color="white" />
          </Flex>
        ) : simulados.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {simulados.map(simulado => (
              <Box key={simulado.id} bg="white" p={4} borderRadius="lg" boxShadow="md" color="gray.800">
                <VStack spacing={3} align="center">
                  {/* Removido: <Image src={simulado.image} alt={simulado.title} boxSize="150px" objectFit="contain" mb={2} /> */}
                  <Heading size="md" textAlign="center">{simulado.title}</Heading>
                  <VStack align="flex-start" spacing={1} fontSize="sm">
                    <Text>• Prova {simulado.title.includes('Enem') ? simulado.title.split(' ')[2] : ''}</Text>
                    <Text>• {simulado.subject}</Text>
                    <Text>• {simulado.duration}</Text>
                    <Text>• Instituição: {simulado.institution}</Text>
                    <Text>• Dificuldade: {simulado.difficulty}</Text>
                  </VStack>
                  <Button
                    colorScheme="blue"
                    mt={4}
                    width="full"
                    onClick={() => onStartSimulado(simulado.title, simulado.timeInMinutes, simulado.id)}
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