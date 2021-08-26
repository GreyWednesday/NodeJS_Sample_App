export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    addressId: {
      field: 'address_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'addresses',
        key: 'id'
      }
    },
    bookingId: {
      field: 'booking_id',
      type: DataTypes.INTEGER,
      references: {
        model: 'bookings',
        key: 'id'
      }
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('now')
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedAt: {
      field: 'deleted_at',
      type: DataTypes.DATE,
      allowNull: true
    }
  };
}

export function model(sequelize, DataTypes) {
  const cabs = sequelize.define('cabs', getAttributes(sequelize, DataTypes), {
    tableName: 'cabs',
    paranoid: true,
    timestamps: true
  });
  cabs.associate = function(models) {
    cabs.belongsTo(models.addresses, {
      targetKey: 'id',
      sourceKey: 'address_id'
    });
    cabs.belongsTo(models.bookings, {
      targetKey: 'id',
      sourceKey: 'booking_id'
    });
  };
  return cabs;
}
