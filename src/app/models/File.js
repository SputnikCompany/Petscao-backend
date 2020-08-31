import Sequelize from 'sequelize';

class File extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.API_URL}${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );
  }
}

export default File;
