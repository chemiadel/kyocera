import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import Modal from '@/components/modal';
import Editor from '@/components/editor';
import { useDispatchGlobalState, useGlobalState } from '../../global-state';
import { FIND_JOURNEYS_QUERY } from '../../../lib/queries';
import { ReactS3Client } from '../../../lib/aws-s3';

const UPDATE_Pain_MUTATION = gql`
	mutation updatePain($id: ID!, $title: String!, $content: String!,  $fileArray: String) {
		updatePain(input: { id: $id, title: $title, content: $content, fileArray: $fileArray }) {
			title
			content
			fileArray
		}
	}
`;

const UpdateCasesCard = ({ id, industryId, professionId, languageId, title: propsTitle, content: propsContent, selectedFiles: propsSelectedFiles, onClose }) => {
	// State
	const [title, setTitle] = useState(propsTitle ?? '');
	const [content, setContent] = useState(propsContent ?? '');
	const [initialSelectedFiles, setInitialSelectedFiles] = useState(propsSelectedFiles ?? []);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	// Context
	const { updatePainModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [updatePain, state] = useMutation(
		UPDATE_Pain_MUTATION,
		{
			refetchQueries: [
				{
					query: FIND_JOURNEYS_QUERY,
					variables: {
						industryId,
						professionId,
						languageId,
					},
				},
			],
		},
	);

	// Methods
	const handleFileInput = (e) => {
		setSelectedFiles(e.target.files);
	}

	const onCloseModal = () => {
		dispatch({
			type: 'UPDATE_PAIN_MODAL_IS_OPEN',
			payload: false,
		});

		setTitle('');
		setContent('');

		onClose();
	}

	const onSubmit = async e => {
		e.preventDefault();

		
		setError(false);
		setLoading(true);

		try {
			const files = [];

			for (let i = 0; i < selectedFiles.length; i++) {
				const file = selectedFiles[i];
				const upload = await ReactS3Client.uploadFile(file, file.name);

				files.push({
					location: upload.location,
					name: file.name,
				});
			}

			await updatePain({
				variables: {
					id,
					title,
					content,
					fileArray: JSON.stringify(initialSelectedFiles.concat(files)),
				},
			});

			setLoading(false);
			onCloseModal();
		} catch (e) {
			console.error(e);
			setLoading(false);
			setError(true);
		}
	}

	const removeFile = (e, index) => {
		e.preventDefault();

		setInitialSelectedFiles(initialSelectedFiles.filter((file, key) => key !== index));
	}

	return (
		<Modal title="Update" isOpen={updatePainModalIsOpen} onClose={() => onCloseModal()}>
			{error && <p style={{ color: 'red', fontSize: 16, marginBottom: 20 }}>An unexpected error occured.</p>}
		
			<form onSubmit={(e) => onSubmit(e)}>
				<div className={`form-group ${title.length > 0 ? 'has-value' : ''}`}>
					<label htmlFor="title">Title</label>

					<input
						type="text"
						className="form-control"
						id="title"
						value={title}
						required
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				
				<div className="form-group is-textarea">
					<label htmlFor="content">Content</label>

					<Editor onChange={(value) => setContent(value)} defaultValue={content} />
				</div>

				<ul class="list-files-modal">
					{initialSelectedFiles.map((file, key) => (
						<li key={key}>
							{file.name}

							<button class="delete" type="button" onClick={(e) => removeFile(e, key)}><i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></i></button>
						</li>
					))}
				</ul>

				<h5 style={{fontSize: 18, marginBottom: 12}}>Add New Files</h5>
				<small style={{marginBottom: 12, display: 'flex'}}>This is not going to replace with your files. You will be adding extra files. For the delete, use the (x) icon on the right side of the file.</small>

				<div className="form-group">
					<input type="file" onChange={handleFileInput} multiple class="form-group" />
				</div>
			
				<button type="submit" className="btn btn-primary" disabled={content.length === 0}>{loading ? 'Loading' : 'Update'}</button>
			</form>
		</Modal>
	);
}

export default UpdateCasesCard;