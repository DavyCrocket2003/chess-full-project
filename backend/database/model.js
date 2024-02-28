import { DataTypes, Model } from 'sequelize';
import util from 'util';
import connectToDB from './db.js';
import { v4 as uuidv4 } from 'uuid'

export const db = await connectToDB('postgresql:///chess');

export class User extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
} 
User.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        uniqe: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    whiteColor: {
        type: DataTypes.STRING,
        defaultValue: '#EAC796',
    },
    blackColor: {
        type: DataTypes.STRING,
        defaultValue: '#583927',
    },
    playSound: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    showMoves: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    bio: {
        type: DataTypes.TEXT,
    },
    photoURL: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING,
    },
    birthYear: {
        type: DataTypes.INTEGER,
    },
    rating: {
        type: DataTypes.INTEGER,
        defaultValue: 1200,
    }
  },
  {
    modelName: 'user',
    sequelize: db,
  }
);

export class Game extends Model {
  [util.inspect.custom]() {
    return this.toJSON()
  }
}
Game.init(
  {
    gameId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    moves: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    player1Time: {
      type: DataTypes.FLOAT
    },
    player2Time: {
      type: DataTypes.FLOAT
    },
    timeControl: {
      type: DataTypes.INTEGER
    },
    rated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },
  {
    sequelize: db,
    modelName: 'game'
  }
)

export class Message extends Model {
    [util.inspect.custom]() {
      return this.toJSON()
    }
  }
  Message.init(
    {
      messageId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      subject: {
        type: DataTypes.STRING
      },
      body: {
        type: DataTypes.TEXT
      },
    },
    {
      sequelize: db,
      modelName: 'message'
    }
  )
export class Seek extends Model {
    [util.inspect.custom]() {
      return this.toJSON()
    }
  }
  Seek.init(
    {
      seekId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      subject: {
        type: DataTypes.STRING
      },
      body: {
        type: DataTypes.TEXT
      },
    },
    {
      sequelize: db,
      modelName: 'message'
    }
  )






// Set up foreign keys
User.hasMany(Game)
Game.belongsTo(User, { as: 'player1' })
Game.belongsTo(User, { as: 'player2' })

User.hasMany(Message)
Message.belongsTo(User, { as: 'sender' })
Message.belongsTo(User, { as: 'receiver' })

