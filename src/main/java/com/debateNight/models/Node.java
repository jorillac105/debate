package com.debateNight.models;

/**
 * The Node class defines the basis of the chat bubble. It is linked to other Nodes by keeping track of its parent and
 * its child. The status defines whether or not a chat bubble is a question or a response, and the owner field allows
 * one to keep track of which player posted the bubble (as well as what the color of the bubble should be).
 */
public class Node {
    private int identifier;
    private int x;
    private int y;
    private int parentx;
    private int parenty;
    private String status;
    private String owner;
    private String description;

    /**
     * Constructor for a node
     * @param identifier - node identifier
     * @param x - x position of node
     * @param y - y position of node
     * @param parentx - x position of parent node
     * @param parenty - y posititon of parent node
     * @param status - status of node
     * @param owner - which player owns the node
     * @param description - contents of argument in node
     */
    public Node(int identifier, int x, int y, int parentx, int parenty, String status, String owner, String description) {
        this.identifier = identifier;
        this.x = x;
        this.y = y;
        this.parentx = parentx;
        this.parenty = parenty;
        this.status = status;
        this.owner = owner;
        this.description = description;
    }

    // Gets the parent node's x position
    public int getParentx() {
        return parentx;
    }

    // Sets the parent node's x position
    public void setParentx(int parentx) {
        this.parentx = parentx;
    }

    // Gets the parent node's y position
    public int getParenty() {
        return parenty;
    }

    // Sets the parent node's y position
    public void setParenty(int parenty) {
        this.parenty = parenty;
    }

    // Gets the node's x position
    public int getX() {
        return x;
    }

    // Sets the node's x position
    public void setX(int x) {
        this.x = x;
    }

    // Gets the node's y position
    public int getY() {
        return y;
    }

    // Sets the node's y position
    public void setY(int y) {
        this.y = y;
    }

    // Gets the node's identifier
    public int getIdentifier() {
        return identifier;
    }

    // Sets the node's identifier
    public void setIdentifier(int identifier) {
        this.identifier = identifier;
    }

    // Gets the node's status
    public String getStatus() {
        return status;
    }

    // Sets the node's status
    public void setStatus(String status) {
        this.status = status;
    }

    // Gets the node's owner player
    public String getOwner() {
        return owner;
    }

    // Sets the node's owner player
    public void setOwner(String owner) {
        this.owner = owner;
    }

    // Gets the node's argument contents
    public String getDescription() {
        return description;
    }

    // Sets the node's argument contents
    public void setDescription(String description) {
        this.description = description;
    }
}
