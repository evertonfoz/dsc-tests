// O formulário ainda não autentica nem envia dados (RN02; ADR-001).
export function LoginPage() {
  return (
    <main className="page">
      <section className="card">
        <h1>Login</h1>

        <p>
          Informe suas credenciais para acessar o dashboard.
        </p>

        <form className="form">
          <label>
            E-mail
            <input
              type="email"
              placeholder="seu@email.com"
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              placeholder="Sua senha"
            />
          </label>

          <button type="submit">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
