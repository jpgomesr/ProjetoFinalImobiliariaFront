# Projeto Final Imobiliária Front

Este é o frontend do projeto final de imobiliária, desenvolvido com Next.js.

## Pré-requisitos

-  Node.js (versão 18 ou superior)
-  npm ou yarn

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/jpgomesr/ProjetoFinalImobiliariaFront.git
```

2. Navegue até o diretório do projeto:

```bash
cd ProjetoFinalImobiliariaFront
```

3. Instale as dependências:

```bash
npm install
# ou
yarn install
```

## Configuração do Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8082
NEXT_AUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=
```

## Execução

Para iniciar o projeto em modo de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000)

## Build para Produção

Para criar uma build otimizada para produção:

```bash
npm run build
# ou
yarn build
```

Para iniciar o servidor de produção:

```bash
npm start
# ou
yarn start
```

## Tecnologias Utilizadas

-  Next.js
-  TypeScript
-  Tailwind CSS
-  Lucide Icons
-  NextAuth.js
