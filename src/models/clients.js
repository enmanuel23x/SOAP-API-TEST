/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const clients = sequelize.define('clients', {
    cliId: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'cli_id'
    },
    cliDoc: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'cli_doc'
    },
    cliMail: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'cli_mail'
    },
    cliName: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'cli_name'
    },
    cliPhone: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'cli_phone'
    },
    cliWallet: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'cli_wallet'
    }
  }, {
    tableName: 'clients',
    timestamps: false // no imprime valores por defecto
  });

  return clients;
};
