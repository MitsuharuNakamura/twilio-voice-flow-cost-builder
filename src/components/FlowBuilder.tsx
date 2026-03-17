import { useCallback, useRef, useState, type DragEvent } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useReactFlow,
  MarkerType,
  type NodeTypes,
  type Node,
  type Edge,
  type DefaultEdgeOptions,
} from '@xyflow/react';
import { useFlowStore } from '../store/flowStore';
import type { NodeDefinition } from '../data/nodeDefinitions';
import { TwilioNode } from './nodes/TwilioNode';
import { ShapeNode, SHAPE_DEFAULTS, type ShapeType } from './nodes/ShapeNode';
import { useI18n } from '../i18n';

const nodeTypes: NodeTypes = {
  twilioNode: TwilioNode,
  shapeNode: ShapeNode,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
};

let nodeIdCounter = 0;

function createFlowNode(
  def: NodeDefinition,
  position: { x: number; y: number },
): Node {
  const id = `${def.id}_${++nodeIdCounter}`;
  return {
    id,
    type: 'twilioNode',
    position,
    data: {
      defId: def.id,
      label: def.label,
      category: def.category,
      billing: def.billing,
      unitPrice: def.unitPrice,
      hasCustomPrice: false,
      hasCustomDuration: false,
    },
  };
}

// Built-in template definitions
interface TemplateConfig {
  labelKey: string;
  nodes: string[];
  edges: number[][];
  layout?: { rows?: Record<number, number>; cols?: Record<number, number> };
}

const TEMPLATES: Record<string, TemplateConfig> = {
  basicForward: {
    labelKey: 'tplBasicForward',
    nodes: ['caller', 'nttcom', 'tw050', 'studio', 'twout_fx', 'twout_mb'],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 4], [3, 5],
    ],
    layout: { rows: { 4: -1, 5: 1 }, cols: { 4: 4, 5: 4 } },
  },
  aiInbound: {
    labelKey: 'tplAiInbound',
    nodes: ['caller', 'nttcom', 'tw050', 'mstream', 'crelay', 'extapi'],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    ],
  },
  outboundCall: {
    labelKey: 'tplOutboundCall',
    nodes: ['studio', 'twout_fx', 'callee'],
    edges: [
      [0, 1], [1, 2],
    ],
  },
  aiInboundToOutbound: {
    labelKey: 'tplAiInboundToOutbound',
    nodes: ['caller', 'nttcom', 'tw050', 'crelay', 'extapi', 'twout_mb', 'callee'],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 6],
    ],
    layout: { rows: { 4: -1, 5: 1, 6: 1 } },
  },
};

export function FlowBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const customPrices = useFlowStore((s) => s.customPrices);
  const customDurations = useFlowStore((s) => s.customDurations);
  const getNodeDef = useFlowStore((s) => s.getNodeDefinition);
  const onNodesChange = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange);
  const onConnect = useFlowStore((s) => s.onConnect);
  const addNode = useFlowStore((s) => s.addNode);
  const setNodes = useFlowStore((s) => s.setNodes);
  const setEdges = useFlowStore((s) => s.setEdges);
  const setSelectedNodeId = useFlowStore((s) => s.setSelectedNodeId);
  const setSelectedEdgeId = useFlowStore((s) => s.setSelectedEdgeId);
  const clearAll = useFlowStore((s) => s.clearAll);
  const getSavedFlows = useFlowStore((s) => s.getSavedFlows);
  const saveCurrentFlow = useFlowStore((s) => s.saveCurrentFlow);
  const loadSavedFlow = useFlowStore((s) => s.loadSavedFlow);
  const deleteSavedFlow = useFlowStore((s) => s.deleteSavedFlow);
  const language = useFlowStore((s) => s.language);
  const setLanguage = useFlowStore((s) => s.setLanguage);

  const { t } = useI18n();

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [savedFlowsVersion, setSavedFlowsVersion] = useState(0);

  const savedFlows = getSavedFlows();
  // Force re-read after save/delete
  void savedFlowsVersion;

  // Update node data when customPrices/customDurations change
  const nodesWithUpdatedData = nodes.map((node) => {
    if (node.data?.nodeType === 'shape') return node;
    const defId = node.data?.defId as string;
    const def = getNodeDef(defId);
    if (!def) return node;
    const hasCustomPrice = customPrices[node.id] !== undefined;
    const hasCustomDuration = customDurations[node.id] !== undefined;
    return {
      ...node,
      data: {
        ...node.data,
        label: (node.data?.customLabel as string) || def.label,
        category: def.category,
        billing: def.billing,
        unitPrice: customPrices[node.id] ?? def.unitPrice,
        hasCustomPrice,
        hasCustomDuration,
        customDurationMinutes: customDurations[node.id],
        customLabel: node.data?.customLabel,
      },
    };
  });

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const { screenToFlowPosition } = useReactFlow();

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const defId = event.dataTransfer.getData('application/twilionode');
      if (!defId) return;

      const def = getNodeDef(defId);
      if (!def) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(createFlowNode(def, position));
    },
    [addNode, getNodeDef, screenToFlowPosition],
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId],
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      setSelectedEdgeId(edge.id);
    },
    [setSelectedEdgeId],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setShowLoadMenu(false);
  }, [setSelectedNodeId]);

  const loadTemplate = (templateKey: string) => {
    const template = TEMPLATES[templateKey];
    if (!template) return;
    const newNodes: Node[] = [];

    template.nodes.forEach((defId, i) => {
      const def = getNodeDef(defId);
      if (!def) return;
      const id = `${defId}_${++nodeIdCounter}`;
      const row = template.layout?.rows?.[i] ?? 0;
      const col = template.layout?.cols?.[i] ?? i;
      newNodes.push({
        id,
        type: 'twilioNode',
        position: { x: 50 + col * 220, y: 150 + row * 120 },
        data: {
          defId: def.id,
          label: def.label,
          category: def.category,
          billing: def.billing,
          unitPrice: def.unitPrice,
          hasCustomPrice: false,
          hasCustomDuration: false,
        },
      });
    });

    const newEdges = template.edges.map(([from, to], i) => ({
      id: `e_${nodeIdCounter}_${i}`,
      source: newNodes[from].id,
      target: newNodes[to].id,
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const addShapeNode = (shape: ShapeType) => {
    const defaults = SHAPE_DEFAULTS[shape];
    const id = `shape_${++nodeIdCounter}`;
    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    const center = screenToFlowPosition({
      x: (bounds?.left ?? 0) + (bounds?.width ?? 800) / 2,
      y: (bounds?.top ?? 0) + (bounds?.height ?? 600) / 2,
    });
    const node: Node = {
      id,
      type: 'shapeNode',
      position: center,
      style: { width: shape === 'text' ? 120 : shape === 'circle' ? 100 : 160, height: shape === 'text' ? 30 : shape === 'circle' ? 100 : 80 },
      data: {
        nodeType: 'shape',
        shape,
        ...defaults,
      } as unknown as Record<string, unknown>,
    };
    addNode(node);
  };

  const deleteSelected = () => {
    const selectedNodes = nodes.filter((n) => n.selected);
    const selectedEdges = edges.filter((e) => e.selected);
    if (selectedNodes.length > 0) {
      const ids = new Set(selectedNodes.map((n) => n.id));
      setNodes(nodes.filter((n) => !ids.has(n.id)));
      setEdges(edges.filter((e) => !ids.has(e.source) && !ids.has(e.target)));
    }
    if (selectedEdges.length > 0) {
      const ids = new Set(selectedEdges.map((e) => e.id));
      setEdges(edges.filter((e) => !ids.has(e.id)));
    }
  };

  const handleSave = () => {
    if (!saveName.trim()) return;
    saveCurrentFlow(saveName.trim());
    setSaveName('');
    setShowSaveDialog(false);
    setSavedFlowsVersion((v) => v + 1);
  };

  const handleLoad = (index: number) => {
    loadSavedFlow(index);
    setShowLoadMenu(false);
  };

  const handleDeleteSaved = (index: number, name: string) => {
    if (confirm(t('confirmDelete', name))) {
      deleteSavedFlow(index);
      setSavedFlowsVersion((v) => v + 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col" ref={reactFlowWrapper}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-gray-200 shrink-0 flex-wrap">
        <span className="text-sm font-bold text-gray-700 mr-1">{t('toolbar')}</span>
        <button
          onClick={deleteSelected}
          className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded border border-red-200 hover:bg-red-100"
        >
          {t('deleteSelected')}
        </button>
        <button
          onClick={clearAll}
          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded border border-gray-200 hover:bg-gray-200"
        >
          {t('clear')}
        </button>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Save / Load */}
        <div className="relative">
          <button
            onClick={() => { setShowSaveDialog(true); setShowLoadMenu(false); }}
            disabled={nodes.length === 0}
            className="px-2 py-1 text-xs bg-emerald-50 text-emerald-600 rounded border border-emerald-200 hover:bg-emerald-100 disabled:opacity-40"
          >
            {t('save')}
          </button>
        </div>
        <div className="relative">
          <button
            onClick={() => { setShowLoadMenu(!showLoadMenu); setShowSaveDialog(false); }}
            className="px-2 py-1 text-xs bg-amber-50 text-amber-600 rounded border border-amber-200 hover:bg-amber-100"
          >
            {t('load')} ({savedFlows.length})
          </button>
          {showLoadMenu && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {savedFlows.length === 0 ? (
                <div className="px-3 py-4 text-xs text-gray-400 text-center">
                  {t('noSavedFlows')}
                </div>
              ) : (
                savedFlows.map((flow, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                  >
                    <button
                      onClick={() => handleLoad(i)}
                      className="flex-1 text-left min-w-0"
                    >
                      <div className="text-xs font-medium text-gray-700 truncate">
                        {flow.name}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {new Date(flow.savedAt).toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US')}
                        {' / '}
                        {flow.nodes.length} {t('nodes')}
                      </div>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteSaved(i, flow.name); }}
                      className="ml-2 text-[10px] text-gray-300 hover:text-red-500 shrink-0"
                    >
                      &times;
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-200 mx-1" />
        <span className="text-xs text-gray-400">{t('shapes')}</span>
        <button
          onClick={() => addShapeNode('rect')}
          className="px-2 py-1 text-xs bg-sky-50 text-sky-600 rounded border border-sky-200 hover:bg-sky-100"
        >
          {t('shapeRect')}
        </button>
        <button
          onClick={() => addShapeNode('circle')}
          className="px-2 py-1 text-xs bg-yellow-50 text-yellow-600 rounded border border-yellow-200 hover:bg-yellow-100"
        >
          {t('shapeCircle')}
        </button>
        <button
          onClick={() => addShapeNode('text')}
          className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded border border-gray-200 hover:bg-gray-100"
        >
          {t('shapeText')}
        </button>

        <div className="w-px h-5 bg-gray-200 mx-1" />
        <span className="text-xs text-gray-400">{t('templates')}</span>
        {Object.entries(TEMPLATES).map(([key, tmpl]) => (
          <button
            key={key}
            onClick={() => loadTemplate(key)}
            className="px-2 py-1 text-xs bg-indigo-50 text-indigo-600 rounded border border-indigo-200 hover:bg-indigo-100"
          >
            {t(tmpl.labelKey as 'tplBasicForward')}
          </button>
        ))}

        <div className="w-px h-5 bg-gray-200 mx-1" />
        {/* Language toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLanguage('ja')}
            className={`px-1.5 py-0.5 text-[10px] rounded ${
              language === 'ja' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            JA
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-1.5 py-0.5 text-[10px] rounded ${
              language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Save dialog */}
      {showSaveDialog && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-72">
          <div className="text-xs font-bold text-gray-700 mb-2">{t('saveFlow')}</div>
          <input
            autoFocus
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setShowSaveDialog(false); }}
            placeholder={t('enterFlowName')}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!saveName.trim()}
              className="flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-40"
            >
              {t('save')}
            </button>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodesWithUpdatedData}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          deleteKeyCode={['Delete', 'Backspace']}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
