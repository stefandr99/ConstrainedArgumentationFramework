import {Accordion, Button, Form} from "react-bootstrap";
import {useEffect, useState} from "react";

const Options = (props) => {
    const [pressedButton, setPressedButton] = useState("");
    const [formValue, setFormValue] = useState("");
    const [characteristicElements, setCharacteristicElements] = useState("");
    const [, setValidated] = useState(false);

    const setProps = (solution, propName) => {
        let extensionsList = [];

        if (solution) {
            if(solution.length === 0 && propName === "grounded") {
                const key = `grounded`;
                extensionsList.push(
                    <Button
                        key={key}
                        className={"m-1"}
                        variant={pressedButton === key ? "success" : "outline-success"}
                        size="sm"
                    >
                        {"{ }"}
                    </Button>
                );
            }
            else if (solution.length === 0) {
                extensionsList.push(<p>There is no {propName} extension in this Argumentation Framework</p>);
            }

            solution.forEach((property) => {
                let str = `${property.join(", ")}`;
                const key = `${propName}-${str}`;

                extensionsList.push(
                    <Button
                        key={key}
                        className={"m-1"}
                        variant={pressedButton === key ? "success" : "outline-success"}
                        size="sm"
                        onClick={() => {
                            if (props.highlightedNodes === property) {
                                props.setHighlights([]);
                                setPressedButton("");
                            } else {
                                props.setHighlights(property);
                                setPressedButton(key);
                            }
                        }}
                    >
                        {str.length === 0 ? "{ }" : str}
                    </Button>
                );
            });
        }

        return extensionsList;
    };

    const calculateCharacteristic = async () => {
        let trimmedArgumentList = formValue.trim();
        let argumentsList = trimmedArgumentList.split(",");

        await props.fetchCharacteristic(argumentsList);

        if (Array.isArray(props.characteristic.current) && props.characteristic.current.includes("ERR")) {
            setValidated(true);
            setCharacteristicElements("");
        } else if (props.characteristic.current.arguments) {
            const elements = props.characteristic.current.arguments.join(", ");

            setCharacteristicElements(`F(${trimmedArgumentList}) = {${elements}}`);
        }
    };

    useEffect(() => {
        if (props.clear) {
            setFormValue("");
            setCharacteristicElements("");
            setValidated(false);
        }
    }, [props.clear]);

    const conflictFrees = setProps(props.af.conflictFree, "conflict-free");
    const stables = setProps(props.af.stable, "stable");
    const admissibles = setProps(props.af.admissible, "admissible");
    const completes = setProps(props.af.complete, "complete");
    const preferreds = setProps(props.af.preferred, "preferred");
    const grounded = setProps(props.af.grounded, "grounded");

    return (
        <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: "100%" }}
        >

            <div className="accordion-wrapper">
                <Accordion flush>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Conflict Free</Accordion.Header>
                    <Accordion.Body>{conflictFrees}</Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Stable</Accordion.Header>
                    <Accordion.Body>{stables}</Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Admissible</Accordion.Header>
                    <Accordion.Body>{admissibles}</Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header>Complete</Accordion.Header>
                    <Accordion.Body>{completes}</Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                    <Accordion.Header>Preferred</Accordion.Header>
                    <Accordion.Body>{preferreds}</Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="5">
                    <Accordion.Header>Grounded</Accordion.Header>
                    <Accordion.Body>{grounded}</Accordion.Body>
                </Accordion.Item>
                </Accordion>
            </div>
            <br />
            <Form>
                <Form.Group className="mb-3" controlId="formCharacteristicFunc">
                    <Form.Label>Characteristic function</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter arguments"
                        value={formValue}
                        onChange={(event) => setFormValue(event?.target.value)}
                        isInvalid = {Array.isArray(props.characteristic.current) && props.characteristic.current.includes("ERR")}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter valid arguments.
                    </Form.Control.Feedback>
                    <Form.Text key={"functionArguments"} className="text-muted">
                        Write arguments separated by comma
                    </Form.Text>
                </Form.Group>
                <Button variant="success" onClick={calculateCharacteristic}>
                    F(x)
                </Button>
            </Form>
            {characteristicElements && <p>{characteristicElements}</p>}
        </div>
    );
};

export default Options;
