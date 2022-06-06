import { useRouter } from 'next/router';
import BuyerContentList from './list';

const BuyerContents = ({ shouldCreateIndustry, role }) => {
	const router = useRouter();
	console.log(router.query.profession)
	return (
		<div className="detail-item" id="cont-2">
            <h4>Content & Assets specific to this Buyer</h4>

			<BuyerContentList
				professionId={router.query.profession ?? 0}
				role={role}
			/>
		</div>
	);
}

export default BuyerContents;
