// services/link.service.js
module.exports = {
    name: 'link',
    actions: {
        async generateLink(ctx) {
            try {
                // Ensure 'name' and 'phoneNumber' parameters exist in the context
                if (!ctx.params.name || !ctx.params.phoneNumber) {
                    throw new Error('Name or Phone Number parameters are missing');
                }

                const result = await this.executeRawSQL(
                    "INSERT INTO users (name, phoneNumber) VALUES (?, ?)",
                    [ctx.params.name, pctx.params.phoneNumber]
                  );
                  
                // Generate a link based on the received data (modify this logic as needed)
                const link = `http://localhost:3000/upload?name=${ctx.params.name}&phoneNumber=${ctx.params.phoneNumber}`;

                // Return the generated link
                return { link };
            } catch (error) {
                console.error(error);
                throw new Error('Link generation failed');
            }
        },
    },
};

// link.service.js
module.exports = {
    name: "link",
  
    actions: {
      async generateLink(ctx) {
        // Извлекаем данные из запроса
        const { name, phoneNumber } = ctx.params;
  
        // Добавляем данные в базу данных через сервис "db"
        const result = await this.broker.call("db.create", {
          entity: "links",
          data: {
            name,
            phoneNumber,
          },
        });
  
        return result;
      },
    },
  };
  