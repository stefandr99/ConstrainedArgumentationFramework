package com.af.argumentationframeworkapi.models;

import java.util.List;

public class CharacteristicFunctionResponseModel {
    private List<String> arguments;

    public CharacteristicFunctionResponseModel(List<String> arguments) {
        this.arguments = arguments;
    }

    public List<String> getArguments() {
        return arguments;
    }

    public void setArguments(List<String> arguments) {
        this.arguments = arguments;
    }
}
