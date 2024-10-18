// src/components/ParentComponent.js
import React, { useState } from 'react';
import FolderTree from './components/FolderTree';
import SubfolderView from './components/SubfolderView';

const ParentComponent = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleFolderSelect = (folderId) => {
    setSelectedFolder(folderId);
  };

  return (
    <div className="flex">
      <FolderTree onFolderSelect={handleFolderSelect} />
      <SubfolderView selectedFolder={selectedFolder} onFolderSelect={handleFolderSelect} />
    </div>
  );
};

export default ParentComponent;
