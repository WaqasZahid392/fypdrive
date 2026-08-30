'use client';

import { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, Cloud } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type TreeNode = {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parentId: string | null;
  children: TreeNode[];
  url?: string;
  fileType?: string;
};

function buildTree(folders: any[], files: any[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>();
  const rootNodes: TreeNode[] = [];

  folders.forEach(f => {
    nodeMap.set(f.id, {
      id: f.id,
      name: f.name,
      type: 'folder',
      parentId: f.parentId,
      children: []
    });
  });

  files.forEach(f => {
    nodeMap.set(f.id, {
      id: f.id,
      name: f.name,
      type: 'file',
      parentId: f.folderId,
      children: [],
      url: f.url,
      fileType: f.type
    });
  });

  nodeMap.forEach(node => {
    if (node.parentId === null) {
      rootNodes.push(node);
    } else {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        rootNodes.push(node);
      }
    }
  });

  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach(n => sortNodes(n.children));
  };
  
  sortNodes(rootNodes);
  return rootNodes;
}

const TreeNodeItem = ({ 
  node, 
  level, 
  expandedIds, 
  toggleExpand,
  currentPath 
}: { 
  node: TreeNode; 
  level: number; 
  expandedIds: Set<string>; 
  toggleExpand: (id: string) => void;
  currentPath: string;
}) => {
  const isExpanded = expandedIds.has(node.id);
  const isFolder = node.type === 'folder';
  const isActive = isFolder ? currentPath === `/dashboard/folder/${node.id}` : false;

  return (
    <div>
      <div 
        className={`flex items-center space-x-1 py-1.5 px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 rounded-md cursor-pointer transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {isFolder ? (
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleExpand(node.id); }}
            className="p-0.5 rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <span className="w-4 h-4 shrink-0" />
        )}

        {isFolder ? (
          <Link href={`/dashboard/folder/${node.id}`} className="flex items-center space-x-2 flex-1 min-w-0" onClick={() => !isExpanded && toggleExpand(node.id)}>
            <Folder className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-500' : 'text-neutral-400 dark:text-neutral-500'}`} />
            <span className="text-sm truncate select-none">{node.name}</span>
          </Link>
        ) : (
          <a href={node.url} target="_blank" rel="noreferrer" className="flex items-center space-x-2 flex-1 min-w-0">
            <FileText className="w-4 h-4 shrink-0 text-purple-500/70" />
            <span className="text-sm truncate select-none">{node.name}</span>
          </a>
        )}
      </div>

      {isFolder && isExpanded && node.children.length > 0 && (
        <div>
          {node.children.map(child => (
            <TreeNodeItem 
              key={child.id} 
              node={child} 
              level={level + 1} 
              expandedIds={expandedIds} 
              toggleExpand={toggleExpand}
              currentPath={currentPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function TreeView({ folders, files }: { folders: any[]; files: any[] }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  
  // Memoize tree building to prevent unnecessary recalculations on re-renders
  const tree = useMemo(() => buildTree(folders, files), [folders, files]);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const isRootActive = pathname === '/dashboard';

  return (
    <div className="flex-1 overflow-y-auto px-2 py-2 thin-scrollbar">
      <Link href="/dashboard" className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg transition-colors mb-2 ${isRootActive ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
        <Cloud className="w-5 h-5 shrink-0" />
        <span className="text-sm">My Files</span>
      </Link>
      
      <div className="space-y-0.5">
        {tree.map(node => (
          <TreeNodeItem 
            key={node.id} 
            node={node} 
            level={0} 
            expandedIds={expandedIds} 
            toggleExpand={toggleExpand}
            currentPath={pathname}
          />
        ))}
        {tree.length === 0 && (
          <div className="text-xs text-neutral-400 dark:text-neutral-600 px-4 py-2 italic">Vault is empty</div>
        )}
      </div>
    </div>
  );
}
