
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { codeExamples } from "@/lib/codeExamples";

interface ExamplesDropdownProps {
  onSelect: (code: string) => void;
}

export default function ExamplesDropdown({ onSelect }: ExamplesDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Examples</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(codeExamples).map(([name, code]) => (
          <DropdownMenuItem key={name} onClick={() => onSelect(code)}>
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
