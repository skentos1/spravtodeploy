import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FilterBar from './FilterBar';
import { useAuth } from './AuthContext';

const PonukaPrac = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: null,
    priceRange: null,
    estimatedTime: null,
    city: '',
    district: '',
    dateCreated: 'newest',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/jobs/incomplete`, {
          params: {
            category: filters.category,
            priceRange: filters.priceRange,
            estimatedTime: filters.estimatedTime,
            city: typeof filters.city === 'object' ? filters.city.city : filters.city,
            district: filters.district,
            dateCreated: filters.dateCreated,
            page,
            limit: 11,
          },
        });

        const jobsWithStatus = response.data.jobs.map(job => ({
          ...job,
          status: job.userConfirmed ? 'Moja Práca' : (job.isJobConfirmed ? 'Nedostupná' : 'Dostupná')
        }));

        setJobs(jobsWithStatus);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters, page]);

  const handleCardClick = (job) => {
    navigate(`/job/${job._id}`, { state: { job } });
  };

  const handleFilterChange = (name, selectedOption) => {
    let value = selectedOption;
    if (name === 'city' && typeof selectedOption === 'object') {
      value = selectedOption.city;
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value || '',
    }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      category: null,
      priceRange: null,
      estimatedTime: null,
      city: '',
      district: '',
      dateCreated: 'newest',
    });
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) return <div className="w-full min-h-screen flex items-center justify-center">Loading...</div>;

  if (error) return <div className="w-full min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  const renderActiveFilters = () => {
    const activeFilters = [];
    if (filters.category) activeFilters.push(`Kategória: ${filters.category}`);
    if (filters.priceRange) activeFilters.push(`Cena: ${filters.priceRange}€`);
    if (filters.estimatedTime) activeFilters.push(`Čas: ${filters.estimatedTime}h`);
    if (filters.city) activeFilters.push(`Mesto: ${filters.city}`);
    if (filters.district) activeFilters.push(`Okres: ${filters.district}`);

    return activeFilters.length > 0 ? (
      <div className="mt-4 bg-gray-100 p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-2">Aktívne filtre:</h2>
        <ul className="list-disc list-inside">
          {activeFilters.map((filter, index) => (
            <li key={index} className="text-gray-700">{filter}</li>
          ))}
        </ul>
      </div>
    ) : null;
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-4 bg-gray-100 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Ponuka Prác</h1>
        <FilterBar onFilterChange={handleFilterChange} onResetFilters={handleResetFilters} />
        {renderActiveFilters()}
        <div className="w-full bg-white rounded-t-lg shadow mt-6">
          <div className="hidden md:grid md:grid-cols-7 gap-4 px-4 py-2 bg-gray-200 text-gray-600 font-semibold rounded-t-lg">
            <div>Názov</div>
            <div>Kategória</div>
            <div>Cena</div>
            <div>Mesto</div>
            <div>Okres</div>
            <div>Čas</div>
            <div>Status</div>
          </div>
          <div className="md:hidden grid grid-cols-2 gap-4 px-4 py-2 bg-gray-200 text-gray-600 font-semibold rounded-t-lg">
            <div>Názov, Kategória, Cena</div>
            <div>Mesto, Okres, Status</div>
          </div>
          <div className="divide-y">
            {jobs.map((job) => (
              <div 
                key={job._id} 
                className={`grid md:grid-cols-7 gap-4 p-4 items-center cursor-pointer transition duration-300 relative ${
                  job.status === 'Moja Práca' ? 'bg-green-100' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleCardClick(job)}
              >
                <div className="md:hidden grid grid-cols-2 gap-4 p-4 bg-white rounded-lg shadow mb-4">
                  <div className="col-span-1 space-y-1">
                    <div className="text-lg font-semibold text-gray-900">{job.title}</div>
                    <div className="text-sm text-gray-500">{job.category}</div>
                    <div className="text-lg font-semibold text-gray-900">{job.price} €</div>
                  </div>
                  <div className="col-span-1 space-y-1">
                    <div className="text-lg text-gray-500 font-semibold">{job.city}</div>
                    <div className="text-sm text-gray-500">{job.district}</div>
                    <div className="flex items-center mt-2">
                      <span
                        className={`h-2 w-2 rounded-full mr-2 ${
                          job.status === 'Moja Práca' ? 'bg-green-800' : (job.status === 'Nedostupná' ? 'bg-yellow-800' : 'bg-green-800')
                        }`}
                      ></span>
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          job.status === 'Moja Práca' ? 'bg-green-100 text-green-800' : (job.status === 'Nedostupná' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800')
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block text-xl font-semibold text-gray-900">{job.title}</div>
                <div className="hidden md:block text-gray-500">{job.category}</div>
                <div className="hidden md:block text-gray-900 font-semibold">{job.price} €</div>
                <div className="hidden md:block text-gray-500">{job.city}</div>
                <div className="hidden md:block text-gray-500">{job.district}</div>
                <div className="hidden md:block text-gray-500">{job.estimatedTime} h</div>
                <div className="hidden md:flex items-center">
                  <span
                    className={`h-2 w-2 rounded-full mr-2 ${
                      job.status === 'Moja Práca' ? 'bg-green-800' : (job.status === 'Nedostupná' ? 'bg-red-800' : 'bg-green-800')
                    }`}
                  ></span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      job.status === 'Moja Práca' ? 'bg-green-100 text-green-800' : (job.status === 'Nedostupná' ? 'bg-red-100 text-yellow-800' : 'bg-green-100 text-green-800')
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2">{page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PonukaPrac;
