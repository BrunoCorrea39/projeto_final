// src/LoginPage.jsx

import React, { useState } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Flex,
  useToast, // Adicione useToast para exibir mensagens
} from '@chakra-ui/react';
import { loginUser } from '../api/mockapi'; // Importe a função da API Mock

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Novo estado para loading
  const toast = useToast(); // Inicialize o toast

  const handleSubmit = async () => { // Torne a função assíncrona
    setIsLoading(true); // Ativa o estado de loading
    const result = await loginUser(username, password); // Chama a API Mock

    if (result.success) {
      toast({
        title: result.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onLogin(result.token, result.role); // Passe o token/role para o App.jsx
    } else {
      toast({
        title: 'Erro no Login',
        description: result.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false); // Desativa o estado de loading
  };

  return (
    <Flex
      align="center"
      justify="center"
      minH="100vh"
      bg="gray.100"
    >
      <Box
        p={8}
        w="full"
        maxW="500px"
        bg="blue.800"
        borderRadius="lg"
        boxShadow="xl"
        textAlign="center"
      >
        <VStack spacing={6}>
          <Heading as="h1" size="2xl" color="white" textTransform="uppercase" fontWeight="extrabold" letterSpacing="wide" mb={4}>
            Zé da Gota Solutions
          </Heading>

          <Input
            placeholder="Usuário"
            size="lg"
            variant="filled"
            bg="whiteAlpha.900"
            color="gray.800"
            borderRadius="md"
            _placeholder={{ color: 'gray.500' }}
            _focus={{ borderColor: 'blue.300', boxShadow: '0 0 0 1px blue.300' }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            placeholder="Senha"
            size="lg"
            type="password"
            variant="filled"
            bg="whiteAlpha.900"
            color="gray.800"
            borderRadius="md"
            _placeholder={{ color: 'gray.500' }}
            _focus={{ borderColor: 'blue.300', boxShadow: '0 0 0 1px blue.300' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            colorScheme="blue"
            size="lg"
            mt={4}
            width="full"
            bg="blue.600"
            color="white"
            _hover={{ bg: 'blue.700' }}
            onClick={handleSubmit}
            isLoading={isLoading} // Adiciona estado de loading ao botão
            loadingText="Entrando..."
          >
            Entrar
          </Button>

        </VStack>
      </Box>
    </Flex>
  );
}

export default LoginPage;