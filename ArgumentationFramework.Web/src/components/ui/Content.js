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
    const [uploadLetter, setUploadLetter] = useState('A');
    const [uploadAF, setUploadAF] = useState(false);

    const fetchProps = async () => {
        let attacks = [];
        arcsRef.current.forEach((attack) => {
            attacks.push({ attacker: attack.attacker.letter, attacked: attack.attacked.letter });
        });
        let payload = { arguments: nodesRef.current.map((x) => x.letter), attacks: attacks };
        // let url = "https://argumentation-framework-0.uc.r.appspot.com/";
        let url = "http://localhost:8080/";

        console.log("payload: ", payload);
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
                // let url = "https://argumentation-framework-0.uc.r.appspot.com/characteristic";
                let url = "http://localhost:8080/characteristic";

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
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
        }
    };

    const handleUploadClick = async () => {
        if (!file) {
            return;
        }

        clear();

        const reader = new FileReader();

        reader.onload = (event) => {
            const fileContent = event.target.result;
            const parsedJson = JSON.parse(fileContent);
            nodesRef.current = calculateArgumentsCoordinates(parsedJson.arguments);
            arcsRef.current = setArgumentsAttacks(parsedJson.attacks, nodesRef.current);
            setUploadAF(true);
        };

        reader.readAsText(file);

        setTimeout(async () => { await fetchProps(); }, 500);
    };

    const calculateArgumentsCoordinates = (args) => {
        const nodeSize = 20; // Adjust this value to control the size of nodes
        const padding = 20; // Adjust this value to add padding around the graph

        const maxDimension = Math.min(750, 550);
        const availableRadius = (maxDimension / 2) - padding;
        const minNodeSpacing = 2 * nodeSize; // Minimum spacing between nodes
        const maxNodesPerCircle = Math.floor(2 * Math.PI * availableRadius / minNodeSpacing);
        const circles = Math.ceil(args.length / maxNodesPerCircle);
        const radius = availableRadius / circles;

        const centerX = 800 / 2;
        const centerY = 600 / 2;
        const angleIncrement = (2 * Math.PI) / args.length;

        const nodeCoordinates = [];

        for (let i = 0; i < args.length; i++) {
            const angle = i * angleIncrement;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            nodeCoordinates.push({ 'x': x, 'y': y, 'letter': args[i] });
        }

        setUploadLetter(args[args.length - 1]);

        console.log(nodeCoordinates);
        return nodeCoordinates;
    }

    const setArgumentsAttacks = (attacks, args) => {
        const uploadedAttacks = [];

        attacks.forEach(attack => {
            const attackerNode = args.find(a => a.letter === attack.attacker);
            const attackedNode = args.find(a => a.letter === attack.attacked);

            uploadedAttacks.push({
                'attacker': attackerNode,
                'attacked': attackedNode
            });
        });

        return uploadedAttacks;
    }

    const clear = () => {
        setClearCanvas(true);
        nodesRef.current = [];
        arcsRef.current = [];
        setAfProps({});
        characteristicResult.current = [];
    }

    return (
        <Card className="text-center">
            <Card.Body>
                <Container className={"align-items-center justify-content-center"}>
                    <Row>
                        <Col sm={4}>
                            <Options af={afProps} characteristic = {characteristicResult} fetchCharacteristic = {fetchCharacteristic}
                                     setHighlights = {setHighlightedNodes} highlightedNodes = {highlightedNodes}
                                     clear = {clearCanvas} />
                        </Col>
                        <Col sm={8}>
                            <Canvas attaking={{ nodes: nodesRef, arcs: arcsRef }}
                                    highlightedNodes = {highlightedNodes} setHighlightedNodes = {setHighlightedNodes}
                                    clear = {clearCanvas} setClear = {setClearCanvas} uploadAF = {uploadAF} setUploadAF = {setUploadAF}
                                    uploadLetter = {uploadLetter} />
                        </Col>
                    </Row>
                </Container>
                <div className={"mt-4"}>
                    <Button className={"mx-1"} variant="primary" onClick={fetchProps}>
                        Calculate
                    </Button>
                    <Button className={"mx-1"} variant="danger" onClick={clear}>
                        Clear
                    </Button>
                    <input type="file" name="file" style={{width: '200px'}} onChange={handleFileChange} />
                    <Button className={"mx-1"} variant="secondary" onClick={handleUploadClick}>
                        Load
                    </Button>

                </div>
            </Card.Body>
        </Card>
    );
};

export default Content;
