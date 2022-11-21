# :coin: Full Stack Bank :dollar

![Preview](./screenshots/login.png)

## :page_with_curl: Sobre

Aplicação full stack de carteira digital

## :man_technologist: Habilidades desenvolvidas

* Desenvolver uma aplicação frontend com o framework Netx.js e TypeScript
* Utilizar Sass e CSS Modules para a estilização do frontend
* Desenvolver uma API RESTful em Node.js com Express.js e TypeScript
* Utilizar um ORM
* Utilizar um banco de dados PostgreSQL
* Documentar a API com Open API e o framework Swagger UI
* Implementar testes de integração no backend utilizando Mocha.js, Chai.js e Sinon.js com 100% de cobertura
* mplementar testes E2E com o framework Cypress em conjunto com a Testing Library
* Dockerizar a aplicação utilizando Docker Compose

## :memo: Metodologias e paradigmas

* Mobile First
* Padrão BEM (Block-Element-Modifier) no CSS
* Programação Orientada a Objetos (POO)
* Princípios de SOLID

## :hammer_and_wrench: Stacks

* TypeScript
* React.js
* Next.js
* Sass
* Cypress
* Testing Library
* Node.js
* Express.js
* Sequelize.js
* PortgreSQL
* Swagger UI
* Mocha.js
* Chai.js
* Sinon.js
* Docker
* Docker Compose

## :hammer_and_wrench: Instalação e execução

Para rodar está aplicação é necessário ter **Git**, **Docker**, **Node** e o **Docker Compose** instalados no seu computador. O Docker Compose precisa estar na versão **2.5.0** ou superior e o Node na versão **16**.

Além disso, para executar os comandos do passo-a-passo abaixo também é necessário que o seu sistema operacional tenha um **terminal Bash** instalado. Caso você esteja utilizando **Linux** ou **macOS**, o Bash já vem instalado por padrão. Porém, se o seu sistema for **Windows**, talvez você precise fazer [a instalação a parte](https://www.lifewire.com/install-bash-on-windows-10-4101773).

### 1. No diretório raiz do projeto, execute o comando baixo no terminal para instalar as dependências

```sh
npm install
```

### 2. Suba os containers da aplicação

```sh
npm run compose:up
```

Executando o comando acima, será criada uma rede de três containerS:

* ng_frontend - mapeado na porta 3000
* ng_backend - mapeado na porta 3001
* ng_db - mapeado na poarta 3002

Se tratam da aplicação frontend, backend e o banco de dados, respectivamente. Depois que eles estiverem rodando, basta acessar o endereço <http://localhost:3000> no seu navegador para utilizar a aplicação.

## :books: Documentação da API

Com a aplicação em execução, basta acessar o endereço <http://localhost:3001/docs> no seu navegador para visualizar a documentação que foi implementada com o Swagger UI.

![API documentação](./screenshots/api-docs.png)

## :test_tube: Testes

### Integração

Eu implementei testes de integração no backend com 100% de cobertura. Para verificar o resultado deles, basta executar o comando baixo na raiz do projeto:

```sh
npm run test:integration
```

*Observação:* para rodar os testes de integração, não é necessário que a aplicação esteja rodando, pois a interação com o banco de dados é mockada e os testes iniciam uma instância da api antes de serem iniciados.

![Cobertura dos testes de integração](./screenshots/integration-coverage.png)

### E2E (End-to-End)

Também implementei alguns testes E2E cpm o framework Cypress em conjunto com a Testing Library para utilizar seletores semânticos. **É necessário que as aplicações estejam sendo executadas** antes de rodar os testes E2E.

Para abrir o Cypress no navegador, execute o comando na raiz do projeto:

```sh
npm run test:e2e:open
```

Será aberta uma janela com a lista das specs, basta clicar em alguma delas para que os testes sejam iniciados.

![Cypress](./screenshots/cypress.png)

Caso prefira, também é possível rodar os testes E2E sem a interface gráfica utilizando o comando:

```sh
npm run test:e2e
```

### Executar todos os testes

Rode o comando abaixo na raiz do projeto para rodar todos os testes de integração e E2d em sequência no terminal:

```sh
npm run test
```

**Observação:** esse comando roda os testes E2E sem a interface gráfica.

## :iphone: Capturas de tela

![Tela de login - mobile](./screenshots/login-mobile.png)
![Dashboard - mobile](./screenshots/dashboard-mobile.png)

![Dashboard](./screenshots//dashboard.png)
