// src/SimuladoSelectionPage.jsx

import React, { useState, useMemo } from 'react';
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
} from '@chakra-ui/react';

// --- Dados Mockados (USE A VERSÃO ATUALIZADA DO PASSO ANTERIOR) ---
const mockSimulados = [
  {
    id: 1,
    title: 'Prova Enem 2018',
    image: 'https://via.placeholder.com/200x250/FF0000/FFFFFF?text=ENEM+2018',
    subject: 'Matemática',
    duration: '4h30min',
    timeInMinutes: 270,
    institution: 'ENEM',
    disciplines: ['Matemática', 'Ciências da Natureza', 'Ciências Humanas', 'Linguagens'],
    difficulty: 'Médio',
  },
  {
    id: 2,
    title: 'Prova Enem 2019',
    image: 'https://via.placeholder.com/200x250/00FF00/FFFFFF?text=ENEM+2019',
    subject: 'Português',
    duration: '4h30min',
    timeInMinutes: 270,
    institution: 'ENEM',
    disciplines: ['Português', 'Linguagens', 'Ciências Humanas'],
    difficulty: 'Médio',
  },
  {
    id: 3,
    title: 'Prova Enem 2020',
    image: 'https://via.placeholder.com/200x250/0000FF/FFFFFF?text=ENEM+2020',
    subject: 'Física',
    duration: '4h30min',
    timeInMinutes: 270,
    institution: 'ENEM',
    disciplines: ['Física', 'Ciências da Natureza'],
    difficulty: 'Difícil',
  },
  {
    id: 4,
    title: 'Vestibular Fuvest 2023',
    image: 'https://via.placeholder.com/200x250/800080/FFFFFF?text=FUVEST+2023',
    subject: 'História',
    duration: '5h',
    timeInMinutes: 300,
    institution: 'USP (Fuvest)',
    disciplines: ['História', 'Geografia', 'Português'],
    difficulty: 'Difícil',
  },
  {
    id: 5,
    title: 'Vestibular Unicamp 2022',
    image: 'https://via.placeholder.com/200x250/FFA500/FFFFFF?text=UNICAMP+2022',
    subject: 'Química',
    duration: '4h',
    timeInMinutes: 240,
    institution: 'UNICAMP',
    disciplines: ['Química', 'Biologia', 'Matemática'],
    difficulty: 'Médio',
  },
  {
    id: 6,
    title: 'Vestibular UFPR 2024',
    image: 'https://via.placeholder.com/200x250/008000/FFFFFF?text=UFPR+2024',
    subject: 'Biologia',
    duration: '3h',
    timeInMinutes: 180,
    institution: 'UFPR',
    disciplines: ['Biologia', 'Geografia', 'Inglês'],
    difficulty: 'Fácil',
  },
  {
    id: 7,
    title: 'Simulado de Português Básico',
    image: 'https://via.placeholder.com/200x250/C0C0C0/000000?text=Portugu%C3%AAs',
    subject: 'Português',
    duration: '1h',
    timeInMinutes: 60,
    institution: 'Geral',
    disciplines: ['Português'],
    difficulty: 'Fácil',
  },
  {
    id: 8,
    title: 'Desafio de Matemática Avançada',
    image: 'https://via.placeholder.com/200x250/4B0082/FFFFFF?text=Matem%C3%A1tica',
    subject: 'Matemática',
    duration: '2h',
    timeInMinutes: 120,
    institution: 'Geral',
    disciplines: ['Matemática'],
    difficulty: 'Difícil',
  },
];

// Agora recebe as props para iniciar simulado, mostrar histórico e logout
function SimuladoSelectionPage({ onStartSimulado, onShowHistory, onLogout }) {
  const userName = "Fulano Beltrano";

  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleInstitutionClick = (institution) => {
    setSelectedInstitution(prev => prev === institution ? '' : institution);
  };
  const handleDisciplineClick = (discipline) => {
    setSelectedDiscipline(prev => prev === discipline ? '' : discipline);
  };
  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(prev => prev === difficulty ? '' : difficulty);
  };

  const uniqueDisciplines = useMemo(() => {
    const allDisciplines = new Set();
    mockSimulados.forEach(simulado => {
      simulado.disciplines.forEach(d => allDisciplines.add(d));
    });
    return Array.from(allDisciplines).sort();
  }, []);

  const uniqueInstitutions = useMemo(() => {
    const allInstitutions = new Set(mockSimulados.map(s => s.institution));
    return Array.from(allInstitutions).sort();
  }, []);

  const uniqueDifficulties = ['Fácil', 'Médio', 'Difícil'];

  const filteredSimulados = useMemo(() => {
    return mockSimulados.filter(simulado => {
      const matchesSearch = searchTerm
        ? simulado.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          simulado.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          simulado.institution.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesInstitution = selectedInstitution
        ? simulado.institution === selectedInstitution
        : true;

      const matchesDiscipline = selectedDiscipline
        ? simulado.disciplines.includes(selectedDiscipline)
        : true;

      const matchesDifficulty = selectedDifficulty
        ? simulado.difficulty === selectedDifficulty
        : true;

      return matchesSearch && matchesInstitution && matchesDiscipline && matchesDifficulty;
    });
  }, [searchTerm, selectedInstitution, selectedDiscipline, selectedDifficulty]);


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

          {/* Botão Histórico (agora com onClick) */}
          <Button variant="ghost" colorScheme="blue" justifyContent="flex-start" _hover={{ bg: 'blue.700' }} onClick={onShowHistory}> {/* Adicionado onClick */}
            HISTÓRICO
          </Button>
        </VStack>

        <Spacer />

        {/* Botão Sair (agora com onClick) */}
        <Button colorScheme="red" mt={8} onClick={onLogout}> {/* Adicionado onClick */}
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button colorScheme="blue" bg="blue.600" _hover={{ bg: 'blue.700' }} onClick={() => {}}>BUSCAR</Button>
        </HStack>

        {/* Grade de Cards de Simulado */}
        {filteredSimulados.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {filteredSimulados.map(simulado => (
              <Box key={simulado.id} bg="white" p={4} borderRadius="lg" boxShadow="md" color="gray.800">
                <VStack spacing={3} align="center">
                  <Image src={simulado.image} alt={simulado.title} boxSize="150px" objectFit="contain" mb={2} />
                  <Heading size="md" textAlign="center">{simulado.title}</Heading>
                  <VStack align="flex-start" spacing={1} fontSize="sm">
                    <Text>• Prova {simulado.title.split(' ')[2]}</Text>
                    <Text>• {simulado.subject}</Text>
                    <Text>• {simulado.duration}</Text>
                    <Text>• Instituição: {simulado.institution}</Text>
                    <Text>• Dificuldade: {simulado.difficulty}</Text>
                  </VStack>
                  <Button
                    colorScheme="blue"
                    mt={4}
                    width="full"
                    onClick={() => onStartSimulado(simulado.title, simulado.timeInMinutes)} // Passa o título e tempo
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