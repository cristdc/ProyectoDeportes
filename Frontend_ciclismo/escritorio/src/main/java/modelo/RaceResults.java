
package modelo;


import java.util.List;

public class RaceResults {
    private Race race;
    private List<Result> results;

    // Getters y Setters
    public Race getRace() {
        return race;
    }
    public void setRace(Race race) {
        this.race = race;
    }
    public List<Result> getResults() {
        return results;
    }
    public void setResults(List<Result> results) {
        this.results = results;
    }
}

