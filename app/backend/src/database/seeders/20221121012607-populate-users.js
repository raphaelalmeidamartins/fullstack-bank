'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 1,
          username: 'raphaelmartins',
          password:
            '$2a$10$fSZZa/tIodeeOJ.JGn6IbuP9QZ44gaN0b1.XCAis/VgNDM.XXlTmC',
          accountId: 1,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
