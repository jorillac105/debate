package com.debateNight.repositories;
import com.debateNight.models.Game;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Controls access to a Game database in SQL. Can get, create, or update a Game- primarily through status modifications.
 */
public class GamesRepository {
    private Connection connection;

    /**
     * Create table of game objects in the SQL database.
     */
    public GamesRepository(Connection connection) throws SQLException {
        this.connection = connection;
        var statement = connection.createStatement();
        statement.execute("CREATE TABLE IF NOT EXISTS games (identifier INTEGER PRIMARY KEY AUTOINCREMENT," +
                " status TEXT, proPlayer TEXT, conPlayer TEXT)");
        statement.close();
    }

    /**
     * Gets all of the current games in the database
     */
    public List<Game> getAll() throws SQLException {
        var games = new ArrayList<Game>();
        var statement = connection.createStatement();
        var result = statement.executeQuery("SELECT identifier, status, proPlayer, conPlayer FROM games");
        while (result.next()) {
            games.add(
                    new Game(
                            result.getInt("identifier"),
                            result.getString("status"),
                            result.getString("proPlayer"),
                            result.getString("conPlayer")
                    )
            );
        }
        result.close();
        statement.close();
        return games;
    }

    /**
     * Get one game in the database given their identifier.
     */
    public Game getOne(int identifier) throws SQLException, GameNotFoundException {
        var statement = connection.prepareStatement("SELECT identifier, status, proPlayer, conPlayer FROM games WHERE identifier = ?");
        statement.setInt(1, identifier);
        var result = statement.executeQuery();
        try {
            if (result.next()) {
                return new Game(
                        result.getInt("identifier"),
                        result.getString("status"),
                        result.getString("proPlayer"),
                        result.getString("conPlayer")
                );
            } else {
                throw new GameNotFoundException();
            }
        }
        finally {
            statement.close();
            result.close();
        }
    }

    /**
     * Create a new node from a node object given by the controller.
     */
    public void create(String status, String proPlayer, String conPlayer) throws SQLException {
        var statement = connection.prepareStatement("INSERT INTO games (status, proPlayer, conPlayer) VALUES (?, ?, ?)");
        statement.setString(1, status);
        statement.setString(2, proPlayer);
        statement.setString(3, conPlayer);
        statement.execute();
        statement.close();
    }

    /**
     * Updates a game status given its identifier
     */
    public void updateStatus(Game game) throws SQLException, GameNotFoundException {
        var statement = connection.prepareStatement("UPDATE games SET status = ? WHERE identifier = ?");
        statement.setString(1, game.getStatus());
        statement.setInt(2, game.getIdentifier());
        try {
            if (statement.executeUpdate() == 0) throw new GameNotFoundException();
        } finally {
            statement.close();
        }
    }

    /**
     * Updates a game's pro player given its identifier
     */
    public void updateProPlayer(Game game) throws SQLException, GameNotFoundException {
        var statement = connection.prepareStatement("UPDATE games SET proPlayer = ? WHERE identifier = ?");
        statement.setString(1, game.getProPlayer());
        statement.setInt(2, game.getIdentifier());
        try {
            if (statement.executeUpdate() == 0) throw new GameNotFoundException();
        } finally {
            statement.close();
        }
    }

    /**
     * Updates a game's con player given its identifier
     */
    public void updateConPlayer(Game game) throws SQLException, GameNotFoundException {
        var statement = connection.prepareStatement("UPDATE games SET conPlayer = ? WHERE identifier = ?");
        statement.setString(1, game.getConPlayer());
        statement.setInt(2, game.getIdentifier());
        try {
            if (statement.executeUpdate() == 0) throw new GameNotFoundException();
        } finally {
            statement.close();
        }
    }
}

