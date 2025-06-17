"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDevelopers } from "@/lib/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Developer } from "@/types";

export default function DevelopersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const developersPerPage = 6;

  const {
    data: developers = [] as Developer[],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["developers"],
    queryFn: fetchDevelopers,
  });

  // Get all unique skills
  const allSkills = Array.from(
    new Set(developers.flatMap((dev: Developer) => dev.skills))
  ).sort();

  // Filter developers based on search query and selected skill
  const filteredDevelopers = developers.filter((dev: Developer) => {
    const matchesSearch =
      searchQuery === "" ||
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkill =
      selectedSkill === "all" || dev.skills.includes(selectedSkill);

    return matchesSearch && matchesSkill;
  });

  // Paginate developers
  const indexOfLastDeveloper = currentPage * developersPerPage;
  const indexOfFirstDeveloper = indexOfLastDeveloper - developersPerPage;
  const currentDevelopers = filteredDevelopers.slice(
    indexOfFirstDeveloper,
    indexOfLastDeveloper
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <div className="text-center py-12">Loading developers...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load developers.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Developer Directory</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search developers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Select
          value={selectedSkill}
          onValueChange={(value) => {
            setSelectedSkill(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Skills</SelectItem>{" "}
            {/* Updated value prop */}
            {(allSkills as string[]).map((skill) => (
              <SelectItem key={skill} value={skill}>
                {skill}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {currentDevelopers.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">No developers found</h2>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDevelopers.map((developer: Developer) => (
              <div
                key={developer.id}
                className="transition-transform hover:scale-[1.02]"
              >
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={developer.avatar || ""}
                        alt={developer.name}
                      />
                      <AvatarFallback>
                        {developer.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">{developer.name}</h2>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {developer.bio}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex flex-wrap gap-2">
                      {developer.skills.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      {developer.skills.length > 3 && (
                        <Badge variant="outline">
                          +{developer.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filteredDevelopers.length > developersPerPage && (
            <div className="flex justify-center mt-8">
              <nav>
                <ul className="flex space-x-2">
                  {Array.from(
                    {
                      length: Math.ceil(
                        filteredDevelopers.length / developersPerPage
                      ),
                    },
                    (_, i) => i + 1
                  ).map((number) => (
                    <li key={number}>
                      <Button
                        variant={currentPage === number ? "default" : "outline"}
                        size="sm"
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
