package com.debateNight.controllers;
import com.debateNight.repositories.GamesRepository;
import com.debateNight.repositories.GameNotFoundException;
import io.javalin.http.Context;
import java.sql.SQLException;


/**
 * GameController class moderating the Game via its status
 */
public class GamesController {
    private GamesRepository gamesRepository;

    public GamesController(GamesRepository gamesRepository) {
        this.gamesRepository = gamesRepository;
    }

    /**
     * Gets all of the existing games
     * @param ctx
     * @throws SQLException - mistake in database
     */
    public void getAll(Context ctx) throws SQLException {
        ctx.json(gamesRepository.getAll());
    }

    /**
     * Creates a new game with the players and the game's status
     * @param ctx
     * @throws SQLException - mistake in database
     */
    public void create(Context ctx) throws SQLException {
        var status = ctx.formParam("status");
        var proPlayer = ctx.formParam("proPlayer");
        var conPlayer = ctx.formParam("conPlayer");
        gamesRepository.create(status, proPlayer, conPlayer);
        ctx.status(201);
    }

    /**
     * Updates the game status given news from the client side
     * @param ctx
     * @throws SQLException - mistake in database
     * @throws GameNotFoundException - game does not exist
     */
    public void updateStatus(Context ctx) throws SQLException, GameNotFoundException {
        var game = gamesRepository.getOne(ctx.pathParam("identifier", Integer.class).get());
        var status = ctx.formParam("status", "");
        game.setStatus(status);
        gamesRepository.updateStatus(game);
        ctx.status(204);
    }

    /**
     * Updates who the pro player is
     * @param ctx
     * @throws SQLException - mistake in database
     * @throws GameNotFoundException - game does not exist
     */
    public void updateProPlayer(Context ctx) throws SQLException, GameNotFoundException {
        var game = gamesRepository.getOne(ctx.pathParam("identifier", Integer.class).get());
        var proPlayer = ctx.formParam("proPlayer", "");
        game.setProPlayer(proPlayer);
        gamesRepository.updateProPlayer(game);
        ctx.status(204);
    }

    /**
     * Updates who the con player is
     * @param ctx
     * @throws SQLException - mistake in database
     * @throws GameNotFoundException - game does not exist
     */
    public void updateConPlayer(Context ctx) throws SQLException, GameNotFoundException {
        var game = gamesRepository.getOne(ctx.pathParam("identifier", Integer.class).get());
        var conPlayer = ctx.formParam("conPlayer", "");
        game.setConPlayer(conPlayer);
        gamesRepository.updateConPlayer(game);
        ctx.status(204);
    }
}
