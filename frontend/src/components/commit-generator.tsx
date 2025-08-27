import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AlertCircle, PlusIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function CommitCard() {
  const [scopes, setScopes] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [selectedScope, setSelectedScope] = React.useState<
    string | undefined
  >();
  const [projects, setProjects] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [selectedProject, setSelectedProject] = React.useState<
    string | undefined
  >();

  const handleCreateProject = (label: string) => {
    const newProject = {
      label,
      value: label.toLowerCase().replace(/\s+/g, "-"),
    };

    setProjects((prev) => [...prev, newProject]);

    setSelectedProject(newProject.value);

    console.log("New project is being saved to the database:", newProject);
  };

  const handleCreateScope = (label: string) => {
    const newScope = {
      label,
      value: label.toLowerCase().replace(/\s+/g, "-"),
    };

    setScopes((prev) => [...prev, newScope]);

    setSelectedScope(newScope.value);

    console.log("New scope is being saved to the database:", newScope);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Commit Message Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-between gap-2 w-full">
            <div className="flex flex-row justify-between gap-2 w-fit">
              <div className="flex-1">
                <CreatableCombobox
                  label="Project"
                  labelClassName="text-sm font-bold text-amber-500"
                  options={projects}
                  value={selectedProject}
                  onChange={setSelectedProject}
                  onCreate={handleCreateProject}
                  placeholder={`...`}
                />
              </div>

              <CreatableCombobox
                label="Type"
                labelClassName="text-sm font-bold text-blue-500"
                options={scopes}
                value={selectedScope}
                onChange={setSelectedScope}
                onCreate={handleCreateScope}
                placeholder={`...`}
              />

              <CreatableCombobox
                label="Type"
                labelClassName="text-sm font-bold text-green-500"
                options={scopes}
                value={selectedScope}
                onChange={setSelectedScope}
                onCreate={handleCreateScope}
                placeholder={`...`}
              />
            </div>

            <div className="flex flex-col justify-between w-full">
              <Input
                placeholder="Give a short description..."
                className="w-full"
              />
            </div>

            <div className="flex flex-row justify-between gap-2">
              <Button variant="default" className="w-full">
                <PlusIcon className="w-4 h-4" />
                Generate Commit Message
              </Button>
            </div>

            <div className="flex flex-row justify-between gap-2">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Your session has expired. Please log in again.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
