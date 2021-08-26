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
            field: 'updated_at',
            type: DataTypes.DATE,
            allowNull: true
        },
        deletedAt: {
            field: 'deleted_at',
            type: DataTypes.DATE,
            allowNull: true
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
        bookings.belongsTo(models.users, {
            targetKey: 'id',
            sourceKey: 'user_id'
        });
        bookings.belongsTo(models.cabs, {
            targetKey: 'id',
            sourceKey: 'cab_id'
        });
    };
    return bookings;
}