package com.af.argumentationframeworkapi.models;

import java.util.List;

public class ArgumentationFrameworkRequestModel {
    private List<String> arguments;

    private List<Attack> attacks;

    public ArgumentationFrameworkRequestModel(){}

    public ArgumentationFrameworkRequestModel(List<String> arguments, List<Attack> attacks) {
        this.arguments = arguments;
        this.attacks = attacks;
    }

    public List<String> getArguments() {
        return arguments;
    }

    public void setArguments(List<String> functionArguments) {
        this.arguments = functionArguments;
    }

    public List<Attack> getAttacks() {
        return attacks;
    }

    public void setAttacks(List<Attack> attacks) {
        this.attacks = attacks;
    }
}

