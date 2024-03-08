const CustomNodeLabel = ({ nodeData }) => {
    return (
      <g>
        <text style={{ fill: "blue" }} x={-10} dy={20}>
          {nodeData.name}
        </text>
        {nodeData.attributes && Object.keys(nodeData.attributes).map((key, index) => (
          <text key={index} style={{ fill: "red" }} x={-10} dy={35 + index * 15}>
            {key}: {nodeData.attributes[key]}
          </text>
        ))}
      </g>
    );
  };