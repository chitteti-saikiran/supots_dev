import React, { useState, useCallback, useEffect , useContext, useRef, MutableRefObject } from 'react';
import { File } from '@nativescript/core';
import * as AppSettings from '@nativescript/core/application-settings';
import strings from '../utils/strings';
import { UploadMeta } from '~/Screens/Events';
import * as ISupotsu from '~/DB/interfaces';
import { openFilePicker } from '@nativescript-community/ui-document-picker';
import { Request, CompleteEventData, ErrorEventData, ProgressEventData, ResultEventData, Session, Task, session as uploadSession, session } from 'nativescript-background-http'
import Methods from '~/Methods';
import { AppAuthContext } from '~/components/Root';
import { useTimeout } from '../utils/index';

type UploadFile = File | ISupotsu.IFile;
interface UploadingData {
  id: string;
  file: UploadFile,
  meta: UploadMeta,
  isUploading?: boolean,
  isDeleting?: boolean
}

type UploadState = Record<string, UploadingData>;

type Tasks = Record<string, Task>;

interface UseFileUploads {
  files: UploadState;
  pickAFile(clearFirst?: boolean): void;
  isRawFile(file: UploadFile): boolean,
  removeFile(key: string, file: UploadFile): void
  cancelUpload(key: string): void
  clearFiles(): void
}

const FileUploaderContext = React.createContext({} as UseFileUploads);

interface FileUploaderProviderProps {
  _id: string,
  children: React.ReactNode
}

export const FileUploaderProvider = ({
  _id,
  children
}: FileUploaderProviderProps) => {
  const { user } = useContext(AppAuthContext);
  const [files, setFiles] = useState<UploadState>(() => {
    const _files = AppSettings.getString(`${strings.UPLOADS_FOR}${_id}`, '{}');
    const fileList: UploadState = JSON.parse(_files);
    return {};
  });

  const tasks: MutableRefObject<Tasks> = useRef<Tasks>();

  const updateFiles = () => {
    const filesFor = JSON.stringify(files);
    AppSettings.setString(`${strings.UPLOADS_FOR}${_id}`, JSON.stringify(filesFor));
  }

  const pickAFile = useCallback((clearFirst?: boolean) => {
    const existingFiles = files || {};
    const id = `file-${Date.now()}`;
    openFilePicker({
      pickerMode: 0,
      extensions: [".png", ".jpg"],
      multipleSelection: false
    }).then(({ files: fileList }) => {
      if (fileList[0]) {
        const fileObj = File.fromPath(fileList[0])
        console.log('uploading...');
        const newFile: UploadingData = {
          file: fileObj,
          meta: {
            progress: 0,
            total: 0
          },
          id,
          isUploading: true,
          isDeleting: false
        }

        existingFiles[id] = newFile

        setFiles(existingFiles);

        updateFiles();

        const run = () => {
          if (clearFirst) {
            clearFiles();
          }
          const url = "https://supotsu.com/api/file/upload"

          var request: Request = {
            url: url,
            method: "POST",
            headers: {
              "Content-Type": "application/octet-stream",
              "File-Name": fileObj.name
            },
            description: "Uploading file...",
            androidAutoClearNotification: true,
            androidDisplayNotificationProgress: true,
            androidNotificationTitle: `Supotsu Upload`,
            //androidAutoDeleteAfterUpload:
          };

          var re = /(?:\.([^.]+))?$/;
          const ext = (filename: string) => {
            const _ = re.exec(filename)[1] || "*";
            return _;
          }

          var params = [
            { name: "location", value: "" },
            { name: "albumId", value: "" },
            { name: "tags", value: "[]" },
            { name: "objType", value: "profile" },
            { name: "fromId", value: user._id },
            { name: "fromType", value: user.type },
            { name: "toId", value: user._id },
            { name: "toType", value: user.type },
            { name: "file", filename: fileObj.path, mimeType: `image/${ext(fileObj.name)}` }
          ];

          const session_ = uploadSession(fileObj.name)
          var task: Task = session_.multipartUpload(params, request);
          task.on('complete', (args: CompleteEventData) => {
            //_modal.closeCallback(false);
            //task.cancel();
            //console.log(args)
          })
          task.on('progress', (args: ProgressEventData) => {
            console.log(args.currentBytes, "/", args.totalBytes);
            const progress = args.currentBytes / args.totalBytes * 100
            const total = args.totalBytes / args.totalBytes * 100
            existingFiles[id] = {
              ...existingFiles[id],
              meta: {
                total,
                progress
              },
              isUploading: true
            }
            setFiles(existingFiles);
            updateFiles();
          })

          task.on('error', (args: ErrorEventData) => {
            console.log('error', args)
            existingFiles[id] = {
              ...existingFiles[id],
              isUploading: false
            }
            setFiles(existingFiles);
            updateFiles();
            tasks.current[id] = null;
            alert("Error while uploading file, please try again!")
          });

          task.on('responded', (args: ResultEventData) => {
            const _data = JSON.parse(args.data);
            console.log(_data);
            setFiles({
              ...existingFiles,
              [id]: {
                ...existingFiles[id],
                file: _data as ISupotsu.IFile,
                isUploading: false
              }
            });
            updateFiles();
          });

          tasks.current[id] = task;
        }
        run();
      }
    }).catch((err) => {})
  }, [_id, files]);

  const clearFiles = () => {
    console.log('FileUploaderProvider', 'clear files')
    AppSettings.setString(`${strings.UPLOADS_FOR}${_id}`, '{}');
    const fileKeys = Object.keys(files);
    fileKeys.forEach((key) => {
      removeFile(key, files[key].file);
    })
    setFiles({});
    updateFiles();
  }

  const isRawFile = (file: UploadFile): file is File => {
    if (!file) return true;
    return '_name' in file;
  }

  const removeFile = (key: string, file: UploadFile) => {
    const existingFiles = files;
    if (isRawFile(file)) {
      delete existingFiles[key];
      setFiles(existingFiles);
      updateFiles();
    } else {
      const dataTo = {
        _id: file._id,
        user: {
          _id: Methods.you()._id,
          type: Methods.you().type
        },
        img: file,
        tags: []
      };

      existingFiles[key] = {
        ...existingFiles[key],
        isDeleting: true
      }
      updateFiles();

      Methods.post(`https://supotsu.com/api/file/remove`, dataTo, {
        headers: {
          'Content-Type': 'application/json'
        },
        success() {
          delete existingFiles[key];
          setFiles(existingFiles);
          updateFiles();
        },
        error() {
          alert("File not deleletd")
          existingFiles[key] = {
            ...existingFiles[key],
            isDeleting: false
          }
          setFiles(existingFiles);
          updateFiles();
        }
      })
    }
  }

  const cancelUpload = (key: string) => {

  };

  return (
    <FileUploaderContext.Provider key={`file-count-${Object.keys(files).length}`} value={{
      files,
      isRawFile,
      pickAFile,
      removeFile,
      cancelUpload,
      clearFiles
    }}>
      {children}
    </FileUploaderContext.Provider>
  )
}

export const useFileUploads = (): UseFileUploads => {
  const context = useContext(FileUploaderContext);
  const [files, setFiles] = useState<UploadState>(() => context.files);
  const updated = useTimeout(1000);
  return context;
}
