import React, { useRef, useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import './ASTTree.css';

const transformAST = (node) => {
  if (!node || typeof node !== 'object') return {};
  
  return {
    name: node.type,
    attributes: node.value ? { value: node.value } : {},
    children: Array.isArray(node.children) 
      ? node.children.map(transformAST) 
      : [],
  };
};

const ASTTree = ({ ast }) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const containerRef = useRef();

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  const data = transformAST(ast);

  const renderCustomNode = ({ nodeDatum, toggleNode }) => (
    <g>
      <circle 
        r={15} 
        fill={nodeDatum.children ? "#4895ef" : "#4361ee"}
        stroke="#3a0ca3"
        strokeWidth={2}
        onClick={toggleNode}
      />
      <text 
        x={25} 
        dy=".35em" 
        fill="#2b2d42" 
        fontSize={12} 
        fontWeight="bold"
      >
        {nodeDatum.name}
      </text>
      {nodeDatum.attributes?.value && (
        <text 
          x={25} 
          dy="1.5em" 
          fill="#4a4e69" 
          fontSize={10}
        >
          {nodeDatum.attributes.value}
        </text>
      )}
    </g>
  );

  return (
    <div ref={containerRef} className="ast-tree-container">
      <Tree
        data={data}
        orientation="vertical"
        translate={{ x: dimensions.width / 2, y: 50 }}
        pathFunc="step"
        separation={{ siblings: 1, nonSiblings: 1 }}
        renderCustomNodeElement={renderCustomNode}
        styles={{
          links: {
            stroke: "#7209b7",
            strokeWidth: 2,
          }
        }}
      />
    </div>
  );
};

export default ASTTree;