import EditableImage from "./EditableImage";

export default function Cover({src,onChange,editable}) {
  return (
    <EditableImage type={'cover'} src={src} onChange={onChange} editable={editable} className={'h-36'} />
  );
}