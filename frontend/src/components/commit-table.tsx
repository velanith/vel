import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  RefreshCw,
  Trash2,
  Edit,
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { type Commit } from "@/types/commit";

// API response interface
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

type SortField = keyof Commit;
type SortDirection = "asc" | "desc";

// Helper to parse JSON safely and provide clearer errors
async function parseJsonSafe<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const preview = (await response.text()).slice(0, 200);
    throw new Error(
      `API did not return JSON (content-type: ${contentType}). Preview: ${preview}`
    );
  }
  return (await response.json()) as T;
}

export function CommitTable() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Fetch commits from MongoDB
  const fetchCommits = async () => {
    try {
      setIsLoading(true);
      setError("");

      // The Vite dev proxy should forward this to your backend
      const response = await fetch("/api/commits");
      if (!response.ok) {
        const bodyText = await response.text();
        throw new Error(
          `Failed to fetch commits (${response.status}). ${bodyText}`
        );
      }
      const result = await parseJsonSafe<ApiResponse<Commit[]>>(response);

      if (result.success && result.data) {
        setCommits(result.data);
      } else {
        throw new Error(result.error || "Failed to fetch commits");
      }
    } catch (err) {
      console.error("Error fetching commits:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch commits");

      // Fallback to sample data if API fails
      setCommits([
        {
          _id: "1",
          project: "frontend",
          lifecycle: "feature",
          action: "add",
          type: "feature",
          header: "add user authentication system",
          description: "add user authentication system",
          createdAt: "2024-01-15",
        },
        {
          _id: "2",
          project: "backend",
          lifecycle: "feature",
          action: "add",
          type: "feature",
          header: "add user authentication system",
          description: "add user authentication system",
          createdAt: "2024-01-14",
        },
        {
          _id: "3",
          project: "frontend",
          lifecycle: "feature",
          action: "add",
          type: "feature",
          header: "add user authentication system",
          description: "add user authentication system",
          createdAt: "2024-01-13",
        },
        {
          _id: "4",
          project: "backend",
          lifecycle: "feature",
          action: "add",
          type: "feature",
          header: "add user authentication system",
          description: "add user authentication system",
          createdAt: "2024-01-12",
        },
        {
          _id: "5",
          project: "frontend",
          lifecycle: "feature",
          action: "add",
          type: "feature",
          header: "add user authentication system",
          description: "add user authentication system",
          createdAt: "2024-01-11",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete commit from MongoDB
  const deleteCommit = async (commitId: string) => {
    try {
      setIsDeleting(commitId);
      setError("");

      const response = await fetch(`/api/commits/${commitId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const bodyText = await response.text();
        throw new Error(
          `Failed to delete commit (${response.status}). ${bodyText}`
        );
      }
      const result = await parseJsonSafe<ApiResponse<void>>(response);

      if (result.success) {
        setCommits((prev) => prev.filter((commit) => commit._id !== commitId));
      } else {
        throw new Error(result.error || "Failed to delete commit");
      }
    } catch (err) {
      console.error("Error deleting commit:", err);
      setError(err instanceof Error ? err.message : "Failed to delete commit");
    } finally {
      setIsDeleting(null);
    }
  };

  // Update commit in MongoDB
  const updateCommit = async (
    commitId: string,
    updatedData: Partial<Commit>
  ) => {
    try {
      setError("");

      const response = await fetch(`/api/commits/${commitId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const bodyText = await response.text();
        throw new Error(
          `Failed to update commit (${response.status}). ${bodyText}`
        );
      }
      const result = await parseJsonSafe<ApiResponse<Commit>>(response);

      if (result.success && result.data) {
        setCommits((prev) =>
          prev.map((commit) =>
            commit._id === commitId ? { ...commit, ...result.data } : commit
          )
        );
      } else {
        throw new Error(result.error || "Failed to update commit");
      }
    } catch (err) {
      console.error("Error updating commit:", err);
      setError(err instanceof Error ? err.message : "Failed to update commit");
    }
  };

  // Load commits on component mount
  useEffect(() => {
    fetchCommits();
  }, []);

  // Filter and sort commits
  const filteredAndSortedCommits = useMemo(() => {
    let filtered = commits.filter(
      (commit) =>
        commit.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commit.lifecycle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commit.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commit.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commit.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commit.header.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === "asc" ? comparison : -comparison;
      }

      return 0;
    });

    return filtered;
  }, [commits, searchTerm, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCommits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCommits = filteredAndSortedCommits.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ChevronsUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Commit History</span>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCommits}
            disabled={isLoading}
            className="ml-2"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search commits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="rounded-md border overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Minimum width to ensure horizontal scroll */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("project")}
                      className="h-8 flex items-center gap-1 p-0 font-medium"
                    >
                      Project
                      {getSortIcon("project")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[100px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("createdAt")}
                      className="h-8 flex items-center gap-1 p-0 font-medium"
                    >
                      Date
                      {getSortIcon("createdAt")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[100px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("lifecycle")}
                      className="h-8 flex items-center gap-1 p-0 font-medium"
                    >
                      Lifecycle
                      {getSortIcon("lifecycle")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[100px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("action")}
                      className="h-8 flex items-center gap-1 p-0 font-medium"
                    >
                      Action
                      {getSortIcon("action")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[100px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("type")}
                      className="h-8 flex items-center gap-1 p-0 font-medium"
                    >
                      Type
                      {getSortIcon("type")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[200px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("header")}
                      className="h-8 flex items-center gap-1 p-0 font-medium"
                    >
                      Header
                      {getSortIcon("header")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[200px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("description")}
                      className="h-8 flex items-center gap-1 p-0 font-medium"
                    >
                      Description
                      {getSortIcon("description")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[120px] text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-8"
                    >
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                        Loading commits...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedCommits.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-8"
                    >
                      {searchTerm
                        ? `No commits found matching "${searchTerm}"`
                        : "No commits found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCommits.map((commit) => (
                    <TableRow key={commit._id}>
                      <TableCell className="font-medium max-w-[120px] truncate">
                        {commit.project}
                      </TableCell>
                      <TableCell className="max-w-[100px] truncate">
                        {commit.createdAt}
                      </TableCell>
                      <TableCell className="max-w-[100px] truncate">
                        {commit.lifecycle}
                      </TableCell>
                      <TableCell className="max-w-[100px] truncate">
                        {commit.action}
                      </TableCell>
                      <TableCell className="max-w-[100px] truncate">
                        {commit.type}
                      </TableCell>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={commit.header}
                      >
                        {commit.header}
                      </TableCell>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={commit.description}
                      >
                        {commit.description}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // TODO: Implement edit functionality
                              console.log("Edit commit:", commit);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCommit(commit._id!)}
                            disabled={isDeleting === commit._id}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            {isDeleting === commit._id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(
                startIndex + itemsPerPage,
                filteredAndSortedCommits.length
              )}{" "}
              of {filteredAndSortedCommits.length} commits
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Results summary */}
        <div className="text-sm text-muted-foreground mt-2">
          {filteredAndSortedCommits.length > 0 && (
            <span>
              Found {filteredAndSortedCommits.length} commit
              {filteredAndSortedCommits.length !== 1 ? "s" : ""}
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
