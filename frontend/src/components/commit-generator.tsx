import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AlertCircle, PlusIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { type Option } from "@/types";

export function CommitCard() {
  // State variables for form fields
  const [selectedProject, setSelectedProject] = React.useState<string>("");
  const [selectedLifecycle, setSelectedLifecycle] = React.useState<string>("");
  const [selectedAction, setSelectedAction] = React.useState<string>("");
  const [selectedType, setSelectedType] = React.useState<string>("");
  const [selectedHeader, setSelectedHeader] = React.useState<string>("");
  const [shortDescription, setShortDescription] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  // Data arrays for dropdown options
  const [projects, setProjects] = React.useState<Option[]>([]);
  const [lifecycle, setLifecycle] = React.useState<Option[]>([]);
  const [action, setAction] = React.useState<Option[]>([]);
  const [type, setType] = React.useState<Option[]>([]);
  const [header, setHeader] = React.useState<Option[]>([]);
  // Helper function to convert string to Option
  const createOption = (value: string): Option => ({
    value,
    label: value,
  });

  // Handler functions for creating new options
  const handleCreateProject = async (newProject: string) => {
    try {
      // TODO: Add API call to save new project to MongoDB
      // const response = await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name: newProject })
      // });

      const newOption = createOption(newProject);
      setProjects((prev) => [...prev, newOption]);
      setSelectedProject(newProject);
    } catch (err) {
      setError("Failed to create new project");
    }
  };

  const handleCreateLifecycle = async (newLifecycle: string) => {
    try {
      // TODO: Add API call to save new lifecycle to MongoDB
      const newOption = createOption(newLifecycle);
      setLifecycle((prev) => [...prev, newOption]);
      setSelectedLifecycle(newLifecycle);
    } catch (err) {
      setError("Failed to create new lifecycle");
    }
  };

  const handleCreateAction = async (newAction: string) => {
    try {
      // TODO: Add API call to save new action to MongoDB
      const newOption = createOption(newAction);
      setAction((prev) => [...prev, newOption]);
      setSelectedAction(newAction);
    } catch (err) {
      setError("Failed to create new action");
    }
  };

  const handleCreateType = async (newType: string) => {
    try {
      // TODO: Add API call to save new type to MongoDB
      const newOption = createOption(newType);
      setType((prev) => [...prev, newOption]);
      setSelectedType(newType);
    } catch (err) {
      setError("Failed to create new type");
    }
  };

  const handleCreateHeader = async (newHeader: string) => {
    try {
      // TODO: Add API call to save new header to MongoDB
      const newOption = createOption(newHeader);
      setHeader((prev) => [...prev, newOption]);
      setSelectedHeader(newHeader);
    } catch (err) {
      setError("Failed to create new header");
    }
  };

  // Load initial data from MongoDB
  React.useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        // TODO: Add API calls to fetch data from MongoDB
        // const [projectsRes, lifecycleRes, actionRes, typeRes, descriptionRes] = await Promise.all([
        //   fetch('/api/projects'),
        //   fetch('/api/lifecycle'),
        //   fetch('/api/action'),
        //   fetch('/api/type'),
        //   fetch('/api/description')
        //   fetch('/api/header')
        // ]);

        // For now, using sample data converted to Option format
        setProjects(
          ["Frontend", "Backend", "Mobile App", "API"].map(createOption)
        );
        setLifecycle(
          ["Development", "Testing", "Staging", "Production"].map(createOption)
        );
        setAction(
          ["Add", "Update", "Fix", "Remove", "Refactor"].map(createOption)
        );
        setType(
          ["Feature", "Bug", "Hotfix", "Documentation", "Style"].map(
            createOption
          )
        );
      } catch (err) {
        setError("Failed to load initial data");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Generate commit message
  const handleGenerateCommit = async () => {
    if (
      !selectedProject ||
      !selectedLifecycle ||
      !selectedAction ||
      !selectedType ||
      !shortDescription
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // TODO: Add API call to generate commit message using MongoDB data
      // const response = await fetch('/api/generate-commit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     project: selectedProject,
      //     lifecycle: selectedLifecycle,
      //     action: selectedAction,
      //     type: selectedType,
      //     description: shortDescription
      //   })
      // });

      // For now, just show a success message
      console.log("Commit message generated successfully");
    } catch (err) {
      setError("Failed to generate commit message");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error when user starts typing
  const handleInputChange = (value: string) => {
    setShortDescription(value);
    if (error) setError("");
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Commit Message Generator</CardTitle>
        </CardHeader>
        {/* projects*/}
        <CardContent>
          <div className="flex flex-col justify-between gap-2 w-full">
            <div className="flex flex-row justify-between gap-2 w-fit">
              <CreatableCombobox
                label="Project"
                labelClassName="text-sm font-bold text-amber-500"
                options={projects}
                value={selectedProject}
                onChange={setSelectedProject}
                onCreate={handleCreateProject}
                placeholder={`...`}
              />
              {/* lifecycle */}
              <CreatableCombobox
                label="Lifecycle"
                labelClassName="text-sm font-bold text-blue-500"
                options={lifecycle}
                value={selectedLifecycle}
                onChange={setSelectedLifecycle}
                onCreate={handleCreateLifecycle}
                placeholder={`...`}
              />
              {/* action */}
              <CreatableCombobox
                label="Action"
                labelClassName="text-sm font-bold text-green-500"
                options={action}
                value={selectedAction}
                onChange={setSelectedAction}
                onCreate={handleCreateAction}
                placeholder={`...`}
              />
              {/* type */}
              <CreatableCombobox
                label="Type"
                labelClassName="text-sm font-bold text-red-500"
                options={type}
                value={selectedType}
                onChange={setSelectedType}
                onCreate={handleCreateType}
                placeholder={`...`}
              />
              {/* header */}
              <CreatableCombobox
                label="Header"
                labelClassName="text-sm font-bold text-yellow-500"
                options={header}
                value={selectedHeader}
                onChange={setSelectedHeader}
                onCreate={handleCreateHeader}
                placeholder={`...`}
              />
            </div>

            <div className="flex flex-col justify-between w-full">
              <Input
                placeholder="Give a short description..."
                className="w-full"
                value={shortDescription}
                onChange={(e) => handleInputChange(e.target.value)}
              />
            </div>
            <div className="flex flex-row justify-between gap-2">
              <Button
                variant="default"
                className="w-full"
                onClick={handleGenerateCommit}
                disabled={isLoading}
              >
                <PlusIcon className="w-4 h-4" />
                {isLoading ? "Generating..." : "Generate Commit Message"}
              </Button>
            </div>

            {error && (
              <div className="flex flex-row justify-between gap-2">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
