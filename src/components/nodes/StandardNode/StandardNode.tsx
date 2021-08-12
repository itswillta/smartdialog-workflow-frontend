import { Component } from 'solid-js';
import { NodeComponentProps } from 'solid-flowy/lib/components/Nodes/wrapNode';

const StandardNode: Component<NodeComponentProps> = (props) => {
  return (
    <div style={{ border: '1px solid black', padding: '8px', background: 'white' }}>I'm a standard node</div>
  )
};

export default StandardNode;
