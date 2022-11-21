'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Accounts',
      [
        {
          balance: 100.0,
        },
        {
          balance: 100.0,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Accounts', null, {});
  },
};
