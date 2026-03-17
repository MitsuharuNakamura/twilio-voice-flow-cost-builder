import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import { DEFAULT_NODE_DEFINITIONS, type NodeDefinition } from '../data/nodeDefinitions';
import type { Language } from '../i18n/translations';

export interface SavedFlow {
  name: string;
  nodes: Node[];
  edges: Edge[];
  customPrices: Record<string, number>;
  customDurations: Record<string, number>;
  savedAt: number;
}

const SAVED_FLOWS_KEY = 'twilio-cost-calc-flows';

function loadSavedFlows(): SavedFlow[] {
  try {
    const raw = localStorage.getItem(SAVED_FLOWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistSavedFlows(flows: SavedFlow[]) {
  localStorage.setItem(SAVED_FLOWS_KEY, JSON.stringify(flows));
}

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  nodeDefinitions: NodeDefinition[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  monthlyCallCount: number;
  avgCallMinutes: number;
  currency: 'JPY' | 'USD';
  exchangeRate: number;
  language: Language;
  customPrices: Record<string, number>;
  customDurations: Record<string, number>;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  updateEdge: (edgeId: string, updates: Partial<Edge>) => void;
  setMonthlyCallCount: (count: number) => void;
  setAvgCallMinutes: (minutes: number) => void;
  setCurrency: (currency: 'JPY' | 'USD') => void;
  setExchangeRate: (rate: number) => void;
  setLanguage: (lang: Language) => void;
  setCustomPrice: (instanceId: string, price: number) => void;
  removeCustomPrice: (instanceId: string) => void;
  setCustomDuration: (instanceId: string, minutes: number) => void;
  removeCustomDuration: (instanceId: string) => void;
  addNodeDefinition: (def: NodeDefinition) => void;
  updateNodeDefinition: (id: string, updates: Partial<Omit<NodeDefinition, 'id'>>) => void;
  deleteNodeDefinition: (id: string) => void;
  getNodeDefinition: (defId: string) => NodeDefinition | undefined;
  resetNodeDefinitions: () => void;
  getSavedFlows: () => SavedFlow[];
  saveCurrentFlow: (name: string) => void;
  loadSavedFlow: (index: number) => void;
  deleteSavedFlow: (index: number) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  clearAll: () => void;
}

// Keys to persist in localStorage
const PERSISTED_KEYS = [
  'nodeDefinitions',
  'monthlyCallCount',
  'avgCallMinutes',
  'currency',
  'exchangeRate',
  'language',
] as const;

type PersistedState = Pick<FlowState, (typeof PERSISTED_KEYS)[number]>;

export const useFlowStore = create<FlowState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      nodeDefinitions: [...DEFAULT_NODE_DEFINITIONS],
      selectedNodeId: null,
      selectedEdgeId: null,
      monthlyCallCount: 500,
      avgCallMinutes: 3,
      currency: 'JPY',
      exchangeRate: 150,
      language: 'ja' as Language,
      customPrices: {},
      customDurations: {},

      onNodesChange: (changes) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) });
      },
      onEdgesChange: (changes) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
      },
      onConnect: (connection) => {
        set({ edges: addEdge(connection, get().edges) });
      },
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      addNode: (node) => set({ nodes: [...get().nodes, node] }),
      setSelectedNodeId: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
      setSelectedEdgeId: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
      updateEdge: (edgeId, updates) =>
        set({
          edges: get().edges.map((e) =>
            e.id === edgeId ? { ...e, ...updates } : e,
          ),
        }),
      setMonthlyCallCount: (count) => set({ monthlyCallCount: count }),
      setAvgCallMinutes: (minutes) => set({ avgCallMinutes: minutes }),
      setCurrency: (currency) => set({ currency }),
      setExchangeRate: (rate) => set({ exchangeRate: rate }),
      setLanguage: (lang) => set({ language: lang }),
      setCustomPrice: (instanceId, price) =>
        set({ customPrices: { ...get().customPrices, [instanceId]: price } }),
      removeCustomPrice: (instanceId) => {
        const { [instanceId]: _, ...rest } = get().customPrices;
        set({ customPrices: rest });
      },
      setCustomDuration: (instanceId, minutes) =>
        set({ customDurations: { ...get().customDurations, [instanceId]: minutes } }),
      removeCustomDuration: (instanceId) => {
        const { [instanceId]: _, ...rest } = get().customDurations;
        set({ customDurations: rest });
      },
      addNodeDefinition: (def) =>
        set({ nodeDefinitions: [...get().nodeDefinitions, def] }),
      updateNodeDefinition: (id, updates) =>
        set({
          nodeDefinitions: get().nodeDefinitions.map((d) =>
            d.id === id ? { ...d, ...updates } : d,
          ),
        }),
      deleteNodeDefinition: (id) =>
        set({
          nodeDefinitions: get().nodeDefinitions.filter((d) => d.id !== id),
        }),
      getNodeDefinition: (defId) =>
        get().nodeDefinitions.find((d) => d.id === defId),
      resetNodeDefinitions: () =>
        set({ nodeDefinitions: [...DEFAULT_NODE_DEFINITIONS] }),
      getSavedFlows: () => loadSavedFlows(),
      saveCurrentFlow: (name) => {
        const { nodes, edges, customPrices, customDurations } = get();
        const flows = loadSavedFlows();
        flows.push({ name, nodes, edges, customPrices, customDurations, savedAt: Date.now() });
        persistSavedFlows(flows);
      },
      loadSavedFlow: (index) => {
        const flows = loadSavedFlows();
        const flow = flows[index];
        if (!flow) return;
        set({
          nodes: flow.nodes,
          edges: flow.edges,
          customPrices: flow.customPrices || {},
          customDurations: flow.customDurations || {},
          selectedNodeId: null,
        });
      },
      deleteSavedFlow: (index) => {
        const flows = loadSavedFlows();
        flows.splice(index, 1);
        persistSavedFlows(flows);
      },
      updateNodeData: (nodeId, data) =>
        set({
          nodes: get().nodes.map((n) =>
            n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n,
          ),
        }),
      clearAll: () =>
        set({ nodes: [], edges: [], selectedNodeId: null, customPrices: {}, customDurations: {} }),
    }),
    {
      name: 'twilio-cost-calc',
      partialize: (state): PersistedState => ({
        nodeDefinitions: state.nodeDefinitions,
        monthlyCallCount: state.monthlyCallCount,
        avgCallMinutes: state.avgCallMinutes,
        currency: state.currency,
        exchangeRate: state.exchangeRate,
        language: state.language,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<PersistedState> | undefined;
        const merged = { ...current, ...p };
        if (p?.nodeDefinitions) {
          const defaultMap = new Map(DEFAULT_NODE_DEFINITIONS.map((d) => [d.id, d]));
          const existingIds = new Set(p.nodeDefinitions.map((d) => d.id));
          const newDefaults = DEFAULT_NODE_DEFINITIONS.filter((d) => !existingIds.has(d.id));

          // Backfill missing fields (e.g. labelEn) from defaults
          const backfilled = p.nodeDefinitions.map((d) => {
            const def = defaultMap.get(d.id);
            if (def && !d.labelEn && def.labelEn) {
              return { ...d, labelEn: def.labelEn };
            }
            return d;
          });

          if (newDefaults.length > 0) {
            // Build ordered list: keep default order, insert persisted customizations
            const defaultIds = new Set(DEFAULT_NODE_DEFINITIONS.map((d) => d.id));
            const customNodes = backfilled.filter((d) => !defaultIds.has(d.id));
            const result: NodeDefinition[] = [];
            for (const def of DEFAULT_NODE_DEFINITIONS) {
              const persisted = backfilled.find((d) => d.id === def.id);
              result.push(persisted ?? def);
            }
            result.push(...customNodes);
            merged.nodeDefinitions = result;
          } else {
            merged.nodeDefinitions = backfilled;
          }
        }
        return merged;
      },
    },
  ),
);
