import express from "express"; // Importa o framework Express.js para criar a aplicação web.
import routes from "./src/Routes/postsRoutes.js"; // Importa as rotas definidas no arquivo postsRoutes.js.

const app = express(); // Cria uma instância do Express, que será a nossa aplicação.
app.use(express.static("uploads"));

routes(app); // Chama a função routes, passando a instância da aplicação como parâmetro. 
            // Essa função provavelmente configura as rotas da aplicação.

app.listen(4000, () => { // Inicia o servidor na porta 4000 e executa uma função de callback quando o servidor estiver ouvindo.
  console.log("Servidor escutando.."); // Imprime uma mensagem no console indicando que o servidor está rodando.
});

