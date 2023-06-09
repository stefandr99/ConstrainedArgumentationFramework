import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css';

const Canvas = (props) => {
    const canvasRef = useRef(null);
    const [startNode, setStartNode] = useState(null);
    const [endNode, setEndNode] = useState(null);
    const [argLetter, setArgLetter] = useState('A');

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            const containerWidth = canvas.parentNode.offsetWidth;

            const newWidth = containerWidth < 800 ? containerWidth : 800;
            const newHeight = containerWidth < 800 ? (containerWidth / 800) * 600 : 600;

            canvas.width = newWidth;
            canvas.height = newHeight;

            drawNodes();
        };

        const handleNodeClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (e.button === 0) {
                const clickedNode = props.attaking.nodes.current.find((node) => {
                    const dx = node.x - x;
                    const dy = node.y - y;
                    return dx * dx + dy * dy <= 1000;
                });

                if (clickedNode) {
                    if (!startNode) {
                        setStartNode(clickedNode);
                    } else if (!endNode && startNode !== clickedNode) {
                        setEndNode(clickedNode);

                        const newArc = { attacker: startNode, attacked: clickedNode };
                        props.attaking.arcs.current = [
                            ...props.attaking.arcs.current,
                            newArc,
                        ];
                        setStartNode(null);
                        setEndNode(null);
                    } else if (endNode) {
                        setStartNode(null);
                        setEndNode(null);
                    }
                } else {
                    props.attaking.nodes.current = [
                        ...props.attaking.nodes.current,
                        { x, y, letter: argLetter },
                    ];
                    setArgLetter((prevArgLetter) =>
                        String.fromCharCode(prevArgLetter.charCodeAt(0) + 1)
                    );
                }
            }
        };

        const handleContextMenu = (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const clickedNode = props.attaking.nodes.current.find((node) => {
                const dx = node.x - x;
                const dy = node.y - y;
                return dx * dx + dy * dy <= 1000;
            });

            if (clickedNode) {
                const filteredNodes = props.attaking.nodes.current.filter(
                    (node) => node !== clickedNode
                );
                props.attaking.nodes.current = filteredNodes;

                const filteredArcs = props.attaking.arcs.current.filter(
                    (arc) =>
                        arc.attacker !== clickedNode && arc.attacked !== clickedNode
                );
                props.attaking.arcs.current = filteredArcs;
            }

            if(props.attaking.nodes.current.length === 0) {
                setArgLetter('A');
            }

            drawNodes();
        };

        const drawNodes = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 2;
            for (const arc of props.attaking.arcs.current) {
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'black';
                drawAttack(arc.attacker, arc.attacked);
            }

            for (const node of props.attaking.nodes.current) {
                ctx.beginPath();
                if (props.highlightedNodes.includes(node.letter)) {
                    ctx.fillStyle = '#4CBB17';
                    ctx.strokeStyle = '#4CBB17';
                } else {
                    ctx.fillStyle = 'black';
                    ctx.strokeStyle = 'black';
                }
                ctx.font = '20px Verdana';
                ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
                ctx.fillText(node.letter, node.x - 7, node.y + 7);
                ctx.lineWidth = 5;
                ctx.stroke();
            }

            if (startNode) {
                ctx.beginPath();
                ctx.fillStyle = 'green';
                ctx.strokeStyle = 'green';
                ctx.font = '20px Verdana';
                ctx.arc(startNode.x, startNode.y, 25, 0, 2 * Math.PI);
                ctx.fillText(startNode.letter, startNode.x - 7, startNode.y + 7);
                ctx.lineWidth = 5;
                ctx.stroke();
            }
        };

        const drawAttack = (from, to) => {
            ctx.beginPath();
            let headLen = 10;
            let dx = to.x - from.x;
            let dy = to.y - from.y;
            let angle = Math.atan2(dy, dx);
            let startX = from.x + Math.cos(angle) * 25;
            let startY = from.y + Math.sin(angle) * 25;
            let endX = to.x - Math.cos(angle) * 25;
            let endY = to.y - Math.sin(angle) * 25;
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.lineTo(
                endX - headLen * Math.cos(angle - Math.PI / 6),
                endY - headLen * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(endX, endY);
            ctx.lineTo(
                endX - headLen * Math.cos(angle + Math.PI / 6),
                endY - headLen * Math.sin(angle + Math.PI / 6)
            );
            ctx.stroke();
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        canvas.addEventListener('mousedown', handleNodeClick);
        canvas.addEventListener('contextmenu', handleContextMenu);

        if (props.clear) {
            setArgLetter('A');
            props.setHighlightedNodes([]);
            props.setClear(false);
        }

        if (props.uploadAF) {
            setArgLetter(String.fromCharCode(props.uploadLetter.charCodeAt(0) + 1));
            props.setUploadAF(false);
        }

        drawNodes();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousedown', handleNodeClick);
            canvas.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [
        props.attaking,
        props.attaking.nodes,
        props.highlightedNodes,
        props.clear,
        props.uploadAF,
        startNode,
        endNode,
        argLetter,
        props,
    ]);

    return (
        <div>
            <div className="canvas-container">
                <canvas ref={canvasRef} width={800} height={600} />
            </div>
        </div>
    );
};

export default Canvas;
