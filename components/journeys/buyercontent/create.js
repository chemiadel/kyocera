import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import Modal from '@/components/modal';
import Editor from '@/components/editor';
import { useDispatchGlobalState, useGlobalState } from '../../global-state';
import { FIND_BUYER_CONTENTS_QUERY } from '../../../lib/queries';
import { ReactS3Client } from '../../../lib/aws-s3';

const CREATE_BUYER_CONTENT = gql`
	mutation createBuyerContents($title: String!, $position: Int!, $content: String!, $professionId: ID!, $fileArray: String) {
		createBuyerContent(input: { title: $title, position: $position, content: $content, professionId: $professionId, fileArray: $fileArray }) {
			id
			title,
			content
			position
			fileArray
		}
	}
`;

const CreateBuyerContent = ({ professionId, position, onCreate }) => {
	// State
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	// Context
	const { createBuyerContentModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [createBuyerContent, state] = useMutation(
		CREATE_BUYER_CONTENT,
		{
			refetchQueries: [
				{
					query: FIND_BUYER_CONTENTS_QUERY,
					variables: {
						professionId,
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
			type: 'CREATE_BUYER_CONTENT_MODAL_IS_OPEN',
			payload: false,
		});

		setTitle('');
		setContent('');
	}

	const onSubmit = async e => {
		e.preventDefault();
		
		setError(false);
		setLoading(true);

		try {
			if (selectedFiles.length > 0) {
				const files = [];

				for (let i = 0; i < selectedFiles.length; i++) {
					const file = selectedFiles[i];
					const upload = await ReactS3Client.uploadFile(file, file.name);

					files.push({
						location: upload.location,
						name: file.name,
					});
				}
		
				const result = await createBuyerContent({
					variables: {
						title,
						content,
						professionId,
						position: position + 1,
						fileArray: JSON.stringify(files),
					},
				});

				onCloseModal();

				setLoading(false);
		
				return onCreate(result.data.createBuyerContent);
			} else {
				const result = await createBuyerContent({
					variables: {
						title,
						content,
						professionId,
						position: position + 1
					},
				});
		
				onCloseModal();
		
				setLoading(false);

				return onCreate(result.data.createBuyerContent);
			}
		} catch (e) {
			console.error(e);
			
			setLoading(false);
			
			setError(true);
		}
	}

	return (
		<Modal title="Create new buyer content" isOpen={createBuyerContentModalIsOpen} onClose={() => onCloseModal()}>
			{error && <p style={{ color: 'red', fontSize: 16, marginBottom: 20 }}>An unexpected error occured.</p>}
			
			<form onSubmit={(e) => onSubmit(e)}>
				<div className={`form-group ${title.length > 0 ? 'has-value' : ''}`}>
					<label htmlFor="title">Title</label>

					<input
						type="text"
						className="form-control"
						required
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				
				<div className="form-group is-textarea">
					<label htmlFor="content">Content</label>

					<Editor onChange={(value) => setContent(value)} defaultValue={content} />
				</div>

				<div className="form-group">
					<input type="file" onChange={handleFileInput} multiple class="form-group" />
				</div>
			
				<button type="submit" className="btn btn-primary" disabled={content.length === 0}>{loading ? 'Loading' : 'Create'}</button>
			</form>
		</Modal>
	);
}

export default CreateBuyerContent;