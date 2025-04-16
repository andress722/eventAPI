
# 🎟️ Events - Backend + Mobile

Este projeto é uma aplicação completa para gerenciamento de eventos, permitindo cadastrar eventos, realizar inscrições e visualizar os participantes.

## 🔧 Tecnologias Utilizadas

### Backend
- Node.js
- Fastify
- Prisma ORM
- SQLite
- Zod (validação de dados)

### Frontend
- React Native
- Expo
- Axios
- React Navigation

---

## ✨ Funcionalidades

✅ Criar eventos  
✅ Inscrever participantes em eventos  
✅ Listar todos os eventos cadastrados  
✅ Visualizar participantes de cada evento  
✅ Aplicação mobile com layout simples e funcional  

---

## 📂 Estrutura

```
├── backend/
│   ├── prisma/
│   ├── routes/
│   └── server.ts
│
├── frontend/
│   ├── App.tsx
│   └── package.json
│
└── README.md
```

---

## 🚀 Como Rodar

### 🔙 Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

> 🔗 O backend sobe por padrão em: `http://192.168.14.200:3000/api`

### 📱 Frontend

```bash
cd frontend
npm install
npx expo start
```

> Acesse no navegador ou escaneie o QR Code com o app **Expo Go**

---

## 📷 Capturas de Tela

> Adicione prints do app e da API em funcionamento

---

## 🧠 Aprendizados

- Organização de API RESTful com validação
- Integração mobile + backend local
- Gerenciamento de participantes com limite por evento
- Uso prático de Prisma e SQLite

---

## 📌 Autor

Andre Moreira Cidre  
📬 andrecidre@hotmail.com  
📱 (11) 94078-5004

---

## 🔗 Repositório

[https://github.com/andress722/eventAPI](https://github.com/andress722/eventAPI)

---

## 📝 Licença

MIT
