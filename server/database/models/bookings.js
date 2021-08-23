export function getAttributes(sequelize, DataTypes) {
    return {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            field: 'user_id',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
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
            field: 'created_at',
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.fn('now')
        },
        deletedAt: {
            field: 'created_at',
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.fn('now')
        },
        cabId: {
            field: 'cab_id',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'cabs',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }
}

export function model(sequelize, DataTypes) {
    const bookings = sequelize.define('bookings', getAttributes(sequelize, DataTypes), {
        tableName: 'bookings',
        paranoid: true,
        timestamps: true
    });
    bookings.associate = function(models) {
        bookings.belongsTo(models.addresses, {
            targetKey: 'id',
            sourceKey: 'address_id'
        });
    };
    return bookings;
}