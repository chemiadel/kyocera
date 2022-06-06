import { useEffect, useState } from 'react';
import Link from 'next/link';

import IndustriesList from '@/components/industries/list';
import ProfessionsList from '@/components/professions/list';
import { useRouter } from 'next/router';
import { useGlobalState } from '@/components/global-state';
import { useAuth } from 'lib/azureAuth/authContext';

const Home = (props) => {
  const { user } = useAuth()

	const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState(null);
	const [selectedProfession, setSelectedProfession] = useState(null);
  const languageId = props.user?.language.id ? +props.user?.language.id : 0;
	
	useEffect(() => {
		setSelectedIndustry(router.query.industry);
  }, [router.query]);

  return (
    <main className="select-industry">
      <div className="container-fluid">
        <section className="select-industry">
          <div className="row no-gutters">
            <div className="col-lg-8 col-md-7">
              <div className="select-industry-body">
                <h3>Sales Toolkit</h3>
                <div className="select-industry-body-content">
                  <div className="select-industry-body-content-item">
                    <div className="select-industry-body-content-item-title">
                      <span>01</span>

                      Select your industry or market
                    </div>

                    <IndustriesList
                      onSelect={({ id }) => {
                        setSelectedIndustry(id);
                        setSelectedProfession(null);
                      }}
                      role={props.user?.role}
                      activeIndustry={selectedIndustry}
                      languageId={languageId}
                      onDelete={() => {
                        setSelectedIndustry(null);
                        setSelectedProfession(null);
                      }}
                    />
                  </div>

                  {selectedIndustry && (
                    <div className="select-industry-body-content-item">
                      <div className="select-industry-body-content-item-title">
                        <span>02</span>

                        Who is your customer contact
                      </div>

                      <ProfessionsList
                        onSelect={({ id }) => setSelectedProfession(id)}
                        role={props.user?.role}
                        activeProfession={selectedProfession}
                        activeIndustry={selectedIndustry}
                      />

                      {selectedProfession && (
                        <div style={{ marginTop: 30 }}>
                          <Link href={{
                            pathname: '/kyocera/[industry]/[profession]',
                            query: { industry: selectedIndustry, profession: selectedProfession }
                          }}>
                            <a className="btn btn-primary">Start</a>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-5">
              <div className="select-industry-image">
                <img src="/img/select-industry-img.jpg" alt="bg" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Home;
