package benchmark;

import algo.Algorithm;
import algo.Generator;
import models.ArgumentationFramework;
import org.openjdk.jmh.annotations.*;

@State(Scope.Benchmark)
public class ArgumentationFrameworkBenchmarking {
    public ArgumentationFramework af;
    public Algorithm algorithm;

    @Setup
    public void Setup() {
        this.af = Generator.Generate();
        this.algorithm = new Algorithm(af);
    }

    @Benchmark
    @Fork(value = 1)
    @Warmup(iterations = 2)
    @Measurement(iterations = 2)
    @BenchmarkMode(Mode.AverageTime)
    public void admissible() {
        algorithm.admissible();
    }

    @Benchmark
    @Fork(value = 1)
    @Warmup(iterations = 2)
    @Measurement(iterations = 2)
    @BenchmarkMode(Mode.AverageTime)
    public void complete() {
        algorithm.complete();
    }

    @Benchmark
    @Fork(value = 1)
    @Warmup(iterations = 2)
    @Measurement(iterations = 2)
    @BenchmarkMode(Mode.AverageTime)
    public void stable() {
        algorithm.stable();
    }

    @Benchmark
    @Fork(value = 1)
    @Warmup(iterations = 2)
    @Measurement(iterations = 2)
    @BenchmarkMode(Mode.AverageTime)
    public void preferred() {
        algorithm.preferred();
    }

    @Benchmark
    @Fork(value = 1)
    @Warmup(iterations = 2)
    @Measurement(iterations = 2)
    @BenchmarkMode(Mode.AverageTime)
    public void grounded() {
        algorithm.grounded();
    }
}
