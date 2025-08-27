import { useState, useMemo } from "react";
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
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from "lucide-react";

// Commit data interface
interface Commit {
  id: string;
  message: string;
  date: string;
  author: string;
  hash: string;
  branch: string;
}

// Sample data - replace with your actual data source
const sampleCommits: Commit[] = [
  {
    id: "1",
    message: "feat: add user authentication system",
    date: "2024-01-15",
    author: "John Doe",
    hash: "a1b2c3d4",
    branch: "main",
  },
  {
    id: "2",
    message: "fix: resolve login validation bug",
    date: "2024-01-14",
    author: "Jane Smith",
    hash: "e5f6g7h8",
    branch: "develop",
  },
  {
    id: "3",
    message: "docs: update API documentation",
    date: "2024-01-13",
    author: "Mike Johnson",
    hash: "i9j0k1l2",
    branch: "main",
  },
  {
    id: "4",
    message: "refactor: optimize database queries",
    date: "2024-01-12",
    author: "Sarah Wilson",
    hash: "m3n4o5p6",
    branch: "feature/optimization",
  },
  {
    id: "5",
    message: "test: add unit tests for user service",
    date: "2024-01-11",
    author: "Alex Brown",
    hash: "q7r8s9t0",
    branch: "develop",
  },
];

type SortField = keyof Commit;
type SortDirection = "asc" | "desc";

export function CommitTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort commits
  const filteredAndSortedCommits = useMemo(() => {
    let filtered = sampleCommits.filter(
      (commit) =>
        commit.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commit.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commit.hash.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [searchTerm, sortField, sortDirection]);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commit History</CardTitle>
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("message")}
                    className="h-8 flex items-center gap-1 p-0 font-medium"
                  >
                    Commit Message
                    {getSortIcon("message")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("date")}
                    className="h-8 flex items-center gap-1 p-0 font-medium"
                  >
                    Date
                    {getSortIcon("date")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("author")}
                    className="h-8 flex items-center gap-1 p-0 font-medium"
                  >
                    Author
                    {getSortIcon("author")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("hash")}
                    className="h-8 flex items-center gap-1 p-0 font-medium"
                  >
                    Hash
                    {getSortIcon("hash")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("branch")}
                    className="h-8 flex items-center gap-1 p-0 font-medium"
                  >
                    Branch
                    {getSortIcon("branch")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCommits.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    No commits found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCommits.map((commit) => (
                  <TableRow key={commit.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {commit.message}
                    </TableCell>
                    <TableCell>{commit.date}</TableCell>
                    <TableCell>{commit.author}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {commit.hash}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {commit.branch}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
                onClick={() => setCurrentPage(currentPage - 1)}
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
                      onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(currentPage + 1)}
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
