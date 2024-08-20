import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const projects = [
  {
    title: "Enhance Veterans Memorial Park for Events and Community Use",
    description: "Create signature performance structure, relocate and enhance memorial, and improve access and circulation through the park",
    nyfRequest: 1700000
  },
  {
    title: "Create a sense of place through Streetscape Enhancements on Main Street",
    description: "Enhance crosswalks, lighting, and sidewalks on Main Street from Corning Park to Kircher Park",
    nyfRequest: 1300000
  },
  {
    title: "Create a Celebration Plaza and Village Market Square",
    description: "Transform entry drive into Celebration Plaza adjacent to Village Office that acts as a public gathering space and gateway to flexible open space for markets and events.",
    nyfRequest: 1125000
  },
  {
    title: "Establish Harmony Square on Main Street",
    description: "Create a flexible open space adjacent to Harmony House that incorporates public art and ties in to a connected network of public spaces",
    nyfRequest: 325000
  },
  {
    title: "Create a Hojack Trail Gateway and Enhance the Trail",
    description: "Add amenities and enhance the crossing at North Avenue; pave the trail from Phillips Road to western Village boundary and add lighting, landscaping, and benches",
    nyfRequest: 2052000
  }
];

const criteria = [
  { name: 'Level of Impact', weight: 1 },
  { name: 'Benefits to the Community', weight: 1 },
  { name: 'Cost-Effectiveness', weight: 1 },
  { name: 'Readiness', weight: 1 },
  { name: 'Improving Connectivity', weight: 0.2 },
  { name: 'Beautifying Downtown', weight: 0.2 },
  { name: 'Supporting Events and Programming', weight: 0.2 },
  { name: 'Enhancing Quality of Life for All', weight: 0.2 },
  { name: 'Promoting Sustainability', weight: 0.2 }
];

const ProjectEvaluationApp = () => {
  const [step, setStep] = useState(1);
  const [currentProject, setCurrentProject] = useState(0);
  const [evaluations, setEvaluations] = useState(
    projects.map(() => criteria.reduce((acc, criterion) => ({ ...acc, [criterion.name]: '' }), {}))
  );
  const [projectScores, setProjectScores] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (step === 2) {
      const scores = evaluations.map(evaluation => {
        return criteria.reduce((total, criterion) => {
          const score = evaluation[criterion.name] === 'High' ? 3 : evaluation[criterion.name] === 'Medium' ? 2 : 1;
          return total + score * criterion.weight;
        }, 0);
      });
      const categorizedScores = scores.map(score => {
        if (score >= 11) return 'High';
        if (score >= 6) return 'Medium';
        return 'Low';
      });
      setProjectScores(categorizedScores);
    }
  }, [step, evaluations]);

  const handleEvaluation = (criterion, value) => {
    setEvaluations(prevEvaluations => {
      const newEvaluations = [...prevEvaluations];
      newEvaluations[currentProject] = { ...newEvaluations[currentProject], [criterion]: value };
      return newEvaluations;
    });
  };

  const handleNextProject = () => {
    if (currentProject < projects.length - 1) {
      setCurrentProject(currentProject + 1);
    } else {
      setStep(2);
    }
  };

  const handlePreviousProject = () => {
    if (currentProject > 0) {
      setCurrentProject(currentProject - 1);
    }
  };

  const isProjectEvaluationComplete = () => {
    return Object.values(evaluations[currentProject]).every(value => value !== '');
  };

  const handleProjectSelection = (index) => {
    setSelectedProjects(prev => {
      const newSelection = [...prev];
      newSelection[index] = !newSelection[index];
      return newSelection;
    });
  };

  const getTotalNYFRequest = () => {
    return selectedProjects.reduce((total, isSelected, index) => {
      return isSelected ? total + projects[index].nyfRequest : total;
    }, 0);
  };

  const isSubmitDisabled = () => {
    const total = getTotalNYFRequest();
    return total < 6000000 || total > 8000000 || !userName || !userEmail;
  };

  const renderStep1 = () => (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Step 1: Project Evaluation</h1>
      <h2 className="text-xl font-semibold mb-2">{projects[currentProject].title}</h2>
      <p className="text-sm mb-2">{projects[currentProject].description}</p>
      <p className="text-sm mb-4">NYF Request: ${projects[currentProject].nyfRequest.toLocaleString()}</p>
      {criteria.map(criterion => (
        <div key={criterion.name} className="mb-4">
          <label className="block mb-2">{criterion.name}</label>
          <Select 
            onValueChange={(value) => handleEvaluation(criterion.name, value)}
            value={evaluations[currentProject][criterion.name]}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
      <div className="flex justify-end mt-4">
        {currentProject > 0 && (
          <Button onClick={handlePreviousProject} className="mr-4">Previous Project</Button>
        )}
        <Button 
          onClick={handleNextProject} 
          disabled={!isProjectEvaluationComplete()}
          className={!isProjectEvaluationComplete() ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {currentProject < projects.length - 1 ? 'Next Project' : 'Finish Evaluation'}
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Step 2: Project Selection</h1>
      {projects.map((project, index) => (
        <Card key={index} className="mb-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <div className="flex items-center">
                <span className="mr-4">NYF Request: ${project.nyfRequest.toLocaleString()}</span>
                <Checkbox
                  checked={selectedProjects[index]}
                  onCheckedChange={() => handleProjectSelection(index)}
                />
                <span className="ml-2">Fund this Project</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p>{project.description}</p>
            <div className={`mt-2 p-2 rounded-lg inline-block ${
              projectScores[index] === 'High' ? 'bg-green-200' :
              projectScores[index] === 'Medium' ? 'bg-yellow-200' : 'bg-red-200'
            }`}>
              Your Ranking: {projectScores[index]}
            </div>
          </CardContent>
        </Card>
      ))}
      <div className={`p-4 rounded-lg mb-4 ${
        getTotalNYFRequest() < 6000000 || getTotalNYFRequest() > 8000000 ? 'bg-red-200' : 'bg-green-200'
      }`}>
        <h3 className="font-bold">Total NY Forward Request: ${getTotalNYFRequest().toLocaleString()}</h3>
        {(getTotalNYFRequest() < 6000000 || getTotalNYFRequest() > 8000000) && (
          <p className="text-red-600 mt-2">The Total NY Forward Request should be between $6,000,000 to $8,000,000.</p>
        )}
      </div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Input
          type="email"
          placeholder="Your Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
      </div>
      <Button
        onClick={() => alert('Submission successful!')}
        disabled={isSubmitDisabled()}
        className={isSubmitDisabled() ? 'opacity-50 cursor-not-allowed' : ''}
      >
        Submit
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto">
      {step === 1 ? renderStep1() : renderStep2()}
    </div>
  );
};

export default ProjectEvaluationApp;
