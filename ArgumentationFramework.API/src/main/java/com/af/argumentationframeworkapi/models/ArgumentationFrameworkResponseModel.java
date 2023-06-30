package com.af.argumentationframeworkapi.models;

import java.util.List;

public class ArgumentationFrameworkResponseModel {
    private List<List<String>> conflictFree;

    private List<List<String>> stable;

    private List<List<String>> admissible;

    private List<List<String>> complete;

    private List<List<String>> preferred;

    private List<List<String>> grounded;

    public ArgumentationFrameworkResponseModel(List<List<String>> conflictFree, List<List<String>> stable,
                                               List<List<String>> admissible, List<List<String>> complete,
                                               List<List<String>> preferred, List<List<String>> grounded) {
        this.conflictFree = conflictFree;
        this.stable = stable;
        this.admissible = admissible;
        this.complete = complete;
        this.preferred = preferred;
        this.grounded = grounded;
    }

    public List<List<String>> getConflictFree() {
        return conflictFree;
    }

    public void setConflictFree(List<List<String>> conflictFree) {
        this.conflictFree = conflictFree;
    }

    public List<List<String>> getStable() {
        return stable;
    }

    public void setStable(List<List<String>> stable) {
        this.stable = stable;
    }

    public List<List<String>> getAdmissible() {
        return admissible;
    }

    public void setAdmissible(List<List<String>> admissible) {
        this.admissible = admissible;
    }

    public List<List<String>> getComplete() {
        return complete;
    }

    public void setComplete(List<List<String>> complete) {
        this.complete = complete;
    }

    public List<List<String>> getPreferred() {
        return preferred;
    }

    public void setPreferred(List<List<String>> preferred) {
        this.preferred = preferred;
    }

    public List<List<String>> getGrounded() {
        return grounded;
    }

    public void setGrounded(List<List<String>> grounded) {
        this.grounded = grounded;
    }
}
