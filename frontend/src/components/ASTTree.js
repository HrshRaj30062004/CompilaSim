// src/components/ASTTree.js
import React, { useRef, useEffect, useState } from 'react';
import Tree from 'react-d3-tree';

const transformAST = (node) => {
  if (!node || typeof node !== 'object') return {};
  const label = `${node.type}${node.value !== null ? `: ${node.value}` : ''}`;
  return {
    name: label,
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

  return (
    <div ref={containerRef} style={{ width: '100%', height: '600px' }}>
      <Tree data={data} orientation="vertical" translate={{ x: dimensions.width / 2, y: 50 }} />
    </div>
  );
};

export default ASTTree;
