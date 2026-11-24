"use client";

import {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [specialties, setSpecialties] = useState<
    { id: number; name: string }[]
  >([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadRequestId = useRef(0);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const appointmentTitleRef = useRef<HTMLHeadingElement>(null);

  const handleCloseSchedule = useCallback(() => {
    loadRequestId.current += 1;
    setScheduleOpen(false);
    setSelectedSlot(null);
    setSelectedDoctor(null);
    setAvailableDates([]);
    setSelectedDate("");
    setScheduleLoading(false);
  }, []);

  const [form, setForm] = useState<{
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    birthDate: string;
    comment: string;
  }>({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    birthDate: "",
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
      } finally {
        if (!cancelled) {
          setDoctorsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    const alignTitleWithAboutLink = () => {
      const aboutLink = Array.from(
        document.querySelectorAll<HTMLAnchorElement>(".main-nav a"),
      ).find((link) => link.textContent?.trim() === "Об институте");
      const title = appointmentTitleRef.current;

      if (aboutLink && title) {
        title.style.textIndent = `${
          aboutLink.getBoundingClientRect().left -
          title.getBoundingClientRect().left
        }px`;
      }
    };

    alignTitleWithAboutLink();
    window.addEventListener("resize", alignTitleWithAboutLink);
    return () => window.removeEventListener("resize", alignTitleWithAboutLink);
  }, []);

  useEffect(() => {
    if (!scheduleOpen || error) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseSchedule();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [scheduleOpen, error, handleCloseSchedule]);

  useEffect(() => {
    if (scheduleOpen) {
      modalScrollRef.current?.scrollTo({ top: 0 });
    }
  }, [scheduleOpen, selectedSlot]);

  const filteredDoctors = useMemo(() => {
    const searchTerms = search
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    const specialty = specialtyFilter.trim().toLowerCase();
    return doctors.filter((d) => {
      const name =
        [d.lastName, d.firstName, d.middleName].filter(Boolean).join(" ") || "";
      const searchableFields = [
        name,
        d.specialty,
        d.position,
        d.department,
      ].map((field) => field.toLowerCase());
      const matchesSearch = searchTerms.every((term) =>
        searchableFields.some((field) => field.includes(term)),
      );
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
    setScheduleOpen(true);
    loadRequestId.current += 1;
    const myRequestId = loadRequestId.current;
    try {
      setScheduleLoading(true);
      setError("");
      const today = new Date();
      const dates: AvailableDate[] = [];
      for (let i = 0; i < 30; i++) {
        if (myRequestId !== loadRequestId.current) {
          break;
        }
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];
        try {
          const slots = await api.getDoctorSlots(Number(doctor.id), dateStr);
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
        setScheduleLoading(false);
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
        type: "PAID",
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
        comment: "",
      });
      handleCloseSchedule();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка записи на приём");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <section className="appointment-form">
        <h2 ref={appointmentTitleRef}>Запись на приём</h2>
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
        <div className="col-doctors">
          <h3>Выберите врача</h3>

          <div className="filters">
            <label className="search-filter">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ФИО, должность, отделение"
                aria-label="Поиск по ФИО, должности или отделению"
              />
            </label>
            <label>
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                aria-label="Специальность"
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

          {doctorsLoading ? (
            <p>Загрузка врачей…</p>
          ) : filteredDoctors.length === 0 ? (
            <p className="no-results">
              Врачей не найдено по заданным фильтрам.
            </p>
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
      </div>

      {scheduleOpen && selectedDoctor && (
        <div
          className="schedule-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseSchedule();
            }
          }}
        >
          <section
            className="schedule-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="schedule-modal-title"
          >
            <button
              type="button"
              className="schedule-modal-close"
              onClick={handleCloseSchedule}
              aria-label="Закрыть окно записи"
            >
              ×
            </button>
            <h3 id="schedule-modal-title">
              {selectedSlot ? "Данные пациента" : "Расписание"}
            </h3>
            {!selectedSlot && (
              <div className="schedule-doctor-info">
                <p className="schedule-doctor-name">
                  {doctorFullName(selectedDoctor)}
                </p>
                <p>
                  <strong>Специальность:</strong> {selectedDoctor.specialty}
                </p>
                <p>
                  <strong>Штатная должность:</strong> {selectedDoctor.position}
                </p>
              </div>
            )}

            {selectedSlot ? (
              <div className="schedule-modal-scroll" ref={modalScrollRef}>
                <form onSubmit={handleSubmit}>
                  <div className="schedule-doctor-info">
                    <p className="schedule-doctor-name">
                      {doctorFullName(selectedDoctor)}
                    </p>
                    <p>
                      <strong>Специальность:</strong> {selectedDoctor.specialty}
                    </p>
                    <p>
                      <strong>Штатная должность:</strong>{" "}
                      {selectedDoctor.position}
                    </p>
                    <p>
                      <strong>Время:</strong> {formatDateRu(selectedSlot.start)}{" "}
                      в {formatSlotTime(selectedSlot.start)}
                    </p>
                    <p>
                      <strong>Тип записи:</strong> Платно
                    </p>
                  </div>

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
                    Комментарий:
                    <textarea
                      value={form.comment}
                      onChange={(e) =>
                        setForm({ ...form, comment: e.target.value })
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="appointment-back-button"
                    onClick={() => setSelectedSlot(null)}
                  >
                    Выбрать другое время
                  </button>
                  <button type="submit" disabled={submitting}>
                    {submitting ? "Оформление…" : "Записаться"}
                  </button>
                </form>
              </div>
            ) : scheduleLoading ? (
              <p>Загрузка расписания…</p>
            ) : availableDates.length === 0 ? (
              <p className="no-results">
                Нет свободного времени на ближайшие 30 дней.
              </p>
            ) : (
              <div className="schedule-modal-scroll" ref={modalScrollRef}>
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
                            className="slot-btn"
                          >
                            {formatSlotTime(slot.start)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
