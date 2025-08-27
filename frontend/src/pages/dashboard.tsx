import { CommitCard } from "@/components/commit-generator";
import { CommitTable } from "@/components/commit-table";
import { NavMenu } from "@/components/nav-menu";

export function Dashboard() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-4">
        <NavMenu />
        <CommitCard />
        <CommitTable />
      </div>
    </div>
  );
}
