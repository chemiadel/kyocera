import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import Modal from '@/components/modal';
import Editor from '@/components/editor';
import { useDispatchGlobalState, useGlobalState } from '../../global-state';
import { FIND_CASES_QUERY } from '../../../lib/queries';
import { ReactS3Client } from '../../../lib/aws-s3';

const CREATE_CASES_CARD = gql`
	mutation createCaseCard($title: String!, $position: Int!, $content: String!, $caseId: ID!, $fileArray: String) {
		createCaseCard(input: { title: $title, position: $position, content: $content, caseId: $caseId, fileArray: $fileArray }) {
			id
			title,
			content
			position
			fileArray
		}
	}
`;

const CreateCasesCard = ({ industryId, caseId, position, onCreate }) => {
	// State
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	// Context
	const { createCasesCardModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [createCasesCard, state] = useMutation(
		CREATE_CASES_CARD,
		{
			refetchQueries: [
				{
					query: FIND_CASES_QUERY,
					variables: {
						industryId,
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
			type: 'CREATE_CASES_CARD_MODAL_IS_OPEN',
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

				const result = await createCasesCard({
					variables: {
						title,
						content,
						caseId,
						position: position + 1,
						fileArray: JSON.stringify(files),
					},
				});

				onCloseModal();

				setLoading(false);
				return onCreate(result.data.createCaseCard);
			} else {
				const result = await createCasesCard({
					variables: {
						title,
						content,
						caseId,
						position: position + 1
					},
				});

				onCloseModal();

				setLoading(false);
				return onCreate(result.data.createCaseCard);
			}
		} catch (e) {
			console.error(e);
			setLoading(false);
			setError(true);
		}
	}

	return (
		<Modal title="Create new" isOpen={createCasesCardModalIsOpen} onClose={() => onCloseModal()}>
			{error && <p style={{ color: 'red', fontSize: 16, marginBottom: 20 }}>An unexpected error occured.</p>}
			
			<form onSubmit={(e) => onSubmit(e)} enctype="multipart/form-data">
				<div className={`form-group ${title.length > 0 ? 'has-value' : ''}`}>
					<label htmlFor="title">Title</label>

					<input
						type="text"
						className="form-control"
						id="title"
						required
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

export default CreateCasesCard;