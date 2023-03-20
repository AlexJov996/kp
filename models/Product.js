const { Sequelize } = require("sequelize");

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      images: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      imagesUrls: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      }, {
            paranoid: true,
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
        }
    );

  Product.associate = (models) => {
    Product.belongsTo(models.User, {foreignKey: 'userId', as:'user'});
  };

  return Product;
};
