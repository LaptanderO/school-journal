# 🏫 Школьный журнал (School Journal)

[![CI/CD Pipeline](https://github.com/laptandero/school-journal/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/laptandero/school-journal/actions/workflows/ci-cd.yml)

[![Docker Pulls](https://img.shields.io/docker/pulls/laptandero/school-journal-backend)](https://hub.docker.com/r/laptandero/school-journal-backend)

Полноценное веб-приложение для управления школьным журналом с SRE-подходом: мониторинг, контейнеризация, CI/CD.

---

## 📋 Функциональность

### CRUD для 5 сущностей

- 👨‍🎓 **Ученики** — управление списком учеников
- 👩‍🏫 **Учителя** — управление преподавателями
- 📚 **Предметы** — учебные дисциплины
- 🏫 **Классы** — классы с классными руководителями
- 📊 **Журнал оценок** — выставление и просмотр оценок

### Особые признаки (поиск и фильтрация)

- 📋 Список учеников по классу
- 📈 Средний балл ученика
- ⚠️ Должники (оценка "2")
- 📊 Отчёт по классу (средние баллы по предметам)
- 📉 Статистика по предмету
- 👨‍🏫 Нагрузка учителя

### Авторизация

- 🔐 JWT-токены
- 👑 Роли: `admin` и `teacher`
- 🛡️ Защищённые эндпоинты
- 👤 Личный кабинет

---

## 🛠️ Технологический стек

| Слой                 | Технология                         |
| :------------------- | :--------------------------------- |
| **Frontend**         | React + Vite + React Router        |
| **Backend**          | Node.js + Express + Sequelize ORM  |
| **Database**         | PostgreSQL                         |
| **Мониторинг**       | Prometheus + Grafana               |
| **Контейнеризация**  | Docker + Docker Compose            |
| **CI/CD**            | GitHub Actions                     |
| **Dev Environment**  | VS Code Dev Containers             |

---

## 🚀 Быстрый старт

### Предварительные требования

- Docker Desktop
- Node.js 20+
- VS Code (опционально, для Dev Containers)

### Способ 1: Локальная разработка (Dev Container)

```bash
# Клонировать репозиторий
git clone https://github.com/laptandero/school-journal.git
cd school-journal

# Открыть в VS Code
code .

# Нажать F1 → "Dev Containers: Reopen in Container"
# Дождаться сборки контейнера

# В терминале VS Code (бэкенд):
npm install
npm run dev

# Во втором терминале (фронтенд):
cd frontend
npm install
npm run dev
```

### Способ 2: Продакшен (Docker Compose)

```bash
# Клонировать репозиторий
git clone https://github.com/laptandero/school-journal.git
cd school-journal

# Запустить все сервисы
docker-compose -f docker-compose.prod.yml up -d

# Создать админа
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","role":"admin"}'
```

### Способ 3: Из Docker Hub (только образы)

```bash
wget https://raw.githubusercontent.com/laptandero/school-journal/main/docker-compose.ci.yml
docker-compose -f docker-compose.ci.yml up -d
```

---

## 🌐 Доступ к приложению

| Сервис           | URL                           | Логин/Пароль      |
| :--------------- | :---------------------------- | :---------------- |
| **Приложение**   | http://localhost (80)         | admin / admin123  |
| **Backend API**  | http://localhost:3000         | —                 |
| **Prometheus**   | http://localhost:9090         | —                 |
| **Grafana**      | http://localhost:3001         | admin / admin     |
| **Метрики**      | http://localhost:3000/metrics | —                 |

---

## 📡 API Эндпоинты

### Аутентификация

| Метод  | URL                   | Описание     | Доступ   |
| :----- | :-------------------- | :----------- | :------- |
| POST   | `/api/auth/register`  | Регистрация  | Открытый |
| POST   | `/api/auth/login`     | Вход         | Открытый |
| GET    | `/api/auth/me`        | Профиль      | 🔐       |

### Ученики

| Метод   | URL                             | Описание           | Доступ           |
| :------ | :------------------------------ | :----------------- | :--------------- |
| GET     | `/api/students`                 | Список учеников    | Открытый         |
| GET     | `/api/students/:id`             | Ученик по ID       | Открытый         |
| POST    | `/api/students`                 | Создать ученика    | 🔐 admin/teacher |
| PUT     | `/api/students/:id`             | Обновить ученика   | 🔐 admin/teacher |
| DELETE  | `/api/students/:id`             | Удалить ученика    | 🔐 admin         |
| GET     | `/api/students/class/:classId`  | Ученики по классу  | Открытый         |
| GET     | `/api/students/:id/average`     | Средний балл       | Открытый         |

### Учителя

| Метод   | URL                           | Описание          | Доступ   |
| :------ | :---------------------------- | :---------------- | :------- |
| GET     | `/api/teachers`               | Список учителей   | Открытый |
| GET     | `/api/teachers/:id`           | Учитель по ID     | Открытый |
| POST    | `/api/teachers`               | Создать учителя   | 🔐 admin |
| PUT     | `/api/teachers/:id`           | Обновить учителя  | 🔐 admin |
| DELETE  | `/api/teachers/:id`           | Удалить учителя   | 🔐 admin |
| GET     | `/api/teachers/:id/workload`  | Нагрузка учителя  | Открытый |

### Предметы

| Метод   | URL                             | Описание          | Доступ   |
| :------ | :------------------------------ | :---------------- | :------- |
| GET     | `/api/subjects`                 | Список предметов  | Открытый |
| POST    | `/api/subjects`                 | Создать предмет   | 🔐 admin |
| DELETE  | `/api/subjects/:id`             | Удалить предмет   | 🔐 admin |
| GET     | `/api/subjects/:id/statistics`  | Статистика        | Открытый |

### Классы

| Метод   | URL                                | Описание        | Доступ   |
| :------ | :--------------------------------- | :-------------- | :------- |
| GET     | `/api/classes`                     | Список классов  | Открытый |
| POST    | `/api/classes`                     | Создать класс   | 🔐 admin |
| DELETE  | `/api/classes/:id`                 | Удалить класс   | 🔐 admin |
| GET     | `/api/classes/:id/students-count`  | Число учеников  | Открытый |

### Оценки

| Метод  | URL                                 | Описание          | Доступ           |
| :----- | :---------------------------------- | :---------------- | :--------------- |
| GET    | `/api/grades`                       | Список оценок     | Открытый         |
| POST   | `/api/grades`                       | Поставить оценку  | 🔐 admin/teacher |
| GET    | `/api/grades/failing`               | Должники          | Открытый         |
| GET    | `/api/grades/class/:classId/report` | Отчёт по классу   | Открытый         |

---

## 📊 Мониторинг

### Prometheus метрики

- `http_requests_total` — HTTP запросы
- `http_request_duration_seconds` — Время ответа
- `school_students_created_total` — Создано учеников
- `school_teachers_created_total` — Создано учителей
- `school_grades_given_total` — Выставлено оценок
- `school_db_connections` — Соединения с БД

### Grafana дашборд

Импортируйте готовый дашборд из `monitoring/grafana-dashboard.json`

---

## 📁 Структура проекта

```
school-journal/
├── .devcontainer/           # Dev Container конфигурация
├── .github/workflows/       # CI/CD pipeline
├── docker/                  # Dockerfile для бэкенда и фронтенда
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── init.sql             # Начальные данные БД
├── frontend/                # React приложение
│   ├── src/
│   │   ├── components/      # React компоненты
│   │   ├── pages/           # Страницы
│   │   ├── services/        # API клиент
│   │   └── hooks/           # Кастомные хуки
│   └── package.json
├── monitoring/              # Prometheus и Grafana
│   ├── prometheus.yml
│   └── grafana-dashboard.json
├── nginx/                   # Конфигурация Nginx
│   └── nginx.conf
├── src/                     # Backend
│   ├── config/              # Конфигурация БД
│   ├── controllers/         # Контроллеры
│   ├── middleware/          # JWT middleware
│   ├── models/              # Sequelize модели
│   └── routes/              # Express роуты
├── docker-compose.yml       # Dev окружение
├── docker-compose.prod.yml  # Продакшен окружение
├── docker-compose.ci.yml    # Окружение из Docker Hub
├── seed.js                  # Заполнение БД тестовыми данными
└── README.md
```

---

## 🔑 Тестовые аккаунты

| Логин       | Пароль       | Роль           |
| :---------- | :----------- | :------------- |
| `admin`     | `admin123`   | Администратор  |
| `teacher1`  | `teacher123` | Учитель        |

---

## 📝 Лицензия

MIT

---

## 📧 Контакты

[GitHub](https://github.com/laptandero)

---
