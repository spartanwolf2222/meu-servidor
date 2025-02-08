import 'dotenv/config'; // Importa e configura as variáveis de ambiente do arquivo .env.
import { ObjectId } from "mongodb"; // Importa a classe ObjectId do módulo mongodb para lidar com IDs do MongoDB.
import conectarAoBanco from "../config/dbConfig.js"; // Importa a função para conectar ao banco de dados, localizada em um arquivo chamado dbConfig.js no diretório pai.

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO); // Chama a função para conectar ao banco de dados, utilizando a string de conexão obtida da variável de ambiente STRING_CONEXAO. O resultado da conexão é armazenado na constante conexao.

export async function getTodosPosts() { // Define uma função assíncrona chamada getTodosPosts para obter todos os posts.
  const db = conexao.db("imersao-back-end"); // Obtém o banco de dados chamado "imersao-back-end" a partir da conexão estabelecida.
  const colecao = db.collection("posts"); // Obtém a coleção de documentos chamada "posts" dentro do banco de dados.
  return colecao.find().toArray(); // Realiza uma consulta para encontrar todos os documentos na coleção e retorna os resultados como um array.
}

export async function criarPost(novoPost) { // Define uma função assíncrona chamada criarPost para criar um novo post.
  const db = conexao.db("imersao-back-end"); // Obtém o banco de dados chamado "imersao-back-end" a partir da conexão estabelecida.
  const colecao = db.collection("posts"); // Obtém a coleção de documentos chamada "posts" dentro do banco de dados.
  return colecao.insertOne(novoPost); // Insere um novo documento (o post) na coleção e retorna um objeto com informações sobre a inserção.
}

export async function atualizarPost(id, novoPost) { // Define uma função assíncrona chamada atualizarPost para atualizar um post existente.
  const db = conexao.db("imersao-back-end"); // Obtém o banco de dados chamado "imersao-back-end" a partir da conexão estabelecida.
  const colecao = db.collection("posts"); // Obtém a coleção de documentos chamada "posts" dentro do banco de dados.
  const objID = ObjectId.createFromHexString(id) // Converte a string do ID para um ObjectId válido.
  return colecao.updateOne({_id: new ObjectId(objID)}, {$set: novoPost}); // Atualiza um documento na coleção com base no ID e os novos dados.
}