package algo;

import models.ArgumentationFramework;
import models.Attack;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Random;

public class Generator {
    public static ArgumentationFramework Generate() {
        var af = new ArgumentationFramework();

        JSONParser jsonParser = new JSONParser();

        try (FileReader reader = new FileReader("C:\\Users\\sdragoi\\Downloads\\ab.json"))
        {
            var obj = (JSONObject) jsonParser.parse(reader);

            var arguments = (JSONArray) obj.get("arguments");

            for(var arg : arguments) {
                var argString = (String) arg;
                af.addArgument(argString);
            }

            var attacks = (JSONArray) obj.get("attacks");

            for(var attack : attacks) {
                var attackObj = (JSONObject) attack;
                var attacker = (String) attackObj.get("attacker");
                var attacked = (String) attackObj.get("attacked");

                af.addAttack(attacker, attacked);

                if(!af.getAttacking().containsKey(attacker)) {
                    af.getAttacking().put(attacker, new ArrayList<>());
                }

                af.getAttacking().get(attacker).add(attacked);

                if(!af.getAttacked().containsKey(attacked)) {
                    af.getAttacked().put(attacked, new ArrayList<>());
                }

                af.getAttacked().get(attacked).add(attacker);
            }

        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }
//        Random rand = new Random();
//
//        for(var i = 0; i < arguments; i++) {
//            var name = "A" + i;
//            af.addArgument(name);
//        }
//
//        for(var i = 0; i < attacks; i++) {
//            var attacker = "A" + rand.nextInt(arguments);
//            var attacked = "A" + rand.nextInt(arguments);
//
//            while(!attacked.equals(attacker)) {
//                attacked = "A" + rand.nextInt(arguments);
//            }
//
//            af.addAttack(attacker, attacked);
//
//            if(!af.getAttacking().containsKey(attacker)) {
//                af.getAttacking().put(attacker, new ArrayList<>());
//            }
//
//            af.getAttacking().get(attacker).add(attacked);
//
//            if(!af.getAttacked().containsKey(attacked)) {
//                af.getAttacked().put(attacked, new ArrayList<>());
//            }
//
//            af.getAttacked().get(attacked).add(attacker);
//        }

        return af;
    }
}
