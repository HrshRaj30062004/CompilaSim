import React from "react";
import { Treebeard } from "react-treebeard";

const AstTreeView = ({ ast }) => {
  const convertAstToTree = (node) => {
    if (!node || typeof node !== "object") return null;

    const children = Array.isArray(node.children)
      ? node.children.map(convertAstToTree).filter((child) => child !== null)
      : [];

    const label =
      node.value !== null && node.value !== undefined && node.value !== ""
        ? `${node.type}: ${node.value}`
        : node.type || "Unknown";

    return {
      name: label,
      toggled: true,
      children: children.length > 0 ? children : undefined,
    };
  };

  const converted = convertAstToTree(ast) || { name: "Empty AST", children: [] };

  return (
    <div>
      <h2>AST Tree View</h2>
      <Treebeard data={converted} /> {/* ✅ Correct prop is 'data' */}
    </div>
  );
};

export default AstTreeView;
