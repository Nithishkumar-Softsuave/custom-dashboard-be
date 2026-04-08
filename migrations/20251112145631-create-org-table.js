'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('org', {
      orgId: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
        field: 'org_id',
      },
      orgName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'org_name',
      },
      clientId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'client_id',
      },
      adminUserId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'admin_user_id',
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
    await queryInterface.dropTable('roles');
  },
};
