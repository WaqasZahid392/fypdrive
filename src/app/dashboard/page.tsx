import { getRootFolders, deleteFolder, renameFolder } from '@/actions/folders';
import { getFiles, deleteFile, renameFile } from '@/actions/files';
import CreateFolderDialog from '@/components/CreateFolderDialog';
import FileUpload from '@/components/FileUpload';
import DeleteButton from '@/components/DeleteButton';
import RenameButton from '@/components/RenameButton';
import { DownloadButton } from '@/components/DownloadButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Folder, FileText } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const folders = await getRootFolders();
  const filesList = await getFiles(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">My Files</h1>
            <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 mt-1">Manage your personal cloud storage.</p>
          </div>
          <div className="hidden md:block border-l border-neutral-300 dark:border-neutral-700 h-8 mx-2"></div>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex space-x-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 items-center">
          <div className="md:hidden mr-auto">
            <ThemeToggle />
          </div>
          <FileUpload folderId={null} />
          <CreateFolderDialog />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-4">Content</h2>
        {folders.length === 0 && filesList.length === 0 ? (
          <div className="text-center py-12 bg-neutral-100/50 dark:bg-neutral-950/50 rounded-2xl border border-neutral-200 dark:border-neutral-800/50 border-dashed">
            <Folder className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-500 dark:text-neutral-400">Your vault is empty. Upload a file or create a folder!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {folders.map(folder => (
              <div key={folder.id} className="relative group rounded-2xl sm:rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] transition-all overflow-hidden cursor-pointer aspect-square flex flex-col">
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex space-x-1 sm:space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all z-20">
                  <DownloadButton id={folder.id} type="folder" />
                  <RenameButton id={folder.id} currentName={folder.name} type="folder" onRename={renameFolder} />
                  <DeleteButton id={folder.id} type="folder" onDelete={deleteFolder} />
                </div>

                <Link href={`/dashboard/folder/${folder.id}`} className="flex flex-col items-center justify-center flex-1 p-3 sm:p-6 relative z-10">
                  <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl sm:rounded-3xl mb-2 sm:mb-6 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-all duration-300">
                    <Folder className="w-10 h-10 sm:w-16 sm:h-16 text-blue-500 fill-blue-500/20" />
                  </div>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-200 text-sm sm:text-xl truncate w-full text-center px-2 sm:px-4">{folder.name}</span>
                </Link>
              </div>
            ))}

            {filesList.map(file => {
              const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(file.type.toLowerCase());
              return (
                <div key={file.id} className="relative group rounded-2xl sm:rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)] transition-all overflow-hidden cursor-pointer aspect-square flex flex-col">
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex space-x-1 sm:space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all z-20">
                    <DownloadButton id={file.id} type="file" />
                    <RenameButton id={file.id} currentName={file.name} type="file" onRename={renameFile} />
                    <DeleteButton id={file.id} type="file" url={file.url} onDelete={deleteFile} />
                  </div>

                  <a href={file.url} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center flex-1 p-3 sm:p-6 relative z-10 w-full h-full">
                    {isImage ? (
                      <div className="absolute inset-0 z-0">
                        <img src={file.url} alt={file.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-neutral-900 dark:via-neutral-900/60 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="p-3 sm:p-4 bg-purple-50 dark:bg-purple-500/10 rounded-2xl sm:rounded-3xl mb-2 sm:mb-6 group-hover:scale-110 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20 transition-all duration-300 z-10">
                        <FileText className="w-10 h-10 sm:w-16 sm:h-16 text-purple-500" />
                      </div>
                    )}

                    <div className="z-10 flex flex-col items-center w-full mt-auto">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm sm:text-xl truncate w-full text-center px-2 sm:px-4 drop-shadow-md">{file.name}</span>
                      <span className="text-[10px] sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1 sm:mt-2 uppercase tracking-wider drop-shadow-md">{file.type} • {(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
