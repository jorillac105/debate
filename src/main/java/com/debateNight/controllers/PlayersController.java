package com.debateNight.controllers;
import at.favre.lib.crypto.bcrypt.BCrypt;
import com.debateNight.models.Player;
import com.debateNight.repositories.PlayersRepository;
import com.debateNight.repositories.PlayerNotFoundException;
import com.fasterxml.jackson.databind.deser.std.DateDeserializers;
import io.javalin.http.Context;
import io.javalin.http.ForbiddenResponse;

import java.sql.SQLException;

/**
 * Accesses the player repository to get/fetch player data.
 */
public class PlayersController {
    private PlayersRepository playersRepository;

    public PlayersController(PlayersRepository playersRepository) {
        this.playersRepository = playersRepository;
    }

    /**
     * Create a new player given new login information.
     * @param ctx
     * @throws SQLException - mistake in database
     */
    public void signup(Context ctx) throws SQLException {
        // get new player information from the form
        var username = ctx.formParam("username");
        var password = ctx.formParam("password");
        var score = Integer.parseInt(ctx.formParam("score"));
        var status = ctx.formParam("status");

        var newPassword = BCrypt.withDefaults().hashToString(12, password.toCharArray());
        // create the player and send it to the repository (and set a cookie)
        Player player = new Player(username, newPassword, score, status);
        playersRepository.create(player);
        ctx.sessionAttribute("player", player);
        ctx.status(201);
    }

    /**
     * Allow a returning player to login to the app (checks password)
     * @param ctx
     * @throws SQLException - error in database
     * @throws PlayerNotFoundException - player does not exist
     */
    public void username(Context ctx) throws SQLException, PlayerNotFoundException {
        var player = playersRepository.getOne(ctx.formParam("username", ""));
        // check to see if you entered the right password
        if (!BCrypt.verifyer().verify(ctx.formParam("password", "").toCharArray(), player.getPassword()).verified) {
            throw new ForbiddenResponse();
        }
        // set a cookie with your current information and return a "success" status
        ctx.sessionAttribute("player", player);
        ctx.status(200);
    }

    /**
     * Updates score given news from clientside
     * @param ctx
     * @throws SQLException - mistake in DB
     * @throws PlayerNotFoundException - player doesn't exist
     */
    public void updateScore(Context ctx) throws SQLException, PlayerNotFoundException {
        var player = playersRepository.getOne(ctx.pathParam("username", String.class).get());
        var score = Integer.parseInt(ctx.formParam("score", ""));
        player.setScore(score);
        playersRepository.updateScore(player);
        ctx.sessionAttribute("player", player);
        ctx.status(204);
    }

    /**
     * Updates status given news from clientside
     * @param ctx
     * @throws SQLException - mistake in DB
     * @throws PlayerNotFoundException - player doesn't exist
     */
    public void updateStatus(Context ctx) throws SQLException, PlayerNotFoundException {
        // update in repository the status
        var player = playersRepository.getOne(ctx.pathParam("username", String.class).get());
        var status = ctx.formParam("status", "");
        player.setStatus(status);
        playersRepository.updateStatus(player);
        ctx.sessionAttribute("player", player);
        ctx.status(204);
    }

    /**
     * Figures out who is currently playing the game using cookies.
     * @param ctx
     * @return the player object if found; otherwise, throw ForbiddenResponse
     */
    public Player currentPlayer(Context ctx) {
        var player = (Player) ctx.sessionAttribute("player");
        if (player == null) throw new ForbiddenResponse();
        ctx.json(player);
        return player;
    }
}
