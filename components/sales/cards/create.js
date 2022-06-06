import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import Modal from '@/components/modal';
import Editor from '@/components/editor';
import { useDispatchGlobalState, useGlobalState } from '../../global-state';
import { FIND_SALES_QUERY } from '../../../lib/queries';
import { ReactS3Client } from '../../../lib/aws-s3';

const CREATE_SALES_CARD = gql`
	mutation createSaleCard($title: String!, $position: Int!, $content: String!, $saleId: ID!, $fileArray: String) {
		createSaleCard(input: { title: $title, position: $position, content: $content, saleId: $saleId, fileArray: $fileArray }) {
			id
			title,
			content
			position
			fileArray
		}
	}
`;

const CreateSalesCard = ({ industryId, saleId, position, onCreate }) => {
	// State
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	// Context
	const { createSalesCardModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [createSalesCard, state] = useMutation(
		CREATE_SALES_CARD,
		{
			refetchQueries: [
				{
					query: FIND_SALES_QUERY,
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
			type: 'CREATE_SALES_CARD_MODAL_IS_OPEN',
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
		
				const result = await createSalesCard({
					variables: {
						title,
						content,
						saleId,
						position: position + 1,
						fileArray: JSON.stringify(files),
					},
				});

				onCloseModal();

				setLoading(false);
		
				return onCreate(result.data.createSaleCard);
			} else {
				const result = await createSalesCard({
					variables: {
						title,
						content,
						saleId,
						position: position + 1
					},
				});
		
				onCloseModal();
		
				setLoading(false);

				return onCreate(result.data.createSaleCard);
			}
		} catch (e) {
			console.error(e);
			
			setLoading(false);
			
			setError(true);
		}
	}

	return (
		<Modal title="Create new sales process" isOpen={createSalesCardModalIsOpen} onClose={() => onCloseModal()}>
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

export default CreateSalesCard;