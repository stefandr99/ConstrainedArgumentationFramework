package algo;

import models.ArgumentationFramework;
import org.chocosolver.solver.Model;
import org.chocosolver.solver.expression.discrete.relational.ReExpression;
import org.chocosolver.solver.variables.BoolVar;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Algorithm {
    private final ArgumentationFramework af;

    private Model model;

    private BoolVar[] argumentsSolver;

    public Algorithm(ArgumentationFramework af) {
        this.af = af;
    }

    public List<List<String>> conflictFree() {
        this.initModel("Conflict Free");

        for(var firstArg = 0; firstArg < af.getSize(); firstArg++) {
            var attackersOfIndexes = getAttackersOfIndexes(firstArg);

            for(var secondArg : attackersOfIndexes) {
                argumentsSolver[firstArg].not()
                        .or(argumentsSolver[secondArg].not())
                        .post();
            }
        }

        return getSolution();
    }

    public List<List<String>> stable() {
        this.initModel("Stable");

        for(var firstArg = 0; firstArg < af.getSize(); firstArg++) {
            ReExpression firstArgAttackers = null;
            var attackersOfIndexes = getAttackersOfIndexes(firstArg);

            for(var secondArg : attackersOfIndexes) {
                if(firstArgAttackers == null) {
                    firstArgAttackers = argumentsSolver[secondArg].not();
                }
                else {
                    firstArgAttackers = firstArgAttackers.and(argumentsSolver[secondArg].not());
                }
            }

            argumentsSolver[firstArg]
                    .iff(firstArgAttackers != null ? firstArgAttackers : model.boolVar(true))
                    .post();
        }

        return getSolution();
    }

    public List<List<String>> admissible() {
        this.initModel("Admissible");

        for(var firstArg = 0; firstArg < af.getSize(); firstArg++) {
            var isDefended = true;
            var attackersOfFirstIndexes = getAttackersOfIndexes(firstArg);

            for(var secondArg : attackersOfFirstIndexes) {
                isDefended = false;
                ReExpression attackedBySecondExpression = null;
                var attackersOFSecondIndexes = getAttackersOfIndexes(secondArg);

                (argumentsSolver[firstArg].not()).or(argumentsSolver[secondArg].not()).post();

                for(var thirdArg : attackersOFSecondIndexes) {
                    if(attackedBySecondExpression == null) {
                        attackedBySecondExpression = argumentsSolver[thirdArg];
                    }
                    else {
                        attackedBySecondExpression = attackedBySecondExpression.or(argumentsSolver[thirdArg]);
                    }
                }

                if(attackedBySecondExpression != null) {
                    isDefended = true;
                    argumentsSolver[firstArg].imp(attackedBySecondExpression).post();
                }
            }

            if (!isDefended) {
                argumentsSolver[firstArg].eq(model.boolVar(false)).post();
            }
        }

        return getSolution();
    }

    public Set<String> characteristicFunction(List<String> arguments) {
        var defendedOnes = new HashSet<String>();

        for(var argument : arguments) {
            var attackedByArg = af.getAttacking().get(argument);

            for(var parent : attackedByArg) {
                defendedOnes.addAll(af.getAttacking().get(parent));
            }

            if(af.getAttacked().get(argument).isEmpty()) {
                defendedOnes.add(argument);
            }
        }

        return defendedOnes;
    }

    public List<List<String>> complete() {
        var admissibleSets = admissible();
        var completeSets = new ArrayList<List<String>>();

        for(var admissibleSet : admissibleSets) {
            var chFunctionResult = characteristicFunction(admissibleSet);
            var subtractOne = new ArrayList<>(admissibleSet);
            subtractOne.removeAll(chFunctionResult);
            var subtractTwo = new ArrayList<>(chFunctionResult);
            subtractTwo.removeAll(admissibleSet);

            if(!admissibleSet.isEmpty() && subtractOne.isEmpty() && subtractTwo.isEmpty()) {
                completeSets.add(admissibleSet);
            }
        }

        return completeSets;
    }

    private List<List<String>> getSolution() {
        var allSolutions = model.getSolver().findAllSolutions();
        var result = new ArrayList<List<String>>();

        for (var solution : allSolutions) {
            var solutionList = new ArrayList<String>();

            for (var i = 0; i < af.getSize(); i++) {
                if(solution.getIntVal(argumentsSolver[i]) == 1) {
                    solutionList.add(argumentsSolver[i].getName());
                }
            }

            result.add(solutionList);
        }

        return result;
    }

    private void initModel(String propertyName) {
        model = new Model(propertyName);
        argumentsSolver = new BoolVar[af.getSize()];

        for (var i = 0; i < af.getSize(); i++) {
            argumentsSolver[i] = model.boolVar(af.getArguments().get(i));
        }
    }

    private List<Integer> getAttackersOfIndexes(int argumentIndex) {
        var currentArgument = af.getArguments().get(argumentIndex);
        var attackedByCurrent = af.getAttacked().get(currentArgument);

        var result = new ArrayList<Integer>();

        for(var attacked : attackedByCurrent) {
            result.add(af.getArguments().indexOf(attacked));
        }

        return result;
    }
}
