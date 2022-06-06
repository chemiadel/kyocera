import { useRouter } from 'next/router';

import JourneysList from './list';

const Journeys = ({ shouldCreateIndustry, languageId, role }) => {
	const router = useRouter();
	
	return (
		<div className="detail-item" id="cont-2">
			<h4>Learn more about their challenges</h4>

			<JourneysList
				industryId={router.query.industry ?? 0}
				professionId={router.query.profession ?? 0}
				languageId={languageId}
				role={role}
			/>
			
		</div>
	);
}

export default Journeys;
