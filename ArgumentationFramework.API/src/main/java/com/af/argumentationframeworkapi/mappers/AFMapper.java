package com.af.argumentationframeworkapi.mappers;

import com.af.argumentationframeworkapi.models.ArgumentationFramework;
import com.af.argumentationframeworkapi.models.ArgumentationFrameworkRequestModel;
import com.af.argumentationframeworkapi.models.Attack;

import java.util.List;

public class AFMapper {
    public static ArgumentationFramework map(List<String> arguments,List<Attack> attacks) {
        var result = new ArgumentationFramework();

        result.setSize(arguments.size());
        result.setArguments(arguments);

        for(var attack : attacks) {
            result.addAttack(attack.getAttacker(), attack.getAttacked());
        }

        return result;
    }
}
