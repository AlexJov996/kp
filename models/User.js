const { Sequelize } = require("sequelize");

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            fullName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
              type: Sequelize.STRING,
              allowNull: false,
            },

        }, {
            paranoid: true,
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
        }
    );

    User.associate = (models) => {
      User.hasMany(models.Product,  {foreignKey: 'userId'});
    };

    return User;
};
