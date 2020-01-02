package com.debateNight.repositories;
import com.debateNight.models.Player;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * Controls the access to the database for the player object. Can get, create, and update a Player.
 */
public class PlayersRepository {
    private Connection connection;

    /**
     * Create table of player objects in the SQL database.
     */
    public PlayersRepository(Connection connection) throws SQLException {
        this.connection = connection;
        var statement = connection.createStatement();
        statement.execute("CREATE TABLE IF NOT EXISTS players (username TEXT PRIMARY KEY, password TEXT, score INTEGER, status TEXT)");
        statement.close();
    }

    /**
     * Get one player in the database given their username. Note that this doesn't check if the password is correct! (see Controller)
     */
    public Player getOne(String username) throws SQLException, PlayerNotFoundException {
        var statement = connection.prepareStatement("SELECT username, password, score, status FROM players WHERE username = ?");
        statement.setString(1, username);
        var result = statement.executeQuery();
        try {
            if (result.next()) {
                return new Player(
                        result.getString("username"),
                        result.getString("password"),
                        result.getInt("score"),
                        result.getString("status")
                );
            } else {
                throw new PlayerNotFoundException();
            }
        }
        finally {
            statement.close();
            result.close();
        }
    }

    /**
     * Create a new player from a player object given by the controller.
     */
    public void create(Player player) throws SQLException {
            var statement = connection.prepareStatement("INSERT INTO players (username, password, score, status) VALUES (?, ?, ?, ?)");
            statement.setString(1, player.getUsername());
            statement.setString(2, player.getPassword());
            statement.setInt(3, player.getScore());
            statement.setString(4, player.getStatus());
            try {
                if (statement.executeUpdate() == 0) throw new SQLException();
            } finally {
                statement.close();
            }
    }

    /**
     * Updates a player status given its username
     */
    public void updateStatus(Player player) throws SQLException, PlayerNotFoundException {
        var statement = connection.prepareStatement("UPDATE players SET status = ? WHERE username = ?");
        statement.setString(1, player.getStatus());
        statement.setString(2, player.getUsername());
        try {
            if (statement.executeUpdate() == 0) throw new PlayerNotFoundException();
        } finally {
            statement.close();
        }
    }

    /**
     * Updates a player's score given its username
     */
    public void updateScore(Player player) throws SQLException, PlayerNotFoundException {
        var statement = connection.prepareStatement("UPDATE players SET score = ? WHERE username = ?");
        statement.setInt(1, player.getScore());
        statement.setString(2, player.getUsername());
        try {
            if (statement.executeUpdate() == 0) throw new PlayerNotFoundException();
        } finally {
            statement.close();
        }
    }
}
