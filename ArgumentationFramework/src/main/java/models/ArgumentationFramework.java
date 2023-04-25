package models;

import org.jgrapht.alg.util.Pair;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ArgumentationFramework {
    private int size;

    private List<String> arguments;

    private List<Pair<String, String>> attacks;

    private Map<String, List<String>> attacking;

    private Map<String, List<String>> attacked;

    public ArgumentationFramework() {
        size = 0;
        arguments = new ArrayList<>();
        attacks = new ArrayList<>();
        attacking = new HashMap<>();
        attacked = new HashMap<>();
    }

    public ArgumentationFramework(List<String> arguments, List<Pair<String, String>> attacks) {
        this.arguments = arguments;
        this.size = arguments.size();
        this.attacks = attacks;
        this.setAttackHelpers(attacks);
    }

    private void setAttackHelpers(List<Pair<String, String>> attacks) {
        for (String argument : arguments) {
            attacking.put(argument, new ArrayList<>());
            attacked.put(argument, new ArrayList<>());
        }
        for(var attack : attacks) {
            addToHelpers(attack.getFirst(), attack.getSecond());
        }
    }

    public boolean addArgument(String argument) {
        size++;
        attacking.put(argument, new ArrayList<>());
        attacked.put(argument, new ArrayList<>());
        return arguments.add(argument);
    }

    public void addAttack(String attacker, String attacked) {
        attacks.add(new Pair<>(attacker, attacked));
        addToHelpers(attacker, attacked);
    }


    private void addToHelpers(String attacker, String attackedArg) {
        attacking.get(attacker).add(attackedArg);
        attacked.get(attackedArg).add(attacker);
    }

    public boolean removeArgument(String argument) {
        return arguments.remove(argument);
    }

    public boolean removeArgumentAt(int index) {
        return arguments.remove(index) != null;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public List<String> getArguments() {
        return arguments;
    }

    public void setArguments(List<String> arguments) {
        this.size = arguments.size();
        this.arguments = arguments;

        for (String argument : arguments) {
            attacking.put(argument, new ArrayList<>());
            attacked.put(argument, new ArrayList<>());
        }
    }

    public List<Pair<String, String>> getAttacks() {
        return attacks;
    }

    public void setAttacks(List<Pair<String, String>> attacks) {
        this.attacks = attacks;
    }

    public Map<String, List<String>> getAttacking() {
        return attacking;
    }

    public void setAttacking(Map<String, List<String>> attacking) {
        this.attacking = attacking;
    }

    public Map<String, List<String>> getAttacked() {
        return attacked;
    }

    public void setAttacked(Map<String, List<String>> attacked) {
        this.attacked = attacked;
    }
}
