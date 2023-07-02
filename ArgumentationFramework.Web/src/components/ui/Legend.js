import { Card } from "react-bootstrap";
import {useEffect, useState} from "react";

const Legend = (props) => {
    let [ulLegend, setUlLegend] = useState([]);
    let [legendTitle, setLegendTitle] = useState("");

    useEffect(() => {
        let list = [];
        props.plainArgumentsList.map((arg) => (
            list.push(<li><b>{props.argumentLetterAssociation[arg]}:</b> {arg}</li>)
        ));

        setUlLegend(list);
        setLegendTitle(props.legendTitle);
    }, [props.argumentLetterAssociation, props.plainArgumentsList, props.legendTitle]);

    useEffect(() => {
        if (props.clear) {
            setUlLegend([]);
            setLegendTitle("");
        }
    }, [props.clear]);

    return (
        <div>
            <Card className="text-center">
                <Card.Body className={"legend"}>
                    <p style={{ fontSize: 20 }}><b>{legendTitle}</b></p>
                    <b>Legend:</b>
                    <ul className={"legend-list"}>{ulLegend}</ul>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Legend;
