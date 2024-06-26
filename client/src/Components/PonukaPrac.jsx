import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FilterBar from './FilterBar';

const PonukaPrac = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: null,
    completionStatus: null,
    priceRange: null,
    estimatedTime: null,
    dateCreated: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/jobs/incomplete', {
          params: {
            category: filters.category?.value,
            completionStatus: filters.completionStatus?.value,
            priceRange: filters.priceRange?.value,
            estimatedTime: filters.estimatedTime?.value,
            dateCreated: filters.dateCreated?.value,
          },
        });
        setJobs(response.data.jobs);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  const handleCardClick = (job) => {
    navigate(`/job/${job._id}`, { state: { job } });
  };

  const handleFilterChange = (name, selectedOption) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: selectedOption,
    }));
  };
  const handleResetFilters = () => {
    setFilters({
      category: null,
      completionStatus: null,
      priceRange: null,
      estimatedTime: null,
      dateCreated: null,
    });
  };

  if (loading) return <div className="w-full min-h-screen flex items-center justify-center">Loading...</div>;

  if (error) return <div className="w-full min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-4 bg-gray-100 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Ponuka Prác</h1>
        <FilterBar onFilterChange={handleFilterChange} onResetFilters={handleResetFilters} />
        <div className="w-full bg-white rounded-t-lg shadow">
          <div className="hidden md:grid md:grid-cols-5 gap-4 px-4 py-2 bg-gray-200 text-gray-600 font-semibold rounded-t-lg">
            <div>Názov</div>
            <div>Kategória</div>
            <div>Cena</div>
            <div>Mesto</div>
            <div>Status</div>
          </div>
          <div className="divide-y">
            {jobs.map((job) => (
              <div 
                key={job._id} 
                className="grid md:grid-cols-5 gap-4 p-4 items-center cursor-pointer hover:bg-gray-50 transition duration-300 relative"
                onClick={() => handleCardClick(job)}
              >
                <div className="md:hidden grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xl font-semibold text-gray-900">{job.title}</span>
                    <span className="text-gray-500 block">{job.category}</span>
                    <span className="text-gray-900 font-semibold">{job.price} €</span>
                  </div>
                  <div className='flex items-center'>
                    <span className="text-gray-500 block">{job.address}</span>
                    <div className="flex items-center mt-2">
                      <span 
                        className={`h-2 w-2 rounded-full mr-2 ${
                          !job.completed ? 'bg-green-800' : 'bg-yellow-800'
                        }`}
                      ></span>
                      <span 
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          !job.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {job.completed ? 'Nedostupna' : 'Dostupna'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block text-xl font-semibold text-gray-900">{job.title}</div>
                <div className="hidden md:block text-gray-500">{job.category}</div>
                <div className="hidden md:block text-gray-900 font-semibold">{job.price} €</div>
                <div className="hidden md:block text-gray-500">{job.address}</div>
                <div className="hidden md:flex items-center">
                  <span 
                    className={`h-2 w-2 rounded-full mr-2 ${
                      !job.completed ? 'bg-green-800' : 'bg-yellow-800'
                    }`}
                  ></span>
                  <span 
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      !job.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {job.completed ? 'Nedostupna' : 'Dostupna'}
                  </span>
                </div>
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl md:hidden">
                  ...
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PonukaPrac;
