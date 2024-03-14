'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Posts', 'category');
    await queryInterface.addColumn('Posts', 'categoryId', {
      type: Sequelize.BIGINT,
      references: {
        model: 'Category',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Posts', 'categoryId');
  },
};
