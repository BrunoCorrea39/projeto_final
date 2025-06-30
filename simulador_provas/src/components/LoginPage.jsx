// src/LoginPage.jsx

import React, { useState } from 'react'; // Importe useState para gerenciar o estado dos campos
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Flex,
  // Removido: Image, Center - não são necessários neste design
} from '@chakra-ui/react';

// O componente LoginPage agora recebe uma prop 'onLogin' do App.jsx
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState(''); // Estado para o campo Usuário
  const [password, setPassword] = useState(''); // Estado para o campo Senha

  // Função para lidar com o clique do botão "Entrar"
  const handleSubmit = () => {
    // Chama a função 'onLogin' que foi passada via props do componente pai (App.jsx)
    // Passamos os valores atuais de usuário e senha
    onLogin(username, password);
  };

  return (
    // Flex Container para o fundo cinza e centralizar o conteúdo principal
    <Flex
      align="center"
      justify="center"
      minH="100vh" // Ocupa a altura total da viewport
      bg="gray.100" // Fundo cinza claro, ajuste a tonalidade conforme o protótipo
    >
      {/* Box para a área central azul escuro */}
      <Box
        p={8}
        w="full" // Largura total do Box pai
        maxW="500px" // Largura máxima para a caixa de login
        bg="blue.800" // Fundo azul escuro (ajuste a tonalidade para combinar com o protótipo)
        borderRadius="lg" // Bordas arredondadas para a caixa principal
        boxShadow="xl" // Sombra para destacar a caixa
        textAlign="center" // Centraliza o texto e alguns elementos dentro desta caixa
      >
        <VStack spacing={6}> {/* Espaçamento vertical entre os elementos */}

          {/* Título/Logo */}
          <Heading
            as="h1"
            size="2xl" // Tamanho maior para o título
            color="white" // Texto branco
            textTransform="uppercase" // Converte para maiúsculas
            fontWeight="extrabold" // Negrito extra
            letterSpacing="wide" // Aumenta o espaçamento entre as letras
            mb={4} // Margem inferior
          >
            Zé da Gota Solutions
          </Heading>

          {/* Campo de Usuário */}
          <Input
            placeholder="Usuário"
            size="lg" // Tamanho grande
            variant="filled" // Fundo preenchido
            bg="whiteAlpha.900" // Fundo branco levemente transparente
            color="gray.800" // Cor do texto
            borderRadius="md" // Bordas arredondadas
            _placeholder={{ color: 'gray.500' }} // Cor do placeholder
            _focus={{ borderColor: 'blue.300', boxShadow: '0 0 0 1px blue.300' }} // Estilo ao focar
            value={username} // Vincula o valor do input ao estado 'username'
            onChange={(e) => setUsername(e.target.value)} // Atualiza o estado 'username' ao digitar
          />

          {/* Campo de Senha */}
          <Input
            placeholder="Senha"
            size="lg"
            type="password" // Tipo password para ocultar o texto
            variant="filled"
            bg="whiteAlpha.900"
            color="gray.800"
            borderRadius="md"
            _placeholder={{ color: 'gray.500' }}
            _focus={{ borderColor: 'blue.300', boxShadow: '0 0 0 1px blue.300' }}
            value={password} // Vincula o valor do input ao estado 'password'
            onChange={(e) => setPassword(e.target.value)} // Atualiza o estado 'password' ao digitar
          />

          {/* Botão Entrar */}
          <Button
            colorScheme="blue" // Esquema de cores do Chakra UI (azul)
            size="lg" // Tamanho grande
            mt={4} // Margem superior
            width="full" // Ocupa a largura total disponível dentro do Box
            bg="blue.600" // Cor de fundo do botão (azul mais escuro para contraste)
            color="white" // Texto branco
            _hover={{ bg: 'blue.700' }} // Cor ao passar o mouse
            onClick={handleSubmit} // Adiciona o evento de clique para acionar a função de login
          >
            Entrar
          </Button>

        </VStack>
      </Box>
    </Flex>
  );
}

export default LoginPage;