package com.af.argumentationframeworkapi.models;

public class Attack {
    private String attacker;

    private String attacked;

    public Attack() {}

    public Attack(String attacker, String attacked) {
        this.attacker = attacker;
        this.attacked = attacked;
    }

    public String getAttacker() {
        return attacker;
    }

    public void setAttacker(String attacker) {
        this.attacker = attacker;
    }

    public String getAttacked() {
        return attacked;
    }

    public void setAttacked(String attacked) {
        this.attacked = attacked;
    }
}
