// src/api/mockApi.js

// Dados simulados de simulados (os mesmos que você já tem em SimuladoSelectionPage)
const mockSimuladosData = [
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

// Dados simulados de questões (os mesmos que você já tem em QuestionPage)
const mockQuestionsData = [
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

const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Função de Login Removida (Agora usa a API real no LoginPage.jsx)
// export const loginUser = async (username, password) => { ... };

// Simula a obtenção da lista de simulados (MANTIDA POR ENQUANTO)
export const fetchSimulados = async (filters = {}) => {
  await simulateDelay(700);

  let filtered = [...mockSimuladosData];

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(s =>
      s.title.toLowerCase().includes(term) ||
      s.subject.toLowerCase().includes(term) ||
      s.institution.toLowerCase().includes(term)
    );
  }
  if (filters.institution) {
    filtered = filtered.filter(s => s.institution === filters.institution);
  }
  if (filters.discipline) {
    filtered = filtered.filter(s => s.disciplines.includes(filters.discipline));
  }
  if (filters.difficulty) {
    filtered = filtered.filter(s => s.difficulty === filters.difficulty);
  }

  return { success: true, data: filtered };
};

// Simula a obtenção das questões para um simulado específico (MANTIDA POR ENQUANTO)
export const fetchQuestionsForSimulado = async (simuladoId) => {
  await simulateDelay(600);

  const simulado = mockSimuladosData.find(s => s.id === simuladoId);

  if (simulado) {
    return { success: true, data: { simulado, questions: mockQuestionsData } };
  } else {
    return { success: false, message: "Simulado não encontrado." };
  }
};

// Simula o envio das respostas do usuário e correção (MANTIDA POR ENQUANTO)
export const submitSimuladoAnswers = async (simuladoId, answers) => {
  await simulateDelay(1000);

  const questions = mockQuestionsData;

  let correctCount = 0;
  questions.forEach(q => {
    if (answers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });

  const totalQuestions = questions.length;
  const score = `${correctCount}/${totalQuestions}`;

  return {
    success: true,
    data: {
      correctCount,
      totalQuestions,
      score,
      message: "Respostas processadas com sucesso!"
    }
  };
};