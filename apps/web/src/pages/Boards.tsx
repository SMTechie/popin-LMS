import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, List, Table2, Search } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import BoardColumn from '../components/BoardColumn';
import FilterBar from '../components/FilterBar';
import { mockColumns, mockBoards } from '../data/mockData';
import { notifyAction } from '../lib/notify';

type ViewMode = 'kanban' | 'list' | 'table';

export default function Boards() {
  const [view, setView] = useState<ViewMode>('kanban');
  const [selectedBoard, setSelectedBoard] = useState(mockBoards[0]);

  const viewIcons = {
    kanban: <LayoutGrid className="w-4 h-4" />,
    list: <List className="w-4 h-4" />,
    table: <Table2 className="w-4 h-4" />,
  };

  return (
    <DashboardLayout title="Boards">
      <div className="space-y-4">
        {/* Board selector */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {mockBoards.map(board => (
            <button
              key={board.id}
              onClick={() => setSelectedBoard(board)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                selectedBoard.id === board.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedBoard.id === board.id ? 'white' : board.color }} />
              {board.name}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedBoard.id === board.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {board.cards}
              </span>
            </button>
          ))}
          <button
            onClick={() => notifyAction("New board wizard coming soon.")}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Board
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search cards..."
                className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 w-48"
              />
            </div>
            <FilterBar
              filters={[
                { label: 'Priority', options: ['High', 'Medium', 'Low'] },
                { label: 'Assignee', options: ['John M.', 'Sarah K.', 'Mike T.', 'Lisa P.'] },
              ]}
            />
          </div>

          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
            {(Object.keys(viewIcons) as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex items-center justify-center w-8 h-7 rounded-md transition-all duration-200 ${
                  view === v ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                aria-label={`${v} view`}
              >
                {viewIcons[v]}
              </button>
            ))}
          </div>
        </div>

        {/* Board content */}
        {view === 'kanban' && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {mockColumns.map(col => (
              <BoardColumn key={col.id} column={col} />
            ))}
            <div className="flex-shrink-0 w-72">
              <button
                onClick={() => notifyAction("Add column coming soon.")}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-300 hover:text-blue-500 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Column
              </button>
            </div>
          </div>
        )}

        {view === 'list' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Title', 'Column', 'Priority', 'Assignee', 'Due Date', 'Tags'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockColumns.flatMap(col =>
                  col.cards.map(card => (
                    <tr key={card.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{card.title}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-sm text-gray-600">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                          {col.title}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          card.priority === 'high' ? 'bg-red-100 text-red-700' :
                          card.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>{card.priority}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{card.assignee}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{card.dueDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {card.tags.map(t => (
                            <span key={t} className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{t}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {view === 'table' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="grid grid-cols-4 gap-4">
              {mockColumns.map(col => (
                <div key={col.id} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                    <span className="text-sm font-semibold text-gray-700">{col.title}</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 font-heading">{col.cards.length}</div>
                  <div className="text-xs text-gray-400 mt-1">cards</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
