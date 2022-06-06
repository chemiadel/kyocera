import { useRouter } from 'next/router';
import CasesList from './list';

const Cases = ({ shouldCreateIndustry, role }) => {
	const router = useRouter();

	return (
		<div className="detail-item" id="cont-2">
			<h4>Customer Cases & Competition</h4>

			<CasesList
				industryId={router.query.industry ?? 0}
				role={role}
			/>
		</div>
	);
}

export default Cases;
