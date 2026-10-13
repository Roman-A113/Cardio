# Уральский институт кардиологии — веб-платформа

Клиентский сервис (запись на приём, врачи, программы лечения — по ТЗ) и имидж (юбилейная страница 2026).
Backend — Node.js + Fastify + TypeScript, frontend — React (Vite), БД — PostgreSQL + Prisma, инфраструктура — Docker.

## Структура

- `server/` — API (Fastify + Prisma), http://localhost:3000
- `client/` — фронтенд (React + Vite), http://localhost:5173
- `docker-compose.yml` — PostgreSQL 16 (наружу на `localhost:5433`)

Это не монорепо: `server/` и `client/` — независимые npm-пакеты. Корневой `package.json` только для Prettier.

## Требования

- Node.js 20+
- Docker

## Быстрый старт

1. Установи зависимости в трёх местах:

   ```bash
   npm install
   cd server && npm install && cd ..
   cd client && npm install && cd ..
   ```

2. Создай `.env` из шаблонов:

   ```bash
   cp .env.example .env                  # настройки Docker/БД
   cp server/.env.example server/.env    # настройки приложения
   ```

   В `server/.env` подставь свой `JWT_SECRET`:

   ```bash
   openssl rand -hex 32
   ```

3. Подними БД и накати миграцию:

   ```bash
   docker compose up -d
   cd server && npx prisma migrate dev && cd ..
   ```

4. Запусти сервер и клиент в двух терминалах:

   ```bash
   cd server && npm run dev   # http://localhost:3000
   cd client && npm run dev   # http://localhost:5173
   ```

## Скрипты

| Где     | Команда                        | Что делает                          |
|---------|--------------------------------|-------------------------------------|
| корень  | `npm run format`               | Prettier по всему проекту           |
| server  | `npm run dev` / `npm start`    | dev-режим (tsx watch) / прод-запуск |
| server  | `npm run build`                | сборка (typecheck, strict)          |
| server  | `npx prisma migrate dev --name <имя>` | миграция + перегенерация клиента |
| client  | `npm run dev`                  | Vite-dev-сервер                     |
| client  | `npm run lint`                 | ESLint                              |
| client  | `npm run build`                | `tsc -b && vite build`              |

## Проверка перед сдачей

- `client/`: `npm run lint && npm run build`
- `server/`: `npm run build`

## Секреты

Все `.env` намеренно в `.gitignore` — не коммитить. Секреты подставляются из `.env`:
корневой — для `docker-compose.yml` (интерполяция `${...}`), `server/.env` — для приложения (`dotenv`).