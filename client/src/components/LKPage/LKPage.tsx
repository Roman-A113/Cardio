"use client";

import { type SubmitEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, api } from "@/lib/api";
import type { Appointment } from "@/types/Appointment";
import "./LKPage.css";

export default function LKPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadAccount = async () => {
      try {
        const { user } = await api.getCurrentUser();
        if (!active) return;
        setEmail(user.email);
        setProfile({
          firstName: user.firstName ?? "",
          middleName: user.middleName ?? "",
          lastName: user.lastName ?? "",
          phone: user.phone ?? "",
        });

        const userAppointments = await api.getAppointments();
        if (active) setAppointments(userAppointments);
      } catch (loadError) {
        if (!active) return;
        if (loadError instanceof ApiError && loadError.status === 401) {
          navigate("/auth", { replace: true });
        } else {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Не удалось загрузить личный кабинет",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadAccount();
    return () => {
      active = false;
    };
  }, [navigate]);

  const saveProfile = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingProfile(true);
    setError("");
    setProfileMessage("");
    try {
      const { user } = await api.updateProfile(profile);
      setProfile({
        firstName: user.firstName ?? "",
        middleName: user.middleName ?? "",
        lastName: user.lastName ?? "",
        phone: user.phone ?? "",
      });
      setProfileMessage("Данные профиля сохранены.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Не удалось сохранить данные профиля",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const logout = async () => {
    setLoggingOut(true);
    setError("");
    try {
      await api.logout();
      navigate("/auth", { replace: true });
    } catch (logoutError) {
      setError(
        logoutError instanceof Error
          ? logoutError.message
          : "Не удалось выйти из аккаунта",
      );
    } finally {
      setLoggingOut(false);
    }
  };

  const statusLabel: Record<string, string> = {
    PENDING: "Ожидает подтверждения",
    CONFIRMED: "Подтверждена",
    CANCELLED: "Отменена",
    COMPLETED: "Завершена",
  };

  if (loading) return <div className="lk-page">Загрузка личного кабинета…</div>;

  return (
    <section className="lk-page">
      <div className="lk-page__header">
        <div>
          <h2>Личный кабинет</h2>
          <p>{email}</p>
        </div>
        <button
          className="lk-page__logout"
          type="button"
          onClick={logout}
          disabled={loggingOut}
        >
          {loggingOut ? "Выходим…" : "Выйти"}
        </button>
      </div>
      {error && (
        <p className="lk-page__error" role="alert">
          {error}
        </p>
      )}
      <section className="lk-page__profile">
        <h3>Данные профиля</h3>
        <form onSubmit={saveProfile}>
          <label>
            Фамилия
            <input
              type="text"
              autoComplete="family-name"
              maxLength={100}
              value={profile.lastName}
              onChange={(event) =>
                setProfile({ ...profile, lastName: event.target.value })
              }
            />
          </label>
          <label>
            Имя
            <input
              type="text"
              autoComplete="given-name"
              maxLength={100}
              value={profile.firstName}
              onChange={(event) =>
                setProfile({ ...profile, firstName: event.target.value })
              }
            />
          </label>
          <label>
            Отчество
            <input
              type="text"
              maxLength={100}
              value={profile.middleName}
              onChange={(event) =>
                setProfile({ ...profile, middleName: event.target.value })
              }
            />
          </label>
          <label>
            Номер телефона
            <input
              type="tel"
              autoComplete="tel"
              maxLength={32}
              value={profile.phone}
              onChange={(event) =>
                setProfile({ ...profile, phone: event.target.value })
              }
            />
          </label>
          <button type="submit" disabled={savingProfile}>
            {savingProfile ? "Сохраняем…" : "Сохранить данные"}
          </button>
        </form>
        {profileMessage && (
          <p className="lk-page__success" role="status">
            {profileMessage}
          </p>
        )}
      </section>
      <h3>Мои записи</h3>
      {appointments.length === 0 ? (
        <p>Записей нет.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Время</th>
              <th>Врач</th>
              <th>Услуга</th>
              <th>Тип</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{new Date(a.scheduledAt).toLocaleDateString("ru-RU")}</td>
                <td>
                  {new Date(a.scheduledAt).toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>{a.staff.fullName}</td>
                <td>{a.service?.name ?? "—"}</td>
                <td>{a.type === "PAID" ? "Платно" : "ОМС"}</td>
                <td>{statusLabel[a.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
