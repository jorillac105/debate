package com.debateNight.models;

/**
 * The Player class allows the storage of user data for the app. It primarily uses the status object to store data on
 * current games. It is a storage-only class, so it only has getters and setters.
 */
public class Player {
    private String username;
    private String password;
    private int score;
    private String status;

    /**
     * Constructor for a player
     * @param username - player's username
     * @param password - player's password
     * @param score - player's "debate score"
     * @param status - player's current status
     */
    public Player(String username, String password, int score, String status) {
        this.status = status;
        this.score = score;
        this.username = username;
        this.password = password;
    }

    // Gets player's status
    public String getStatus() {
        return status;
    }

    // Sets player's status
    public void setStatus(String status) {
        this.status = status;
    }

    // Gets player's "debate score"
    public int getScore() {
        return score;
    }

    // Sets player's "debate score"
    public void setScore(int score) {
        this.score = score;
    }

    // Gets player's username
    public String getUsername() {
        return username;
    }

    // Sets player's username
    public void setUsername(String username) { this.username = username; }

    // Gets player's password
    public String getPassword() {
        return password;
    }

    // Sets player's password
    public void setPassword(String password) {
        this.password = password;
    }
}
