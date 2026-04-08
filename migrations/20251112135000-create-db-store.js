'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_store', {
      credId: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
        field: 'cred_id',
      },
      dbName: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
        field: 'db_name',
      },
      userName: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
        field: 'user_name',
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
        field: 'password',
      },
      host: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
        field: 'host',
      },
      port: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
        field: 'port',
      },
      org_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        field: 'org_id',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updated_at',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('db_store');
  },
};
