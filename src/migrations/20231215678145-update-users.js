'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'g_id', {
      type: Sequelize.BIGINT,
    });
    await queryInterface.addColumn('Users', 'f_id', {
      type: Sequelize.BIGINT,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'g_id');
    await queryInterface.removeColumn('Users', 'f_id');
  },
};
