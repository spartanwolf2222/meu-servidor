import express from "express"; // Importa o framework Express.js para criar uma API RESTful.
import multer from "multer"; // Importa o módulo Multer para lidar com uploads de arquivos.
import cors from "cors"; // Importa o módulo CORS para habilitar requisições de diferentes domínios.
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsControllers.js"; // Importa as funções controladoras para gerenciar posts, localizadas em `../controllers/postsControllers.js`.

const corsOptions = {
  origin: "http://locallhost:8000", // Define a origem permitida para requisições CORS.
  optionsSuccessStatus: 200 // Define o código de status de sucesso para preflight requests do CORS.
}

const storage = multer.diskStorage({ // Define a configuração de armazenamento para o Multer.
  destination: function (req, file, cb) { // Função para definir o diretório de destino para os uploads.
    cb(null, "uploads/"); // Define o diretório "uploads" para armazenar os arquivos.
  },
  filename: function (req, file, cb) { // Função para definir o nome dos arquivos.
    cb(null, file.originalname); // Utiliza o nome original do arquivo enviado.
  }
});

const upload = multer({ dest: "./uploads", storage }); // Cria uma instância do Multer utilizando a configuração de armazenamento e o diretório padrão.

const routes = (app) => { // Define uma função para configurar as rotas da API.

  app.use(express.json()); // Aplica o middleware express.json para que a API possa entender o formato JSON em requisições.
  app.use(cors(corsOptions)); // Aplica o middleware CORS com as opções configuradas.

  // Rotas para gerenciar posts:

  app.get("/posts", listarPosts); // Rota GET para listar todos os posts (delega a operação para a função `listarPosts`).
  app.post("/posts", postarNovoPost); // Rota POST para criar um novo post (delega a operação para a função `postarNovoPost`).

  // Rota para upload de imagem:

  app.post("/upload", upload.single("imagem"), uploadImagem); // Rota POST para upload de imagem e criação de um novo post.
  // - upload.single("imagem"): configura o Multer para aceitar apenas um arquivo com o campo "imagem" no formulário da requisição.
  // - uploadImagem: delega a operação para a função `uploadImagem` após o upload ser realizado.

  app.put("/upload/:id", atualizarNovoPost); // Rota PUT para atualizar um post existente, com base no ID do post.
};

export default routes; // Exporta a função `routes` para ser utilizada no arquivo principal da API.