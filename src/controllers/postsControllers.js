import fs from "fs"; // Importa o módulo 'fs' do Node.js, responsável por interagir com o sistema de arquivos.
import gerarDescricaoComGemini from "../services/geminiServeces.js";
import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModels.js"; // Importa as funções `getTodosPosts` e `criarPost` do arquivo `postsModels.js`, localizado no diretório '../config/models'. Essas funções provavelmente interagem com um banco de dados para obter e criar posts.

export async function listarPosts(req, res) { // Define uma função assíncrona para listar todos os posts.
  const posts = await getTodosPosts(); // Chama a função `getTodosPosts` para obter todos os posts do banco de dados e armazena o resultado na constante `posts`.
  res.status(200).json(posts); // Envia uma resposta HTTP com status 200 (sucesso) e o array de posts no formato JSON.
};

export async function postarNovoPost(req, res) { // Define uma função assíncrona para criar um novo post.
  const novoPost = req.body; // Obtém os dados do novo post enviados no corpo da requisição.
  try {
    const postCriado = await criarPost(novoPost); // Chama a função `criarPost` para inserir o novo post no banco de dados e armazena o resultado na constante `postCriado`.
    res.status(200).json(postCriado); // Envia uma resposta HTTP com status 200 (sucesso) e o objeto do post criado no formato JSON.
  } catch (erro) {
    console.error(erro.message); // Imprime a mensagem de erro no console para facilitar a depuração.
    res.status(500).json("Erro Falha na requisição"); // Envia uma resposta HTTP com status 500 (erro interno do servidor) e uma mensagem genérica de erro.
  }
}

export async function uploadImagem(req, res) { // Define uma função assíncrona para fazer upload de uma imagem e criar um novo post.
  const novoPost = { // Cria um objeto com os dados do novo post, incluindo a descrição, URL da imagem e texto alternativo.
    descricao: "",
    imgUrl: req.file.originalname, // Utiliza o nome original do arquivo enviado como URL da imagem.
    alt: ""
  };

  try {
    const postCriado = await criarPost(novoPost); // Cria um novo post no banco de dados.
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`; // Constrói o novo caminho da imagem, utilizando o ID do post criado.
    fs.renameSync(req.file.path, imagemAtualizada); // Renomeia o arquivo enviado para o novo caminho.
    res.status(200).json(postCriado); // Envia uma resposta HTTP com status 200 (sucesso) e o objeto do post criado no formato JSON.
  } catch (erro) {
    console.error(erro.message); // Imprime a mensagem de erro no console.
    res.status(500).json({"Erro":"Falha na requisição"}); // Envia uma resposta HTTP com status 500 (erro interno do servidor) e uma mensagem de erro.
  }
}

import fs from "fs"; // Importa o módulo 'fs' do Node.js, responsável por interagir com o sistema de arquivos.
import gerarDescricaoComGemini from "../services/geminiServeces.js"; // Importa a função `gerarDescricaoComGemini` do arquivo `geminiServeces.js`, localizado no diretório '../services'. Essa função é responsável por gerar descrições de imagens usando o Gemini.
import { atualizarPost } from "../models/postsModels.js"; // Importa a função `atualizarPost` do arquivo `postsModels.js`, localizado no diretório '../config/models'. Essa função interage com um banco de dados para atualizar posts.

export async function atualizarNovoPost(req, res) { // Define uma função assíncrona para atualizar um post existente após o upload da imagem e geração da descrição.
  const id = req.params.id; // Obtém o ID do post a ser atualizado a partir dos parâmetros da requisição.
  const urlImagem = `http://localhost:4000/${id}.png` // Constrói a URL completa da imagem com base no ID do post.
  try {
      const imgBuffer = fs.readFileSync(`uploads/${id}.png`) // Lê o conteúdo do arquivo de imagem como um buffer.
      const descricao = await gerarDescricaoComGemini(imgBuffer) // Gera a descrição da imagem usando a função `gerarDescricaoComGemini`.
      const post = {  // Cria um objeto com os dados a serem atualizados no post.
          imgUrl: urlImagem, // Define a URL da imagem.
          descricao: descricao, // Define a descrição gerada.
          alt: req.body.alt // Define o texto alternativo da imagem.
      }
      const atualizar = await atualizarPost(id, post); // Chama a função `atualizarPost` para atualizar o post no banco de dados.
      res.status(200).json(atualizar);  // Envia uma resposta HTTP com status 200 (sucesso) e o objeto do post atualizado no formato JSON.
  } catch(erro) { // Bloco catch para capturar e tratar erros durante a execução da função.
      console.error(erro.message); // Imprime a mensagem de erro no console.
      res.status(500).json({"Erro":"Falha na requisição"}); // Envia uma resposta HTTP com status 500 (erro interno do servidor) e uma mensagem de erro.
  }
}