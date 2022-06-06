import { useRouter } from 'next/router';

import SalesList from './list';

const Sales = ({ shouldCreateIndustry, role }) => {
	const router = useRouter();
	
	return (
		<div className="detail-item" id="cont-2">
			<h4>Sales process guidance - KSE Process in Salesforce</h4>

			<SalesList
				industryId={router.query.industry ?? 0}
				role={role}
			/>
		</div>
	);
}

export default Sales;
