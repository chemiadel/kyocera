import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

import IndustriesList from '@/components/industries/list';
import ProfessionsList from '@/components/professions/list';
import { useAuth } from 'lib/azureAuth/authContext';
const Home = () => {
  const { user, loading } = useAuth()

  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedProfession, setSelectedProfession] = useState(null);

  if(loading) return null
  if(!user) return null
  
  const languageId = user?.language.id ? +user?.language.id : 0;

  return (
    <main className="select-industry">
      <Head>
        <title>Kyocera Sales Toolkit</title>
      </Head>
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
                      role={user?.role}
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
                        role={user?.role}
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
