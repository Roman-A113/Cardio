"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Appointment } from "@/types/Appointment";
import "./LKPage.css";

export default function LKPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAppointments()
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, []);

  const statusLabel: Record<string, string> = {
    PENDING: "Ожидает подтверждения",
    CONFIRMED: "Подтверждена",
    CANCELLED: "Отменена",
    COMPLETED: "Завершена",
  };

  if (loading) return <div>Загрузка записей…</div>;

  return (
    <section className="lk-page">
      <h2>Мои записи</h2>
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
