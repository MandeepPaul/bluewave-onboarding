const { validateHexColor, validateActionButton, ensureValidRepetitionOption } = require('../utils/guide.helper');
const { validatePositionWrapper, validateUrl, validateRelativeUrl } = require('../utils/banner.helper');

module.exports = (sequelize, DataTypes) => {
  const Banner = sequelize.define(
    'Banner',
    {
      closeButtonAction: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      repetitionType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'show only once',
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fontColor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '#FFFFFF',
      },
      backgroundColor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '#FFFFFF',
      },
      bannerText: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      actionUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      tableName: 'banners',
      timestamps: false,
    }
  );

  Banner.associate = (models) => {
    Banner.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  };
  return Banner;
};
