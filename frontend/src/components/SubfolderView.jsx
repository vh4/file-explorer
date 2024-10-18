// src/components/SubfolderView.js
import React, { useEffect, useState } from 'react';
import { FaFolder, FaFileAlt } from 'react-icons/fa';

const SubfolderView = ({ selectedFolder, onFolderSelect }) => {
  const [subfolders, setSubfolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedFolder) {
        setLoading(true);
        try {
          const folderResponse = await fetch(
            `http://localhost:3000/folders?parent_id=${selectedFolder}`
          );
          if (!folderResponse.ok) {
            throw new Error(`Folder fetch error! Status: ${folderResponse.status}`);
          }
          const folderData = await folderResponse.json();

          const fileResponse = await fetch(
            `http://localhost:3000/folders/${selectedFolder}/files`
          );
          if (!fileResponse.ok) {
            throw new Error(`File fetch error! Status: ${fileResponse.status}`);
          }
          const fileData = await fileResponse.json();

          setSubfolders(folderData);
          setFiles(fileData);
        } catch (err) {
          console.error('Error fetching subfolders or files:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedFolder]);

  if (!selectedFolder) {
    return <div className="p-4">Select a folder to view its contents</div>;
  }

  if (loading) {
    return <div className="p-4">Loading subfolders and files...</div>;
  }

  return (
    <div className="h-full p-4">
      <h2 className="text-lg font-bold mb-4">Contents of Folder ID: {selectedFolder}</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-6 gap-4">
        {subfolders.map(folder => (
          <div 
            key={folder.id} 
            className="flex flex-col items-center space-y-2 cursor-pointer"
            onClick={() => onFolderSelect(folder.id)}
          >
            <FaFolder className="text-blue-500 text-4xl" />
            <span className="text-sm text-gray-700">{folder.name}</span>
          </div>
        ))}

        {files.map(file => (
          <div key={file.id} className="flex flex-col items-center space-y-2">
            <FaFileAlt className="text-green-500 text-4xl" />
            <span className="text-sm text-gray-700">{file.name}</span>
          </div>
        ))}

        {subfolders.length === 0 && files.length === 0 && (
          <div className="col-span-6 text-center text-gray-500">
            No contents found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SubfolderView;
