// db.service.js
const { ServiceBroker } = require("moleculer");
const { DbService } = require("moleculer-db");
const { Pool } = require("pg");

const broker = new ServiceBroker();

const pool = new Pool({
  user: "amir",
  host: "localhost",
  database: "practie",
  password: "aa346134aa",
  port: 5432,
});

module.exports = {
  name: "db",

  started() {
    // Подключение к базе данных при запуске сервиса
    this.pool = pool;
  },

  actions: {
    // Метод для выполнения сырых SQL-запросов
    async executeRawSQL(ctx) {
      const { query, params } = ctx.params;
      try {
        // Выполняем собственный запрос к базе данных
        const result = await this.pool.query(query, params);
        return result.rows;
      } catch (error) {
        console.error(error);
        return { error: "Ошибка при выполнении запроса к базе данных" };
      }
    },
  },

  stopped() {
    // Закрытие подключения при остановке сервиса
    this.pool.end();
  },
};

// Экспорт брокера для использования в других местах, если необходимо
module.exports.broker = broker;
