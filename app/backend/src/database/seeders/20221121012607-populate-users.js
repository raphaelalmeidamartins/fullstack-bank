'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'raphaelmartins',
          password:
            '$2a$10$fSZZa/tIodeeOJ.JGn6IbuP9QZ44gaN0b1.XCAis/VgNDM.XXlTmC',
          accountId: 1,
        },
        {
          username: 'daniloputinato',
          password:
            '$2a$10$fSZZa/tIodeeOJ.JGn6IbuP9QZ44gaN0b1.XCAis/VgNDM.XXlTmC',
          accountId: 2,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
