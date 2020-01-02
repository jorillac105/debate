package com.debateNight.models;

/**
 * The Game class stores the information for a debate. It keeps track of the 2 players, one Pro and one Con,
 * and also allows the game status to be adjusted.
 */
public class Game {
    private int identifier;
    private String status;
    private String proPlayer;
    private String conPlayer;

    /**
     * Constructor for a game
     * @param identifier - id for game
     * @param status - game status
     * @param proPlayer - pro player in game
     * @param conPlayer - con player in game
     */
    public Game(int identifier, String status, String proPlayer, String conPlayer) {
        this.identifier = identifier;
        this.status = status;
        this.proPlayer = proPlayer;
        this.conPlayer = conPlayer;
    }

    // Gets the current Game status
    public String getStatus() {
        return status;
    }

    // Sets the Game status
    public void setStatus(String status) {
        this.status = status;
    }

    // Gets the current pro player name
    public String getProPlayer() {
        return proPlayer;
    }

    // Sets the Game's pro player
    public void setProPlayer(String proPlayer) {
        this.proPlayer = proPlayer;
    }

    // Gets the current con player name
    public String getConPlayer() {
        return conPlayer;
    }

    // Sets the Game's con player
    public void setConPlayer(String conPlayer) {
        this.conPlayer = conPlayer;
    }

    // Gets the Game's identifier
    public int getIdentifier() {
        return identifier;
    }

    // Sets the Game's identifier
    public void setIdentifier(int identifier) {
        this.identifier = identifier;
    }
}
