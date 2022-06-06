import { gql } from '@apollo/client';

export const FIND_INDUSTRIES_QUERY = gql`
	query findIndustries($languageId: ID!) {
		findIndustries( filter: { languageId: { eq: $languageId }, deleted: { ne: true } }, orderBy: { field: "id", order: ASC } ) {
			items {
				id
				name
				
				language {
					id
					name
				}

				professions( filter: { deleted: { ne: true } } ) {
					id
					name
				}
			}
		}
	}
`;

export const FIND_PROFESSIONS_QUERY = gql`
	query allProfessions($industryId: ID!) {
		findProfessions(filter: { industryId: { eq: $industryId }, deleted: { ne: true } }, orderBy: { field: "id", order: ASC }) {
			items {
				id
				name
			}
		}
	}
`;

export const FIND_JOURNEYS_QUERY = gql`
	query findJourneys($industryId: ID!, $professionId: ID!, $languageId: ID!) {
		findIndustries( filter: { id: { eq: $industryId }, languageId: { eq: $languageId }, deleted: { ne: true } }, orderBy: { field: "id", order: ASC } ) {
			items {
				id

				professions( filter: { id: { eq: $professionId } } ) {
					id

					challenges( filter: { deleted: { ne: true } } ) {
						id
						title
						content
						position
						file
						fileName
						fileArray
				
						pains( filter: { deleted: { ne: true } } ) {
							id
							title
							content
							position
							file
							fileName
							fileArray
							challenge {
								id
							}
				
							needs( filter: { deleted: { ne: true } } ) {
								id
								title
								content
								position
								file
								fileName
								fileArray
								pain {
									id
								}
							}
						}
					}
				}
			}
		}
	}
`;

export const FIND_SALES_QUERY = gql`
	query allSales($industryId: ID!) {
		findSales(filter: { industryId: { eq: $industryId }, deleted: { ne: true } }, orderBy: { field: "id", order: ASC }) {
			items {
				id
				name
				firstAsset
				secondAsset

				cards(filter: { deleted: { ne: true } }) {
					id
					title
					position
					content
					file
					fileName
					fileArray
				}
			}
		}
	}
`;

export const FIND_BUYER_CONTENTS_QUERY = gql`
	query allBuyerContents($professionId: ID!) {
		findBuyerContents(filter: { professionId: { eq: $professionId }, deleted: { ne: true } }, orderBy: { field: "id", order: ASC }) {
			items {
				id
				title
				position
				content
				file
				fileName
				fileArray
			}
		}
	}
`;

export const FIND_CASES_QUERY = gql`
	query allCases($industryId: ID!) {
		findCases(filter: { industryId: { eq: $industryId }, deleted: { ne: true } }, orderBy: { field: "id", order: ASC }) {
			items {
				id
				name

				cards(filter: { deleted: { ne: true } }) {
					id
					title
					position
					content
					file
					fileName
					fileArray
				}
			}
		}
	}
`;

export const FIND_LANGUAGES_QUERY = gql`
	query findLanguages {
		findLangs(orderBy: { field: "id", order: ASC }) {
			items {
				id
				name
				title
				statement
			}
		}
	}
`;

export const FIND_AD_TENANTS = gql`
	query {
	    findAdTenants {
	        items {
				id,
	            country_code,
	            country_name,
	            cid,
	            auth
            }
        }
    }
`;
