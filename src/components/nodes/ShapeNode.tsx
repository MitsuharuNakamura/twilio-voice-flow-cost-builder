import { memo, type CSSProperties } from 'react';
import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react';

export type ShapeType = 'rect' | 'circle' | 'text';

export interface ShapeNodeData {
  nodeType: 'shape';
  shape: ShapeType;
  label: string;
  bgColor: string;
  borderColor: string;
  borderWidth: number;
  textColor: string;
  fontSize: number;
  width?: number;
  height?: number;
}

export const SHAPE_DEFAULTS: Record<ShapeType, Partial<ShapeNodeData>> = {
  rect: {
    label: '',
    bgColor: '#f0f9ff',
    borderColor: '#93c5fd',
    borderWidth: 2,
    textColor: '#1e40af',
    fontSize: 13,
  },
  circle: {
    label: '',
    bgColor: '#fef3c7',
    borderColor: '#fbbf24',
    borderWidth: 2,
    textColor: '#92400e',
    fontSize: 13,
  },
  text: {
    label: 'テキスト',
    bgColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    textColor: '#374151',
    fontSize: 14,
  },
};

function ShapeNodeComponent({ data, selected }: NodeProps) {
  const d = data as unknown as ShapeNodeData;
  const isCircle = d.shape === 'circle';
  const isText = d.shape === 'text';

  const style: CSSProperties = {
    backgroundColor: d.bgColor || 'transparent',
    borderColor: d.borderColor || 'transparent',
    borderWidth: d.borderWidth ?? 2,
    borderStyle: d.borderWidth > 0 ? 'solid' : 'none',
    color: d.textColor || '#374151',
    fontSize: d.fontSize || 13,
    borderRadius: isCircle ? '50%' : isText ? 0 : 8,
    minWidth: isCircle ? 80 : isText ? 40 : 100,
    minHeight: isCircle ? 80 : isText ? 24 : 40,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isText ? '2px 4px' : '8px 12px',
    textAlign: 'center' as const,
    wordBreak: 'break-word' as const,
    overflow: 'hidden',
  };

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={40}
        minHeight={24}
        lineStyle={{ borderColor: '#3b82f6' }}
        handleStyle={{ backgroundColor: '#3b82f6', width: 8, height: 8 }}
      />
      <div style={style}>
        {d.label && <span style={{ whiteSpace: 'pre-wrap' }}>{d.label}</span>}
      </div>
      <Handle type="target" position={Position.Left} id="left" className="!w-2 !h-2 !bg-gray-300 !border-0 !opacity-0 hover:!opacity-100 !-translate-x-1/2" />
      <Handle type="source" position={Position.Right} id="right" className="!w-2 !h-2 !bg-gray-300 !border-0 !opacity-0 hover:!opacity-100 !translate-x-1/2" />
      <Handle type="target" position={Position.Top} id="top" className="!w-2 !h-2 !bg-gray-300 !border-0 !opacity-0 hover:!opacity-100 !-translate-y-1/2" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!w-2 !h-2 !bg-gray-300 !border-0 !opacity-0 hover:!opacity-100 !translate-y-1/2" />
    </>
  );
}

export const ShapeNode = memo(ShapeNodeComponent);
