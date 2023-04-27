import algo.Algorithm;
import models.ArgumentationFramework;

import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        ArgumentationFramework argumentationFramework = new ArgumentationFramework();

//        argumentationFramework.setArguments(new ArrayList<>(List.of("A", "B", "C", "D")));
//        argumentationFramework.addAttack("A", "B");
//        argumentationFramework.addAttack("B", "C");
//        argumentationFramework.addAttack("C", "D");
//        argumentationFramework.addAttack("D", "A");

//        argumentationFramework.setArguments(new ArrayList<>(List.of("A", "B", "C", "D")));
//        argumentationFramework.addAttack("B", "A");
//        argumentationFramework.addAttack("C", "B");
//        argumentationFramework.addAttack("D", "B");

        argumentationFramework.setArguments(new ArrayList<>(List.of("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M")));
        argumentationFramework.addAttack("A", "B");
        argumentationFramework.addAttack("B", "D");
        argumentationFramework.addAttack("D", "C");
        argumentationFramework.addAttack("C", "A");
        argumentationFramework.addAttack("D", "E");
        argumentationFramework.addAttack("E", "F");
        argumentationFramework.addAttack("G", "F");
        argumentationFramework.addAttack("J", "G");
        argumentationFramework.addAttack("D", "L");
        argumentationFramework.addAttack("L", "J");
        argumentationFramework.addAttack("H", "G");
        argumentationFramework.addAttack("I", "G");
        argumentationFramework.addAttack("H", "I");
        argumentationFramework.addAttack("I", "H");
        argumentationFramework.addAttack("K", "H");
        argumentationFramework.addAttack("K", "I");
        argumentationFramework.addAttack("M", "K");
        argumentationFramework.addAttack("K", "M");

        Algorithm algorithm = new Algorithm(argumentationFramework);

        System.out.println("Conflict free: " + algorithm.conflictFree());
        System.out.println("Stable: " + algorithm.stable());
        System.out.println("Admissible: " + algorithm.admissible());
        System.out.println("Complete: " + algorithm.complete());
        System.out.println("Preferred: " + algorithm.preferred());
    }
}