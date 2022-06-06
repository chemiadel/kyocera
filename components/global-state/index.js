import { useReducer, useContext, createContext, useEffect } from 'react';

const GlobalStateContext = createContext();
const GlobalStateDispatchContext = createContext();

const reducer = (state, action) => {
	switch (action.type) {
		case 'CREATE_INDUSTRY_MODAL_IS_OPEN':
			return {
				...state,
				createIndustryModalIsOpen: action.payload,
			};
		case 'DELETE_INDUSTRY_MODAL_IS_OPEN':
			return {
				...state,
				deleteIndustryModalIsOpen: action.payload,
			};
		case 'UPDATE_INDUSTRY_MODAL_IS_OPEN':
			return {
				...state,
				updateIndustryModalIsOpen: action.payload,
			};
		
		case 'CREATE_PROFESSION_MODAL_IS_OPEN':
			return {
				...state,
				createProfessionModalIsOpen: action.payload,
			};
		case 'DELETE_PROFESSION_MODAL_IS_OPEN':
			return {
				...state,
				deleteProfessionModalIsOpen: action.payload,
			};
		case 'UPDATE_PROFESSION_MODAL_IS_OPEN':
			return {
				...state,
				updateProfessionModalIsOpen: action.payload,
			};
		
		case 'CREATE_SALES_MODAL_IS_OPEN':
			return {
				...state,
				createSalesModalIsOpen: action.payload,
			};
		case 'DELETE_SALES_MODAL_IS_OPEN':
			return {
				...state,
				deleteSalesModalIsOpen: action.payload,
			};
		case 'UPDATE_SALES_MODAL_IS_OPEN':
			return {
				...state,
				updateSalesModalIsOpen: action.payload,
			};

		case 'CREATE_BUYER_CONTENT_MODAL_IS_OPEN':
			return {
				...state,
				createBuyerContentModalIsOpen: action.payload,
			};
		case 'DELETE_BUYER_CONTENT_MODAL_IS_OPEN':
			return {
				...state,
				deleteBuyerContentModalIsOpen: action.payload,
			};
		case 'UPDATE_BUYER_CONTENT_MODAL_IS_OPEN':
			return {
				...state,
				updateBuyerContentModalIsOpen: action.payload,
			};
	
		case 'CREATE_SALES_CARD_MODAL_IS_OPEN':
			return {
				...state,
				createSalesCardModalIsOpen: action.payload,
			};
		case 'DELETE_SALES_CARD_MODAL_IS_OPEN':
			return {
				...state,
				deleteSalesCardModalIsOpen: action.payload,
			};
		case 'UPDATE_SALES_CARD_MODAL_IS_OPEN':
			return {
				...state,
				updateSalesCardModalIsOpen: action.payload,
			};
	
		case 'CREATE_CASES_MODAL_IS_OPEN':
			return {
				...state,
				createCasesModalIsOpen: action.payload,
			};
		case 'DELETE_CASES_MODAL_IS_OPEN':
			return {
				...state,
				deleteCasesModalIsOpen: action.payload,
			};
		case 'UPDATE_CASES_MODAL_IS_OPEN':
			return {
				...state,
				updateCasesModalIsOpen: action.payload,
			};
    
		case 'CREATE_CASES_CARD_MODAL_IS_OPEN':
			return {
				...state,
				createCasesCardModalIsOpen: action.payload,
			};
		case 'DELETE_CASES_CARD_MODAL_IS_OPEN':
			return {
				...state,
				deleteCasesCardModalIsOpen: action.payload,
			};
		case 'UPDATE_CASES_CARD_MODAL_IS_OPEN':
			return {
				...state,
				updateCasesCardModalIsOpen: action.payload,
			};
	
		case 'CREATE_CHALLENGE_MODAL_IS_OPEN':
			return {
				...state,
				createChallengeModalIsOpen: action.payload,
			};
		case 'DELETE_CHALLENGE_MODAL_IS_OPEN':
			return {
				...state,
				deleteChallengeModalIsOpen: action.payload,
			};
		case 'UPDATE_CHALLENGE_MODAL_IS_OPEN':
			return {
				...state,
				updateChallengeModalIsOpen: action.payload,
			};
	
		case 'CREATE_PAIN_MODAL_IS_OPEN':
			return {
				...state,
				createPainModalIsOpen: action.payload,
			};
		case 'DELETE_PAIN_MODAL_IS_OPEN':
			return {
				...state,
				deletePainModalIsOpen: action.payload,
			};
		case 'UPDATE_PAIN_MODAL_IS_OPEN':
			return {
				...state,
				updatePainModalIsOpen: action.payload,
			};
	
		case 'CREATE_NEED_MODAL_IS_OPEN':
			return {
				...state,
				createNeedModalIsOpen: action.payload,
			};
		case 'DELETE_NEED_MODAL_IS_OPEN':
			return {
				...state,
				deleteNeedModalIsOpen: action.payload,
			};
		case 'UPDATE_NEED_MODAL_IS_OPEN':
			return {
				...state,
				updateNeedModalIsOpen: action.payload,
			};
	
		case 'CHANGE_LANGUAGE':
			return {
				...state,
				language: action.payload,
			};
		
		default:
			throw new Error(`Unknown action: ${action.type}`)
	}
};

export const GlobalStateProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, {
		createIndustryModalIsOpen: false,
		updateIndustryModalIsOpen: false,
		deleteIndustryModalIsOpen: false,

		createProfessionModalIsOpen: false,
		updateProfessionModalIsOpen: false,
		deleteProfessionModalIsOpen: false,

		createSalesModalIsOpen: false,
		updateSalesModalIsOpen: false,
		deleteSalesModalIsOpen: false,

		createSalesCardModalIsOpen: false,
		updateSalesCardModalIsOpen: false,
		deleteSalesCardModalIsOpen: false,

		createBuyerContentModalIsOpen: false,
		updateBuyerContentModalIsOpen: false,
		deleteBuyerContentModalIsOpen: false,

		createCasesModalIsOpen: false,
		updateCasesModalIsOpen: false,
		deleteCasesModalIsOpen: false,

		createChallengeModalIsOpen: false,
		updateChallengeModalIsOpen: false,
		deleteChallengeModalIsOpen: false,

		createPainModalIsOpen: false,
		updatePainModalIsOpen: false,
		deletePainModalIsOpen: false,

		createNeedModalIsOpen: false,
		updateNeedModalIsOpen: false,
		deleteNeedModalIsOpen: false,
	});
	
  return (
    <GlobalStateDispatchContext.Provider value={dispatch}>
      <GlobalStateContext.Provider value={state}>
        {children}
      </GlobalStateContext.Provider>
    </GlobalStateDispatchContext.Provider>
  )
}

export const useGlobalState = () => useContext(GlobalStateContext);
export const useDispatchGlobalState = () => useContext(GlobalStateDispatchContext);