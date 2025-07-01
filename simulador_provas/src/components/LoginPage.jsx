import React, { useState } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Flex,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

// URL da API de Login (REAL)
const LOGIN_API_URL = 'http://127.0.0.1:8000/auth/token';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState(''); // Para o e-mail do usuário
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const requestBody = new URLSearchParams();
      requestBody.append('username', username);
      requestBody.append('password', password);

      const response = await axios.post(
        LOGIN_API_URL,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token, token_type } = response.data;

      if (access_token) {
        // Armazena o token completo (ex: "Bearer seu_token_jwt_aqui")
        // NOTE: O token está sendo salvo aqui no LoginPage para ser mais direto.
        // No App.jsx, ele também é salvo via `onLogin` para consistência e clareza.
        localStorage.setItem('userToken', `${token_type} ${access_token}`);
        localStorage.setItem('userName', username); // Salva o nome de usuário também

        toast({
          title: "Login bem-sucedido!",
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onLogin(access_token, username); // Passa o token e o username para o App.jsx
      } else {
        toast({
          title: 'Erro no Login',
          description: "Credenciais inválidas ou resposta inesperada da API.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      let errorMessage = "Ocorreu um erro ao tentar fazer login. Verifique sua conexão e se o servidor está rodando.";
      if (error.response) {
        errorMessage = error.response.data.detail || error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Nenhuma resposta do servidor. Verifique se o back-end está rodando em http://127.0.0.1:8000.";
      }
      toast({
        title: 'Erro de Comunicação',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Erro de login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      minH="100vh"
      bg="gray.100"
    >
      {/* Box para a área central azul escuro */}
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
          {/* Título/Logo */}
          <Heading
            as="h1"
            size="2xl"
            color="white"
            textTransform="uppercase"
            fontWeight="extrabold"
            letterSpacing="wide"
            mb={4}
          >
            Zé da Gota Solutions
          </Heading>

          {/* Campo de Usuário (E-mail) */}
          <Input
            placeholder="E-mail do Usuário"
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

          {/* Campo de Senha */}
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

          {/* Botão Entrar */}
          <Button
            colorScheme="blue"
            size="lg"
            mt={4}
            width="full"
            bg="blue.600"
            color="white"
            _hover={{ bg: 'blue.700' }}
            onClick={handleSubmit}
            isLoading={isLoading}
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