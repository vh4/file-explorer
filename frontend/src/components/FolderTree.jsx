// src/components/FolderTree.js
import React, { useEffect, useState } from 'react';
import { FaFolder, FaHome } from 'react-icons/fa';

const FolderTree = ({ onFolderSelect }) => {
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch('http://localhost:3000/folders');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched folders:', data);
        setFolders(data);
      } catch (err) {
        console.error('Failed to fetch folders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  const renderFolders = (folderList, parentId = null) => {
    return folderList
      .filter(folder => folder.parent_id === parentId)
      .map(folder => (
        <div key={folder.id} className="ml-4 folder-item">
          <div
            onClick={() => onFolderSelect(folder.id)}
            className="cursor-pointer flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
          >
            <FaFolder className="text-blue-500" />
            <span className="text-gray-700">{folder.name}</span>
          </div>
          <div className="ml-4">
            {renderFolders(folderList, folder.id)}
          </div>
        </div>
      ));
  };

  if (loading) {
    return <div className="p-4">Loading folders...</div>;
  }

  return (
    <div className="folder-tree-container border-r border-gray-300 h-full overflow-y-auto">
      <div className="p-4 flex items-center space-x-2">
        <FaHome className="text-green-500" />
        <h2 className="text-lg font-bold">Root</h2>
      </div>
      {error && <div className="text-red-500 p-2">{error}</div>}
      <div className="pl-4">{renderFolders(folders)}</div>
    </div>
  );
};

export default FolderTree;
