import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { NodePalette } from './components/NodePalette';
import { FlowBuilder } from './components/FlowBuilder';
import { CostPanel } from './components/CostPanel';
import { BulkPriceEditor } from './components/BulkPriceEditor';

function App() {
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <NodePalette onOpenBulkEdit={() => setShowBulkEdit(true)} />
        <FlowBuilder />
        <CostPanel />
      </div>
      {showBulkEdit && <BulkPriceEditor onClose={() => setShowBulkEdit(false)} />}
    </ReactFlowProvider>
  );
}

export default App;
