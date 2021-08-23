export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      field: 'first_name',
      type: DataTypes.TEXT,
      allowNull: false
    },
    lastName: {
      field: 'last_name',
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    password: {
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
  const users = sequelize.define('users', getAttributes(sequelize, DataTypes), {
    tableName: 'users',
    paranoid: true,
    timestamps: true
  });
  
  users.associate = function(models) {
    users.belongsTo(models.addresses, {
      targetKey: 'id',
      sourceKey: 'address_id'
    })
  }
  return users;
}
