package com.debateNight.models;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class NodeTests {
    @Test
    void testConstructing(){
        var node = new Node(1, 20, 20, 0, 0, "status", "player1", "desc");
        assertEquals(1, node.getIdentifier());
        assertEquals(20, node.getX());
        assertEquals(20, node.getY());
        assertEquals(0, node.getParentx());
        assertEquals(0, node.getParenty());
        assertEquals("status", node.getStatus());
        assertEquals("player1", node.getOwner());
        assertEquals("desc", node.getDescription());
    }
    @Test
    void testGettersAndSetters(){
        var node = new Node(1, 20, 20, 0, 0, "status", "player1", "desc");
        node.setIdentifier(12);
        node.setX(45);
        node.setY(30);
        node.setParentx(25);
        node.setParenty(30);
        node.setStatus("other status");
        node.setOwner("player2");
        node.setDescription("other description");
        assertEquals(12, node.getIdentifier());
        assertEquals(45, node.getX());
        assertEquals(30, node.getY());
        assertEquals(25, node.getParentx());
        assertEquals(30, node.getParenty());
        assertEquals("other status", node.getStatus());
        assertEquals("player2", node.getOwner());
        assertEquals("other description", node.getDescription());
    }
}
