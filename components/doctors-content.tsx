"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Phone, Mail, Star, Stethoscope } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  phone: string | null;
  email: string | null;
  bio: string | null;
  image_url: string | null;
  rating: number;
}

interface DoctorsContentProps {
  doctors: Doctor[];
}

const specialties = [
  "All",
  "Psychiatrist",
  "Clinical Psychologist",
  "Counseling Psychologist",
  "Therapist",
];

export function DoctorsContent({ doctors }: DoctorsContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  return (
    <main className="  px-4 py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-medium text-foreground">
          Find Professional Help
        </h1>
        <p className="text-muted-foreground mt-1">
          Connect with qualified mental health professionals who specialize in{" "}
          {"women's"} wellness
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, location, or specialty..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Specialty Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {specialties.map((specialty) => (
          <button
            key={specialty}
            onClick={() => setSelectedSpecialty(specialty)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedSpecialty === specialty
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            {specialty}
          </button>
        ))}
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="py-12 text-center">
            <Stethoscope className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-medium text-lg mb-1">No doctors found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                    <span className="font-serif text-xl text-primary">
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="font-serif text-lg">
                      {doctor.name}
                    </CardTitle>
                    <CardDescription className="mt-0.5">
                      {doctor.specialty}
                    </CardDescription>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {doctor.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {doctor.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {doctor.bio}
                  </p>
                )}
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">{doctor.location}</span>
                  </div>
                  {doctor.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{doctor.phone}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  {doctor.phone && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <a href={`tel:${doctor.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </a>
                    </Button>
                  )}
                  {doctor.email && (
                    <Button asChild size="sm" className="flex-1">
                      <a href={`mailto:${doctor.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <Card className="mt-8 border-0 bg-accent/10">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Note:</strong> This directory is for informational purposes.
            Please verify credentials and availability directly with the
            healthcare provider.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
