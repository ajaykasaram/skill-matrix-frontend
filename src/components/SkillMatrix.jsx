import React, { useState, useEffect } from 'react';

const Card = ({ children, className }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="flex flex-col space-y-1.5 p-6">{children}</div>
);

const CardContent = ({ children }) => (
  <div className="p-6 pt-0">{children}</div>
);

const Button = ({ children, className, ...props }) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className, ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {children}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const DialogContent = ({ children }) => (
  <div>{children}</div>
);

const DialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

const Select = ({ value, onValueChange, children }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {children}
    </select>
  );
};

const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

const SkillMatrix = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    skillSet: '',
    level: ''
  });
  
  const [showValidation, setShowValidation] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'https://skill-matrix-api.onrender.com';
  
  const skillOptions = ['.NET', 'SQL Server', 'Salesforce'];
  const levelOptions = ['Beginner', 'Intermediate', 'Expert'];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/skills`);
      if (!response.ok) throw new Error('Failed to fetch skills');
      const data = await response.json();
      setData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load skills. Please try again later.');
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredData(null);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/skills/search?term=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error('Search failed');
      const filtered = await response.json();
      setFilteredData(filtered);
      setError(null);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Error searching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
    setShowValidation(true);
    
    if (formData.name.trim() && formData.skillSet && formData.level) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/skills`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            skillSet: formData.skillSet,
            level: formData.level
          }),
        });

        if (!response.ok) throw new Error('Failed to add record');
        
        await fetchSkills();
        setFormData({ name: '', skillSet: '', level: '' });
        setIsDialogOpen(false);
        setFilteredData(null);
        setSearchTerm('');
        setError(null);
      } catch (err) {
        setError('Failed to add record. Please try again.');
        console.error('Error adding record:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const dataToDisplay = filteredData || data;

  return (
    <Card className="w-full max-w-4xl mx-auto mt-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">SKILL MATRIX APP</h2>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
            disabled={loading}
          >
            + Add Record
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search by employee name or skill..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!e.target.value.trim()) {
                setFilteredData(null);
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="flex-grow"
            disabled={loading}
          />
          <Button 
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
            disabled={loading}
          >
            Search
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="bg-green-600 text-white p-2 text-left">Employee Name</th>
                  <th className="bg-green-600 text-white p-2 text-left">Skill Set</th>
                  <th className="bg-green-600 text-white p-2 text-left">Level</th>
                </tr>
              </thead>
              <tbody>
                {dataToDisplay.map((item, index) => (
                  <tr 
                    key={index}
                    className={index % 2 === 0 ? 'bg-green-50' : 'bg-green-100'}
                  >
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.skill_set}</td>
                    <td className="p-2">{item.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {dataToDisplay.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No records found
              </div>
            )}
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Record</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Input
                placeholder="Employee Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={showValidation && !formData.name.trim() ? 'border-red-300' : ''}
                disabled={loading}
              />
            </div>
            <div>
              <Select
                value={formData.skillSet}
                onValueChange={(value) => setFormData({ ...formData, skillSet: value })}
              >
                <option value="">Select Skill Set</option>
                {skillOptions.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
              >
                <option value="">Select Level</option>
                {levelOptions.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </Select>
            </div>
            {showValidation && (!formData.name.trim() || !formData.skillSet || !formData.level) && (
              <div className="text-red-500 text-sm">
                Please fill in all fields
              </div>
            )}
            <Button 
              onClick={handleAddRecord} 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
              disabled={loading}
            >
              Add Record
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SkillMatrix;
