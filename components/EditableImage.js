import {useState} from "react";
import {FileDrop} from "react-file-drop";
import {PulseLoader} from "react-spinners";

export default function EditableImage({type,src,onChange,className,editable=false}) {
  const [isFileNearby, setIsFileNearby] = useState(false);
  const [isFileOver,setIsFileOver] = useState(false);
  const [isUploading,setIsUploading] = useState(false);

  let extraClasses = '';
  if (isFileNearby && !isFileOver) extraClasses += ' bg-blue-500 opacity-40';
  if (isFileOver) extraClasses += ' bg-blue-500 opacity-90';
  if (!editable) extraClasses = '';

  function updateImage(files,e) {
    if (!editable) {
      return;
    }
    e.preventDefault();
    setIsFileNearby(false);
    setIsFileOver(false);
    setIsUploading(true);
    const data = new FormData();
    data.append(type, files[0]);
    fetch('/api/upload', {
      method: 'POST',
      body:data,
    }).then(async response => {
      const json = await response.json();
      onChange(json.src);
      setIsUploading(false);
    });
  }

  return (
    <FileDrop
      onDrop={updateImage}
      onDragOver={() => setIsFileOver(true)}
      onDragLeave={() => setIsFileOver(false)}
      onFrameDragEnter={() => setIsFileNearby(true)}
      onFrameDragLeave={() => setIsFileNearby(false)}
      onFrameDrop={() => {
        setIsFileNearby(false);
        setIsFileOver(false);
      }}
    >
      <div className={"bg-twitterBorder text-white relative"}>
        <div className={'absolute inset-0 '+extraClasses}></div>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center"
               style={{backgroundColor:'rgba(48, 140, 216,0.9)'}}>
            <PulseLoader size={14} color={'#fff'} />
          </div>
        )}
        <div className={"cover flex items-center overflow-hidden "+className}>
          {src && (<img src={src} className="w-full" alt=""/>)}
        </div>
      </div>
    </FileDrop>
  );
}