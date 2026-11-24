import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import "./AuthPage.css";

type AuthMode = "login" | "register";

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const isRegistering = mode === "register";

  const submit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isRegistering) {
        await api.register(email, password);
      } else {
        await api.login(email, password);
      }
      navigate("/lk", { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Не удалось выполнить запрос",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>{isRegistering ? "Регистрация" : "Вход в личный кабинет"}</h1>
        <p className="auth-card__description">
          {isRegistering
            ? "Создайте аккаунт, указав email и пароль."
            : "Введите email и пароль, чтобы продолжить."}
        </p>

        <label className="auth-card__field">
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            maxLength={254}
          />
        </label>

        <label className="auth-card__field">
          Пароль
          <input
            type="password"
            name="password"
            autoComplete={isRegistering ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={isRegistering ? 8 : undefined}
          />
        </label>

        {error && (
          <p className="auth-card__error" role="alert">
            {error}
          </p>
        )}

        <button
          className="auth-card__submit"
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Подождите…"
            : isRegistering
              ? "Создать аккаунт"
              : "Войти"}
        </button>

        <p className="auth-card__switch">
          {isRegistering ? "Уже есть аккаунт?" : "Ещё нет аккаунта?"}{" "}
          <button
            type="button"
            onClick={() => {
              setError("");
              setMode(isRegistering ? "login" : "register");
            }}
          >
            {isRegistering ? "Войти" : "Зарегистрироваться"}
          </button>
        </p>
        <Link className="auth-card__home" to="/">
          На главную
        </Link>
      </form>
    </section>
  );
};

export default AuthPage;
