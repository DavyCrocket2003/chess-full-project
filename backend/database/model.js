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
      unique: true,
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
    pieceStyle: {
      type: DataTypes.ENUM('old', 'new'),
      defaultValue: 'new'
    },
    playSound: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    onBottom: {
        type: DataTypes.ENUM('regular', 'flipped'),
        defaultValue: 'regular',
    },
    showMoves: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    bio: {
        type: DataTypes.TEXT,
        defaultValue: 'Your computerbox needs words!'
    },
    photoURL: {
        type: DataTypes.STRING,
        defaultValue: 'https://video-images.vice.com/articles/57c66daba81c526c72f78570/lede/homestar.gif'
    },
    country: {
        type: DataTypes.STRING,
        defaultValue: 'Free Country USA'
    },
    birthYear: {
        type: DataTypes.INTEGER,
    },
    publicRating: {
        type: DataTypes.INTEGER,
        defaultValue: 1200,
    },
    privateRating: {
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
    uuid: {
      type: DataTypes.UUID,
      unique: true,
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
    },
    result: {
      type: DataTypes.ENUM('1-0', '0-1', '½-½'), // Represents white win, black win, or draw.
      allowNull: false,
    },
    player1Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    player2Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
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
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('normal', 'senderDeleted', 'receiverDeleted'),
      defaultValue: 'normal'
    }
  },
  {
    sequelize: db,
    modelName: 'message'
  }
)

export class Friendship extends Model {
  [util.inspect.custom]() {
    return this.toJSON()
  }
}
Friendship.init(
  {
    friendshipId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user1Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      allowNull: false,
    },
    user2Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    requestedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'friendship'
  }
)






// Set up foreign keys
User.hasMany(Game, { as: 'player1', foreignKey: 'player1Id'})
User.hasMany(Game, { as: 'player2', foreignKey: 'player2Id'})
Game.belongsTo(User)


User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
