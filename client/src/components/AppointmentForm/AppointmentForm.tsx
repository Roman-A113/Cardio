"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { api } from "@/lib/api";
import type { Specialist } from "@/types/Specialist";
import type { CreateAppointmentDto, DoctorSlot } from "@/types/Appointment";
import "./AppointmentForm.css";

type AvailableDate = {
  date: string; // YYYY-MM-DD
  slots: DoctorSlot[];
};

export default function AppointmentForm() {
  const [doctors, setDoctors] = useState<Specialist[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Specialist | null>(null);
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<DoctorSlot | null>(null);
  const [search, setSearch] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [specialties, setSpecialties] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadRequestId = useRef(0);

  const [form, setForm] = useState<{
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    birthDate: string;
    type: "OMS" | "PAID";
    comment: string;
  }>({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    birthDate: "",
    type: "OMS",
    comment: "",
  });

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        setError("");
        const doctorsData: Specialist[] = await api.getDoctors();
        const specialtiesData: { id: number; name: string }[] =
          await api.getSpecialties("ALL");
        if (!cancelled) {
          setDoctors(doctorsData);
          setSpecialties(specialtiesData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Не удалось загрузить врачей и специальности",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredDoctors = useMemo(() => {
    const searchLower = search.trim().toLowerCase();
    const specialty = specialtyFilter.trim().toLowerCase();
    return doctors.filter((d) => {
      const name =
        [d.lastName, d.firstName, d.middleName].filter(Boolean).join(" ") ||
        "";
      const matchesSearch = name.toLowerCase().includes(searchLower);
      const matchesSpecialty =
        !specialty || d.specialty.trim().toLowerCase() === specialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, search, specialtyFilter]);

  const handleSelectDoctor = async (doctor: Specialist) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
    setSelectedDate("");
    setAvailableDates([]);
    loadRequestId.current += 1;
    const myRequestId = loadRequestId.current;
    try {
      setLoading(true);
      setError("");
      const today = new Date();
      const dates: AvailableDate[] = [];
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];
        try {
          const slots = await api.getDoctorSlots(
            Number(doctor.id),
            dateStr,
          );
          const available = slots.filter((s) => s.available);
          if (available.length > 0 && myRequestId === loadRequestId.current) {
            dates.push({ date: dateStr, slots: available });
          }
        } catch {
          // Пропускаем дни без расписания (выходные, праздники)
        }
      }
      if (myRequestId === loadRequestId.current) {
        setAvailableDates(dates);
      }
    } catch (err) {
      if (myRequestId === loadRequestId.current) {
        setError(
          err instanceof Error
            ? err.message
            : "Не удалось загрузить расписание",
        );
      }
    } finally {
      if (myRequestId === loadRequestId.current) {
        setLoading(false);
      }
    }
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSelectSlot = (slot: DoctorSlot) => {
    setSelectedSlot(slot);
  };

  const formatSlotTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateRu = (iso: string) => {
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const doctorFullName = (doctor: Specialist | null) =>
    doctor
      ? [doctor.lastName, doctor.firstName, doctor.middleName]
          .filter(Boolean)
          .join(" ")
      : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      if (!selectedDoctor || !selectedSlot) {
        throw new Error("Не выбран врач или время");
      }
      if (!form.patientName || !form.patientPhone || !form.birthDate) {
        throw new Error("Заполните ФИО, телефон и дату рождения");
      }
      const body: CreateAppointmentDto = {
        staffId: Number(selectedDoctor.id),
        scheduledAt: selectedSlot.start,
        type: form.type,
        source: "SITE",
        comment:
          `Дата рождения: ${form.birthDate}. ` +
          (form.comment ? form.comment : ""),
        patientName: form.patientName,
        patientPhone: form.patientPhone,
        patientEmail: form.patientEmail || undefined,
      };
      await api.createAppointment(body);
      setMessage("Запись оформлена успешно!");
      setForm({
        patientName: "",
        patientPhone: "",
        patientEmail: "",
        birthDate: "",
        type: "OMS",
        comment: "",
      });
      setSelectedSlot(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка записи на приём");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <section className="appointment-form">
        <h2>Запись на приём</h2>
        <div className="appointment-error">{error}</div>
        <button
          type="button"
          onClick={() => {
            setError("");
            window.location.reload();
          }}
        >
          Попробовать ещё раз
        </button>
      </section>
    );
  }

  return (
    <section className="appointment-form">
      <h2>Запись на приём</h2>
      {message && <div className="appointment-message">{message}</div>}

      <div className="appointment-layout">
        {/* Колонка 1: Выбор врача с фильтрами */}
        <div className="col-doctors">
          <h3>1. Выберите врача</h3>

          <div className="filters">
            <label>
              Поиск:
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ФИО, должность, отделение"
              />
            </label>
            <label>
              Специальность:
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
              >
                <option value="">Все специальности</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.name.trim()}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {loading ? (
            <p>Загрузка врачей…</p>
          ) : filteredDoctors.length === 0 ? (
            <p className="no-results">Врачей не найдено по заданным фильтрам.</p>
          ) : (
            <ul className="doctor-list">
              {filteredDoctors.map((doctor) => (
                <li key={doctor.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectDoctor(doctor)}
                    className={`doctor-card ${selectedDoctor?.id === doctor.id ? "selected" : ""}`}
                  >
                    <div className="doctor-info">
                      <strong>
                        {doctor.lastName} {doctor.firstName} {doctor.middleName}
                      </strong>
                      <p>{doctor.position}</p>
                      <p>{doctor.specialty}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Колонка 2: Расписание врача */}
        <div className="col-schedule">
          {selectedDoctor ? (
            <>
              <h3>
                2. Расписание {doctorFullName(selectedDoctor)}
              </h3>
              <p className="doctor-hint">
                {selectedDoctor.position} · {selectedDoctor.specialty}
              </p>

              {loading ? (
                <p>Загрузка расписания…</p>
              ) : availableDates.length === 0 ? (
                <p className="no-results">
                  Нет свободного времени на ближайшие 30 дней.
                </p>
              ) : (
                <div className="schedule-grid">
                  {availableDates.map((day) => (
                    <div key={day.date} className="date-block">
                      <div className="date-header">
                        <button
                          type="button"
                          onClick={() => handleSelectDate(day.date)}
                          className={`date-btn ${
                            selectedDate === day.date ? "selected" : ""
                          }`}
                        >
                          {formatDateRu(day.date)}
                        </button>
                      </div>
                      <div className="slots-row">
                        {day.slots.map((slot) => (
                          <button
                            key={slot.start}
                            type="button"
                            onClick={() => handleSelectSlot(slot)}
                            className={`slot-btn ${
                              selectedSlot?.start === slot.start
                                ? "selected"
                                : ""
                            }`}
                          >
                            {formatSlotTime(slot.start)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>Выберите врача в левой колонке, чтобы посмотреть расписание.</p>
            </div>
          )}
        </div>

        {/* Колонка 3: Форма записи */}
        <div className="col-form">
          {!selectedSlot ? (
            <div className="empty-state">
              <p>Выберите дату и время в средней колонке.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3>3. Данные пациента</h3>
              <p className="appointment-summary">
                <strong>Врач:</strong> {doctorFullName(selectedDoctor)}<br />
                <strong>Время:</strong>
                {formatDateRu(selectedSlot.start)} в{" "}
                {formatSlotTime(selectedSlot.start)}
              </p>

              <label>
                ФИО пациента:*
                <input
                  type="text"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Телефон:*
                <input
                  type="tel"
                  value={form.patientPhone}
                  onChange={(e) =>
                    setForm({ ...form, patientPhone: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Дата рождения:*
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) =>
                    setForm({ ...form, birthDate: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={form.patientEmail}
                  onChange={(e) =>
                    setForm({ ...form, patientEmail: e.target.value })
                  }
                />
              </label>
              <label>
                Тип записи:
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value as "OMS" | "PAID",
                    })
                  }
                >
                  <option value="OMS">По ОМС</option>
                  <option value="PAID">Платно</option>
                </select>
              </label>
              <label>
                Комментарий:
                <textarea
                  value={form.comment}
                  onChange={(e) =>
                    setForm({ ...form, comment: e.target.value })
                  }
                />
              </label>
              <button type="submit" disabled={submitting}>
                {submitting ? "Оформление…" : "Записаться"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
