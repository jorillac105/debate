package com.debateNight.controllers;
import com.debateNight.repositories.NodeNotFoundException;
import com.debateNight.repositories.NodesRepository;
import io.javalin.http.Context;
import java.sql.SQLException;

/**
 * Calls methods in the NodesRepository and converts responses to json format.
 */
public class NodesController {
    private NodesRepository nodesRepository;

    public NodesController(NodesRepository nodesRepository) {
        this.nodesRepository = nodesRepository;
    }

    /**
     * Gets all of the existing nodes
     * @param ctx
     * @throws SQLException - mistake in database
     */
    public void getAll(Context ctx) throws SQLException {
        ctx.json(nodesRepository.getAll());
    }

    /**
     * Creates a new node
     * @param ctx
     * @throws SQLException - mistake in database
     */
    public void create(Context ctx) throws SQLException {
        var description = ctx.formParam("description");
        var x = Integer.parseInt(ctx.formParam("x"));
        var y = Integer.parseInt(ctx.formParam("y"));
        var parentx = Integer.parseInt(ctx.formParam("parentx"));
        var parenty = Integer.parseInt(ctx.formParam("parenty"));
        var status = ctx.formParam("status");
        nodesRepository.create(x ,y, parentx, parenty, description, status);
        ctx.status(201);
    }

    /**
     * Updates an existing node
     * @param ctx
     * @throws SQLException - mistake in database
     * @throws NodeNotFoundException - node does not exist
     */
    public void update(Context ctx) throws SQLException, NodeNotFoundException {
        var node = nodesRepository.getOne(ctx.pathParam("identifier", Integer.class).get());
        var status = ctx.formParam("status", "");
        node.setStatus(status);
        nodesRepository.updateStatus(node);
        ctx.status(204);
    }

    /**
     * SCORING occurring at the end of the debate
     * @param ctx the context that the game is in
     * @return True if player 1 wins and player 2 looses; False if player 1 looses and player 2 wins
     */
    public Boolean winner(Context ctx) {

        return false;
    }
}
