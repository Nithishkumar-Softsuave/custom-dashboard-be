'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      userId: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
        field: 'user_id',
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'username',
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: 'password',
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'email',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
      roleId: {
        type: Sequelize.UUID,
        field: 'role_id',
      },
      orgId: {
        type: Sequelize.UUID,
        field: 'org_id',
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
    await queryInterface.dropTable('users');
  },
};
