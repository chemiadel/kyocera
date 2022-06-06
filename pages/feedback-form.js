import { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { FIND_INDUSTRIES_QUERY, FIND_PROFESSIONS_QUERY } from '../lib/queries';
import { ReactS3Client } from '../lib/aws-s3';
import {useAuth} from "../lib/azureAuth/authContext"

const SEND_NOTIFICATION = gql`
	mutation {
		sendFeedbackNotification(input: {id: 0}) {
			status
		}
	}
`;

const FEEDBACK_FORM_QUERY = gql`
	mutation createFeedbackFormSecond($fullname: String, $email: String, $industryId: ID!, $roleId: ID!, $area: String!, $comments: String!, $file: String, $fileName: String) {
		createFeedbackFormSecond(input: { fullname: $fullname, email: $email, industryId: $industryId, roleId: $roleId, area: $area, comments: $comments, file: $file, fileName: $fileName }) {
			id
			fullname
			email
			industry {
				id
				name
			}
			role {
				id
				name
			}
			area
			comments
			file
			fileName
		}
	}
`;

export default function FeedbackForm() {
	// State
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState('');
	const [role, setRole] = useState('');
	const [area, setArea] = useState('');
	const [comments, setComments] = useState('');
	const { user } = useAuth();
	const languageId = user?.language.id ? +user?.language.id : 0;
	const [selectedFile, setSelectedFile] = useState(null);
	const [error, setError] = useState(false);

	// GraphQL
	const [createFeedbackForm, state] = useMutation(FEEDBACK_FORM_QUERY);
	const [sendFeedbackNotification, feedbackState] = useMutation(SEND_NOTIFICATION);
	const industries = useQuery(
		FIND_INDUSTRIES_QUERY,
		{
			variables: {
				languageId,
			},
		},
	);
	const professions = useQuery(
		FIND_PROFESSIONS_QUERY,
		{
			variables: {
				industryId: industry,
			},
		},
	);

	// Packages
	const router = useRouter();

	// Methods
	const handleFileInput = (e) => {
		setSelectedFile(e.target.files[0]);
	}

	const onSubmit = async e => {
		e.preventDefault();

		setError(false);

		try {
			if (selectedFile) {
				const upload = await ReactS3Client.uploadFile(selectedFile, selectedFile.name);

				await createFeedbackForm({
					variables: {
						fullname,
						email,
						industryId: industry,
						roleId: role,
						area,
						comments,
						file: upload.location,
						fileName: selectedFile.name,
					}
				});
		
				router.back();
			} else {
				await createFeedbackForm({
					variables: {
						fullname,
						email,
						industryId: industry,
						roleId: role,
						area,
						comments,
					}
				});

				await sendFeedbackNotification({

				});
		
				router.back();
			}
		} catch (e) {
			console.error(e);
			setError(true);
		}
	}
	
	return (
		<main className="feedback-form">
			<section className="feedback-form-hero">
				<div className="container-fluid">
					<div className="row">
						<div className="col-lg-6">
							<div className="feedback-form-hero-body">
								<h2>Feedback form</h2>
	
								<h5>Let us know how we can improve this Sales Toolkit for you and your colleagues.</h5>
							</div>
						</div>
	
						<div className="col-lg-6">
							<div className="feedback-form-hero-image">
								<div className="feedback-form-hero-image-contain">
									<img src="/img/feedback-form-img.svg" alt="" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		
			<section className="feedback-form-body">
				<div className="container">
					<p>Please specify to which industry, role and area of the sales toolkit your feedback is related to.</p>
	
					<form onSubmit={e => onSubmit(e)}>
						<div className={`form-group ${fullname.length > 0 ? 'has-value' : ''}`}>
							<label htmlFor="fullname">Full Name</label>
	
							<input
								type="text"
								className="form-control"
								id="fullname"
								required
								value={fullname}
								onChange={({ target }) => setFullname(target.value)}
							/>
						</div>

						<div className={`form-group ${email.length > 0 ? 'has-value' : ''}`}>
							<label htmlFor="email">E-Mail</label>
	
							<input
								type="text"
								className="form-control"
								id="email"
								required
								value={email}
								onChange={({ target }) => setEmail(target.value)}
							/>
						</div>

						<div className="form-group">
							<select id="industry" class="form-control" value={industry} onChange={e => {
								setRole('');
								setIndustry(e.target.value);
							}}>
								<option value="">Industry</option>

								{industries.data && industries.data.findIndustries.items.map(item => (
									<option value={item.id} key={item.id}>{item.name}</option>
								))}
							</select>
						</div>
	
						{industry && (
							<div className="form-group">
								<select id="role" class="form-control" value={role} onChange={e => setRole(e.target.value)}>
									<option value="">Role</option>

									{professions.data && professions.data.findProfessions.items.map(item => (
										<option value={item.id} key={item.id}>{item.name}</option>
									))}
								</select>
							</div>
						)}
						
						<div className="form-group">
							<select id="area" class="form-control" value={area} onChange={e => setArea(e.target.value)}>
								<option value="">Area</option>

								<option value="Pain, Capability, Solution">Pain, Capability, Solution</option>
								<option value="Sales Process Guidance">Sales Process Guidance</option>
								<option value="Customer Cases & Competition">Customer Cases & Competition</option>
							</select>
						</div>
						
						<div className="form-group is-textarea">
							<label htmlFor="comments">Comments</label>
	
							<textarea
								id="comments"
								rows="10"
								className="form-control"
								placeholder="Please leave your comments here..."
								defaultValue={comments}
								onChange={({ target }) => setComments(target.value)}
							/>
						</div>
	
						<div className="file-upload">
							<input type="file" id="upload" onChange={handleFileInput} hidden />
	
							<label htmlFor="upload">
								<span></span>
								{selectedFile ? selectedFile.name : 'Upload documents click here'}
							</label>
						</div>
	
						<button className="btn btn-primary" type="submit">{state.loading ? 'LOADING' : 'SUBMIT'}</button>
					</form>
				</div>
			</section>
		</main>
	)
};
