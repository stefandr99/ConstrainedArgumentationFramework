import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Canvas from "./Canvas";
import Options from "./Options";
import { useRef, useState } from "react";
import Legend from "./Legend";

const Content = () => {
    const nodesRef = useRef([]);
    const arcsRef = useRef([]);
    const [afProps, setAfProps] = useState({});
    const characteristicResult = useRef([]);
    const [highlightedNodes, setHighlightedNodes] = useState([]);
    const [clearCanvas, setClearCanvas] = useState(false);
    const [uploadLetter, setUploadLetter] = useState('A');
    const [uploadAF, setUploadAF] = useState(false);
    const [argumentLetterAssociation, setArgumentLetterAssociation] = useState({});
    const [plainArgumentsList, setPlainArgumentsList] = useState([]);

    const fetchProps = async () => {
        let attacks = [];
        arcsRef.current.forEach((attack) => {
            attacks.push({ attacker: attack.attacker.letter, attacked: attack.attacked.letter });
        });
        let payload = { arguments: nodesRef.current.map((x) => x.letter), attacks: attacks };
        // let url = "https://argumentation-framework-0.uc.r.appspot.com/";
        let url = "http://localhost:8080/";

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

            setUploadAF(true);

            arcsRef.current = setArgumentsAttacks(parsedJson.attacks, nodesRef.current);
        };

        reader.readAsText(file);

        setTimeout(async () => { await fetchProps(); }, 500);
    };

    let argLetterAssoc = {};
    let plainArgList = [];
    const calculateArgumentsCoordinates = (args) => {
        const nodeSize = 20;
        const padding = 20;

        const maxDimension = Math.min(750, 550);
        const availableRadius = (maxDimension / 2) - padding;
        const minNodeSpacing = 2 * nodeSize;
        const maxNodesPerCircle = Math.floor(2 * Math.PI * availableRadius / minNodeSpacing);
        const circles = Math.ceil(args.length / maxNodesPerCircle);
        const radius = availableRadius / circles;

        const centerX = 800 / 2;
        const centerY = 600 / 2;
        const angleIncrement = (2 * Math.PI) / args.length;

        const nodeCoordinates = [];
        let legendLetter = "A";
        for (let i = 0; i < args.length; i++) {
            const angle = (i + args.length / 2) * angleIncrement;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            nodeCoordinates.push({ 'x': x, 'y': y, 'letter': legendLetter });
            argLetterAssoc[args[i]] = legendLetter;
            plainArgList.push(args[i]);
            legendLetter = String.fromCharCode(legendLetter.charCodeAt(0) + 1);
        }
        legendLetter = String.fromCharCode(legendLetter.charCodeAt(0) - 1);
        setUploadLetter(legendLetter);

        setArgumentLetterAssociation(argLetterAssoc);
        setPlainArgumentsList(plainArgList);

        return nodeCoordinates;
    }

    const setArgumentsAttacks = (attacks, args) => {
        const uploadedAttacks = [];

        attacks.forEach(attack => {
            const attackerNode = args.find(a => a.letter === argLetterAssoc[attack.attacker]);
            const attackedNode = args.find(a => a.letter === argLetterAssoc[attack.attacked]);

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
        <div className="text-center">
            <Container className="text-center">
                <Row>
                    <Col sm={10}>
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
                                    <Button className={"mx-1"} variant="success" onClick={fetchProps}>
                                        Calculate
                                    </Button>
                                    <Button className={"mx-1 btn-clear"} variant="danger" onClick={clear}>
                                        Clear
                                    </Button>
                                    <div className="file-input">
                                        <input type="file" name="file" onChange={handleFileChange} />
                                        <label className="file-input-label">Choose File</label>
                                    </div>
                                    {/*<input type="file" name="file" style={{width: '200px'}} onChange={handleFileChange} />*/}
                                    <Button className={"mx-1"} variant="secondary" onClick={handleUploadClick}>
                                        Load
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col sm={2}>
                        <Legend plainArgumentsList={plainArgumentsList} argumentLetterAssociation={argumentLetterAssociation}
                                uploadAF={uploadAF} clear={clearCanvas}></Legend>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Content;
