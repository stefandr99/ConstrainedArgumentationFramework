package com.af.argumentationframeworkapi.models;

import java.util.List;

public class CharacteristicFunctionRequestModel extends ArgumentationFrameworkRequestModel {
    private List<String> functionArguments;

    public CharacteristicFunctionRequestModel() {
    }

    public CharacteristicFunctionRequestModel(List<String> functionArguments) {
        this.functionArguments = functionArguments;
    }

    public List<String> getFunctionArguments() {
        return functionArguments;
    }

    public void setFunctionArguments(List<String> functionArguments) {
        this.functionArguments = functionArguments;
    }
}
