import { useState } from 'react';

const Card = ({ title, variant, children, ...props }) => {
	const [isOpen, setOpen] = useState(false);

	return (
		<div className={`detail-item-list-item is-${variant} ${isOpen ? 'is-open' : ''}`} onClick={() => setOpen(!isOpen)} {...props}>
			<div className="detail-item-list-item-body">
				<h5>{title}</h5>

				{isOpen && (
					<div className="detail-item-list-item-body-content">
						{children}
					</div>
				)}
			</div>
			<div className="detail-item-list-item-icon">
				<i>
					<svg xmlns="http://www.w3.org/2000/svg" width="39.98" height="21.119" viewBox="0 0 39.98 21.119">
						<g transform="translate(39.98) rotate(90)">
							<path d="M20.793,19.193,1.933.333a1.132,1.132,0,0,0-1.6,1.6L18.389,19.989.333,38.045a1.128,1.128,0,0,0,0,1.6,1.138,1.138,0,0,0,.8.335,1.1,1.1,0,0,0,.8-.335l18.86-18.86A1.125,1.125,0,0,0,20.793,19.193Z" transform="translate(0 0)" fill="#fff"/>
						</g>
					</svg>
				</i>
			</div>
		</div>
	);
};

Card.defaultProps = {
	variant: 'default',
}

export default Card;