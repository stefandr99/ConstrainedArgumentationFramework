import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Canvas from "./Canvas";
import Options from "./Options";
import { useRef, useState } from "react";

const Content = () => {
    const nodesRef = useRef([]);
    const arcsRef = useRef([]);
    const [afProps, setAfProps] = useState({});
    const characteristicResult = useRef([]);
    const [highlightedNodes, setHighlightedNodes] = useState([]);
    const [clearCanvas, setClearCanvas] = useState(false);

    const fetchProps = async () => {
        let attacks = [];
        arcsRef.current.forEach((attack) => {
            attacks.push({ attacker: attack.attacker.letter, attacked: attack.attacked.letter });
        });
        let payload = { arguments: nodesRef.current.map((x) => x.letter), attacks: attacks };
        let url = "https://argumentation-framework-0.uc.r.appspot.com/";

        try {
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            let props = await response.json();

            console.log(props);
            setAfProps(props);
        }
        catch(ex) {
            console.log(ex);
        }
    };

    const fetchCharacteristic = async (functionArguments) => {
        if(nodesRef.current.length > 0) {
            let attacks = [];
            let argumentsLetters = nodesRef.current.map((x) => x.letter);

            if(functionArguments.every(value => {return argumentsLetters.includes(value);})) {
                arcsRef.current.forEach((attack) => {
                    attacks.push({ attacker: attack.attacker.letter, attacked: attack.attacked.letter });
                });
                let payload = { arguments: argumentsLetters, attacks: attacks,
                    functionArguments: functionArguments };
                let url = "https://argumentation-framework-0.uc.r.appspot.com/characteristic";

                try {
                    let response = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    });
                    let props = await response.json();

                    console.log(props);
                    characteristicResult.current = props;
                }
                catch(ex) {
                    console.log(ex);
                }
            }
            else {
                characteristicResult.current = ["ERR"];
            }
        }
    }

    return (
        <Card className="text-center">
            <Card.Body>
                <Container className={"align-items-center justify-content-center"}>
                    <Row>
                        <Col sm={4}>
                            <Options af={afProps} characteristic = {characteristicResult} fetchCharacteristic = {fetchCharacteristic}
                                     setHighlights = {setHighlightedNodes} highlightedNodes = {highlightedNodes}
                                     clear = {clearCanvas}/>
                        </Col>
                        <Col sm={8}>
                            <Canvas attaking={{ nodes: nodesRef, arcs: arcsRef }}
                                    highlightedNodes = {highlightedNodes} setHighlightedNodes = {setHighlightedNodes}
                                    clear = {clearCanvas} setClear = {setClearCanvas} />
                        </Col>
                    </Row>
                </Container>
                <div className={"mt-4"}>
                    <Button className={"mx-1"} variant="primary" onClick={fetchProps}>
                        Calculate
                    </Button>
                    <Button className={"mx-1"} variant="danger" onClick={() => {
                        setClearCanvas(true);
                        nodesRef.current = [];
                        arcsRef.current = [];
                        setAfProps({});
                        characteristicResult.current = [];
                    }}>
                        Clear
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Content;
