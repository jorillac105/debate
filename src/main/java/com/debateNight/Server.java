package com.debateNight;
import com.debateNight.controllers.NodesController;
import com.debateNight.controllers.PlayersController;
import com.debateNight.controllers.GamesController;
import com.debateNight.repositories.NodeNotFoundException;
import com.debateNight.repositories.PlayerNotFoundException;
import com.debateNight.repositories.GameNotFoundException;
import com.debateNight.repositories.NodesRepository;
import com.debateNight.repositories.PlayersRepository;
import com.debateNight.repositories.GamesRepository;
import io.javalin.Javalin;
import java.sql.DriverManager;
import java.sql.SQLException;
import static io.javalin.apibuilder.ApiBuilder.*;

/**
 * Connect the client and the server
 */
public class Server {
    public static void main(String[] args) throws SQLException {
        var connection = DriverManager.getConnection("jdbc:sqlite:debateNight.db");
        var nodesRepository = new NodesRepository(connection);
        var playersRepository = new PlayersRepository(connection);
        var gamesRepository = new GamesRepository(connection);
        var nodesController = new NodesController(nodesRepository);
        var playersController = new PlayersController(playersRepository);
        var gamesController = new GamesController(gamesRepository);

        Javalin.create(config -> { config.addStaticFiles("/public"); })
                .events(event -> {
                    event.serverStopped(() -> { connection.close(); });
                })
                .routes(() -> {
                    path("nodes", () -> {
                        get(nodesController::getAll);
                        post(nodesController::create);
                        path(":identifier", () -> {
                            put(nodesController::update);
                        });
                    });
                    path("players", () -> {
                        get(playersController::currentPlayer);
                        post(playersController::signup);
                        path("username", () -> {
                            post(playersController::username);
                        });
                        path(":username", () -> {
                            path("score", () -> {
                                put(playersController::updateScore);
                            });
                            path("status", () -> {
                                put(playersController::updateStatus);
                            });
                        });
                    });
                    path("games", () -> {
                        get(gamesController::getAll);
                        post(gamesController::create);
                        path(":identifier", () -> {
                            path("status", () -> {
                                put(gamesController::updateStatus);
                            });
                            path("proPlayer", () -> {
                                put(gamesController::updateProPlayer);
                            });
                            path("conPlayer", () -> {
                                put(gamesController::updateConPlayer);
                            });
                        });
                    });
                })
                .exception(NodeNotFoundException.class, (e, ctx) -> { ctx.status(404); })
                .start(System.getenv("PORT") == null ? 7000 : Integer.parseInt(System.getenv("PORT")));
    }
}
