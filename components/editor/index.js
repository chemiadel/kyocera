import dynamic from 'next/dynamic';
const SunEditor = dynamic(() => import('suneditor-react'), {
	ssr: false,
});

const Editor = (props) => (
	<SunEditor {...props} setOptions={{
		minHeight: 200,
		buttonList: [['undo', 'redo'], ['font', 'fontSize', 'formatBlock'], ['bold', 'underline', 'italic'], ['align', 'horizontalRule', 'list', 'table'], ['fontColor', 'hiliteColor'], ['link'], ['removeFormat'], ['codeView']],
	}} />
);

export default Editor;
