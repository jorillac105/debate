package com.debateNight.models;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class PlayerTests {
    @Test
    void testConstructing() {
        var player = new Player("player1", "password", 0, "good");
        assertEquals("player1", player.getUsername());
        assertEquals("password", player.getPassword());
        assertEquals(0, player.getScore());
        assertEquals("good", player.getStatus());
    }
    @Test
    void testSettersAndGetters() {
        var player = new Player("player1", "password", 0, "good");
        player.setUsername("player2");
        player.setPassword("01234");
        player.setScore(100);
        player.setStatus("great");
        assertEquals("player2", player.getUsername());
        assertEquals("01234", player.getPassword());
        assertEquals(100, player.getScore());
        assertEquals("great", player.getStatus());
    }
}
