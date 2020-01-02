package com.debateNight.models;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class GameTests {
    @Test
    void testConstructing(){
        var game = new Game(0, "in progress", "player1", "player2");
        assertEquals("in progress", game.getStatus());
        assertEquals("player1", game.getProPlayer());
        assertEquals("player2", game.getConPlayer());
        assertEquals(0, game.getIdentifier());
    }

    @Test
    void testSettersAndGetters(){
        var game = new Game(0, "in progress", "player1", "player2");
        game.setStatus("finished");
        game.setProPlayer("player11");
        game.setConPlayer("player22");
        assertEquals("finished", game.getStatus());
        assertEquals("player11", game.getProPlayer());
        assertEquals("player22", game.getConPlayer());
        assertEquals(0, game.getIdentifier());
    }
}
