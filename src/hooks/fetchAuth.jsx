const login = async (email, senha) => {
   fetch("http://api/auth/login", {
      headers: {
         "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
         email,
         senha,
      }),
   })
      .then((response) => {
         if (!response.ok) {
            throw new Error("Erro no login");
         }
         return response.json();
      })
      .then((data) => {
         console.log("Sucesso:", data);
         return data;
      })
      .catch((error) => {
         console.error("Erro:", error);
      });
};

const register = async (nome, email, senha) => {
   fetch("http://api/auth/register", {
      headers: {
         "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
         nome,
         email,
         senha,
      }),
   })
      .then((response) => {
         if (!response.ok) {
            throw new Error("Erro no registro");
         }
         return response.json();
      })
      .then((data) => {
         console.log("Sucesso:", data);
         return data;
      })
      .catch((error) => {
         console.error("Erro:", error);
      });
};

export { login, register };
