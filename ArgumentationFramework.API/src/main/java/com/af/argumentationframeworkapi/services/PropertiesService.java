package com.af.argumentationframeworkapi.services;

import com.af.argumentationframeworkapi.algo.Algorithm;
import com.af.argumentationframeworkapi.mappers.AFMapper;
import com.af.argumentationframeworkapi.models.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PropertiesService implements IPropertiesService {
    @Override
    public ArgumentationFrameworkResponseModel solve(ArgumentationFrameworkRequestModel requestModel) {
        var algo = getAlgorithm(requestModel.getArguments(), requestModel.getAttacks());

        var conflictFreeSets = algo.conflictFree();
        var stableSets = algo.stable();
        var admissibleSets = algo.admissible();
        var completeSets = algo.complete();
        var preferredSets = algo.preferred();
        var groundedSets = algo.grounded();

        return new ArgumentationFrameworkResponseModel(conflictFreeSets, stableSets, admissibleSets,
                completeSets, preferredSets, groundedSets);
    }

    @Override
    public CharacteristicFunctionResponseModel characteristicFunction(CharacteristicFunctionRequestModel characteristicFunctionModel) {
        var algo = getAlgorithm(characteristicFunctionModel.getArguments(), characteristicFunctionModel.getAttacks());

        return new CharacteristicFunctionResponseModel(algo.characteristicFunction(characteristicFunctionModel.getFunctionArguments())
                .stream().toList());
    }

    private Algorithm getAlgorithm(List<String> arguments, List<Attack> attacks) {
        var af = AFMapper.map(arguments, attacks);

        return new Algorithm(af);
    }
}
