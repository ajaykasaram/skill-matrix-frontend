// SkillMatrix.jsx
import React, { useState, useEffect } from 'react';
// ... (keep all your existing component imports)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

  const skillOptions = ['.NET', 'SQL Server', 'Salesforce'];
  const levelOptions = ['Beginner', 'Intermediate', 'Expert'];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_URL}/api/skills`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredData(null);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/skills/search?term=${encodeURIComponent(searchTerm)}`);
      const filtered = await response.json();
      setFilteredData(filtered);
    } catch (error) {
      console.error('Error searching skills:', error);
    }
  };

  const handleAddRecord = async () => {
    setShowValidation(true);
    
    if (formData.name.trim() && formData.skillSet && formData.level) {
      try {
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

        if (response.ok) {
          await fetchSkills();
          setFormData({ name: '', skillSet: '', level: '' });
          setIsDialogOpen(false);
          setFilteredData(null);
          setSearchTerm('');
        }
      } catch (error) {
        console.error('Error adding record:', error);
      }
    }
  };

  // ... (keep the rest of your existing component code)
};

export default SkillMatrix;
