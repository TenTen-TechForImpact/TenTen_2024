import React from "react";
import styles from "./ActionButton.module.css";

interface ActionButtonProps {
  text: string;
  onClick: () => void;
  width?: number;
  height?: number;
  fontSize?: number;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  onClick,
  width = 150,
  height = 57,
  fontSize = 24,
}) => (
  <button
    className={styles.actionButton}
    onClick={onClick}
    style={{
      width: `${width}px`,
      height: `${height}px`,
      fontSize: `${fontSize}px`,
    }}
  >
    {text}
  </button>
);

export default ActionButton;
