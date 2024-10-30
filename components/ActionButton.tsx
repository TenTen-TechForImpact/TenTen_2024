import React from "react";
import styles from "./ActionButton.module.css";

interface ActionButtonProps {
  text: string;
  onClick: () => void;
  width?: number;
  height?: number;
  fontSize?: number;
  backgroundColor?: string;
  color?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  onClick,
  width = 150,
  height = 57,
  fontSize = 24,
  backgroundColor = "#0511F2",
  color = "#FFFFFF",
}) => (
  <button
    className={styles.actionButton}
    onClick={onClick}
    style={{
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor,
      color,
      fontSize: `${fontSize}px`,
    }}
  >
    {text}
  </button>
);

export default ActionButton;
