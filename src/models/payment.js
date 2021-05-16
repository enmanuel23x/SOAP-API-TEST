/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    const payment = sequelize.define('payment', {
      payId: {
        autoIncrement: true,
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        field: 'pay_id'
      },
      cliSrc: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'cli_src',
        references: {
          model: {
            tableName: 'clients',
          },
          key: 'cli_id'
        }
      },
      cliDest: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'cli_dest',
        references: {
          model: {
            tableName: 'clients',
          },
          key: 'cli_id'
        }
      },
      payValue: {
        type: DataTypes.STRING(150),
        allowNull: false,
        field: 'pay_value'
      },
      payStatus: {
        type: DataTypes.STRING(150),
        allowNull: false,
        field: 'pay_status'
        /* 
        0: en proceso
        1: aprobado
        2: anulado
        */
      },
      payTokenValidation: {
        type: DataTypes.STRING(256),
        allowNull: false,
        field: 'pay_token_validation'
      },
    }, {
      tableName: 'payment',
      timestamps: false // no imprime valores por defecto
    });
    
    payment.associate = function(models) {
        models.payment.belongsTo(models.clients,{
          as: 'clients_src',
          foreignKey: 'cli_src'
        });
        models.payment.belongsTo(models.clients,{
            as: 'clients_dest',
            foreignKey: 'cli_dest'
          });
      };
    return payment;
  };
  