import { Card } from "react-bootstrap";
import {useEffect, useState} from "react";

const Legend = (props) => {
    let [ulLegend, setUlLegend] = useState([]);

    useEffect(() => {
        let list = [];
        props.plainArgumentsList.map((arg) => (
            list.push(<li><b>{props.argumentLetterAssociation[arg]}:</b> {arg}</li>)
        ));

        setUlLegend(list);
    }, [props.argumentLetterAssociation, props.plainArgumentsList]);

    useEffect(() => {
        if (props.clear) {
            setUlLegend([]);
        }
    }, [props.clear]);

    return (
        <div>
            <Card className="text-center">
                <Card.Body className={"legend"}>
                    <b>Legend:</b>
                    <ul className={"legend-list"}>{ulLegend}</ul>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Legend;
