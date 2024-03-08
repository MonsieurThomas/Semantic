import React, { useState, useRef } from 'react';
import Tree from 'react-d3-tree';
import  "./style.css"


const myTreeData = [
  {
    name: 'Top Level',
    children: [
    {
        name: 'Level 2: A',
        children: [
            { name: 'Level 3: A' },
            { name: 'Level 3: B' },
            { name: 'Level 3: CCC', attributes: 
            [
                "exemple de bravoure"
            ]  
            },
            { name: 'Level 3: D' },
        ],
    },
    {
        name: 'Level 2: C',
    },
    { 
        name: 'Level 2: B',
        children: [
            { name: 'Level 3: E' },
            { name: 'Level 3: F' },
            { name: 'Level 3: G' },
            { name: 'Level 3: H' },
        ],
    },
    ],
  },
];


const OrgChartTree = () => {

  const [translate, setTranslate] = useState({ x: 50, y: 200 });

  

  return (
    <div className='w-full h-screen'>
        <Tree
            draggable={true}
            zoomable={true}
            data={myTreeData}
            translate={translate}
            orientation="horizontal"
            nodeSize={{ x: 150, y: 150 }}
            separation=
            {{
                siblings: 0.5, 
                nonSiblings: 1,
            }}
            rootNodeClassName="node__root"
            branchNodeClassName="node__branch"
            leafNodeClassName="node__leaf"  
        />
    </div>
  );
};

export default OrgChartTree;
