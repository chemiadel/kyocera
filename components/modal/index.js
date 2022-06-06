import RModal from 'react-modal';

const Modal = ({ isOpen, onClose, title, children }) => {
	return (
		<RModal
			isOpen={isOpen}
			onRequestClose={() => onClose()}
			style={{
				content: {
					top : '50%',
					left : '50%',
					right : 'auto',
					bottom : 'auto',
					marginRight : '-50%',
					transform: 'translate(-50%, -50%)',
					width: '60%',
					maxHeight: '60%',
					padding: '60px 40px',
				}
			}}
			contentLabel="Example Modal"
		>
			<div className="modal-content">
				<h2>{title}</h2>

				{children}
			</div>
		</RModal>
	);
}

export default Modal;
