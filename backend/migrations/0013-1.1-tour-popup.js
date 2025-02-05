'use strict';

const TABLE_NAME = 'tour_popup';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        TABLE_NAME,
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          title: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          targetElement: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          url: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          order: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
          },
          target: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: true,
          },
          tourId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'tours',
              key: 'id',
            },
          },
        },
        { transaction }
      );

      // Commit the transaction
      await transaction.commit();
    } catch (error) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
