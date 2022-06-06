import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import Modal from '@/components/modal';
import Editor from '@/components/editor';
import { useDispatchGlobalState, useGlobalState } from '../../global-state';
import { FIND_JOURNEYS_QUERY } from '../../../lib/queries';
import { ReactS3Client } from '../../../lib/aws-s3';

const CREATE_CHALLENGE_MUTATION = gql`
	mutation createChallenge($title: String!, $content: String!, $professionId: ID!, $position: Int!, $fileArray: String) {
		createChallenge(input: { title: $title, content: $content, professionId: $professionId, position: $position, fileArray: $fileArray }) {
			title
			content
			fileArray
		}
	}
`;

const CreateChallenge = ({ industryId, professionId, languageId, position }) => {
	// State
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	// Context
	const { createChallengeModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [createChallenge, state] = useMutation(
		CREATE_CHALLENGE_MUTATION,
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
			type: 'CREATE_CHALLENGE_MODAL_IS_OPEN',
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

				await createChallenge({
					variables: {
						title,
						content,
						position: position + 1,
						industryId,
						professionId,
						languageId,
						fileArray: JSON.stringify(files),
					},
				});

				setLoading(false);
				onCloseModal();
			} else {
				await createChallenge({
					variables: {
						title,
						content,
						position: position + 1,
						industryId,
						professionId,
						languageId,
					},
				});

				setLoading(false);
				onCloseModal();
			}
		} catch (e) {
			console.error(e);
			setLoading(false);
			setError(true);
		}
	}

	return (
		<Modal title="Create new" isOpen={createChallengeModalIsOpen} onClose={() => onCloseModal()}>
			{error && <p style={{ color: 'red', fontSize: 16, marginBottom: 20 }}>An unexpected error occured.</p>}
			
			<form onSubmit={(e) => onSubmit(e)}>
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

				<button type="submit" className="btn btn-primary">{loading ? 'Loading' : 'Create'}</button>
			</form>
		</Modal>
	);
}

export default CreateChallenge;