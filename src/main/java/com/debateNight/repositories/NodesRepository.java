package com.debateNight.repositories;
import com.debateNight.models.Node;
import com.debateNight.repositories.badArray;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;


/**
 * Controls access to a Node database in SQL. Can get, create, or update a Node.
 */
public class NodesRepository {
    private Connection connection;

    /**
     * Create table of node objects in the SQL database.
     */
    public NodesRepository(Connection connection) throws SQLException {
        this.connection = connection;
        var statement = connection.createStatement();
        statement.execute("CREATE TABLE IF NOT EXISTS nodes (identifier INTEGER PRIMARY KEY AUTOINCREMENT, x INTEGER," +
                " y INTEGER, parentx INTEGER, parenty INTEGER, status TEXT, owner TEXT, description TEXT)");
        statement.close();
    }

    /**
     * Gets all of the nodes currently in the database
     */
    public List<Node> getAll() throws SQLException {
        var nodes = new ArrayList<Node>();
        var statement = connection.createStatement();
        var result = statement.executeQuery("SELECT identifier, x, y, parentx, parenty, status, owner, description FROM nodes");
        while (result.next()) {
            nodes.add(
                    new Node(
                            result.getInt("identifier"),
                            result.getInt("x"),
                            result.getInt("y"),
                            result.getInt("parentx"),
                            result.getInt("parenty"),
                            result.getString("status"),
                            result.getString("owner"),
                            result.getString("description")
                    )
            );
        }
        result.close();
        statement.close();
        return nodes;
    }

    /**
     * Get one node in the database given their identifier.
     */
    public Node getOne(int identifier) throws SQLException, NodeNotFoundException {
        var statement = connection.prepareStatement("SELECT identifier, x, y, parentx, parenty, status, owner, description FROM nodes WHERE identifier = ?");
        statement.setInt(1, identifier);
        var result = statement.executeQuery();
        try {
            if (result.next()) {
                return new Node(
                        result.getInt("identifier"),
                        result.getInt("x"),
                        result.getInt("y"),
                        result.getInt("parentx"),
                        result.getInt("parenty"),
                        result.getString("status"),
                        result.getString("owner"),
                        result.getString("description")
                );
            } else {
                throw new NodeNotFoundException();
            }
        }
        finally {
            statement.close();
            result.close();
        }
    }

    /**
     * Create a new node from a node object given by the controller.
     */
    public void create(int x, int y, int parentx, int parenty, String description, String status) throws SQLException {
        var statement = connection.prepareStatement("INSERT INTO nodes (x, y, parentx, parenty, status, owner, description) VALUES (?, ?, ?, ?, ?, ?, ?)");
        statement.setInt(1, x);
        statement.setInt(2, y);
        statement.setInt(3, parentx);
        statement.setInt(4, parenty);
        statement.setString(5, status);
        statement.setString(6, "temp");
        description=swearFilter(description); //METHOD TAKES IN THE DESCRIPTION AND FILTERS FOR SWEAR WORDS
        statement.setString(7, description);
        statement.execute();
        statement.close();
    }

    /**
     * Updates a node status given its identifier
     */
    public void updateStatus(Node node) throws SQLException, NodeNotFoundException {
        var statement = connection.prepareStatement("UPDATE nodes SET status = ? WHERE identifier = ?");
        statement.setString(1, node.getStatus());
        statement.setInt(2, node.getIdentifier());
        try {
            if (statement.executeUpdate() == 0) throw new NodeNotFoundException();
        } finally {
            statement.close();
        }
    }

    /**
     * Filters entered context for swears
     */
    public String swearFilter(String d) {
        String [] swearWords= badArray.badRa;
        String[] noSpace=d.split(" ");
        //var cleanedRa=new ArrayList<String>();
        var cleanedRa = new StringBuilder();
        for(String a:noSpace) {
            Boolean cleaned=false;
            for(String b:swearWords) {
                String a2=a.toLowerCase();
                if(a2.charAt(0)<b.charAt(0)) {
                    break;
                }
                if(a2.equals(b)) {
                    cleanedRa.append(randChar(a.length())).append(" ");
                    cleaned=true;
                    break;
                }
            }
            if(!cleaned) {
                cleanedRa.append(a).append(" ");
            }
        }
        return cleanedRa.toString();
    }

    /**
     * Replaces strings with censored charactors
     */
    public static String randChar(int l) {
        char [] replacement = {'&','#','%','!','@','?'};
        String out="";
        var r=new Random();
        for(int i = 0; i <l;i++) {
            out+= replacement[r.nextInt(replacement.length)];
        }
        return out;
    }

}

