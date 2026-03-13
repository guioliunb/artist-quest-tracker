import React, { createContext, useContext, useState, useCallback } from 'react';
import { Project, Artist } from '@/types';
import { mockProject, mockArtist, mockMilestones, mockPillars } from '@/data/mockData';

interface ProjectWithArtist {
  project: Project;
  artist: Artist;
}

interface ProjectContextType {
  projects: ProjectWithArtist[];
  activeProjectId: string;
  activeProject: Project;
  activeArtist: Artist;
  setActiveProjectId: (id: string) => void;
  updateProject: (updated: Partial<Project>) => void;
  updateArtist: (updated: Partial<Artist>) => void;
  addProject: (project: Project, artist: Artist) => void;
  deleteProject: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ProjectWithArtist[]>([
    { project: { ...mockProject }, artist: { ...mockArtist } },
  ]);
  const [activeProjectId, setActiveProjectId] = useState(mockProject.id);

  const active = projects.find(p => p.project.id === activeProjectId) || projects[0];

  const updateProject = useCallback((updated: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p =>
        p.project.id === activeProjectId
          ? { ...p, project: { ...p.project, ...updated } }
          : p
      )
    );
  }, [activeProjectId]);

  const updateArtist = useCallback((updated: Partial<Artist>) => {
    setProjects(prev =>
      prev.map(p =>
        p.project.id === activeProjectId
          ? { ...p, artist: { ...p.artist, ...updated } }
          : p
      )
    );
  }, [activeProjectId]);

  const addProject = useCallback((project: Project, artist: Artist) => {
    setProjects(prev => [...prev, { project, artist }]);
    setActiveProjectId(project.id);
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => {
      const filtered = prev.filter(p => p.project.id !== id);
      if (filtered.length === 0) return prev;
      return filtered;
    });
    if (activeProjectId === id) {
      setProjects(prev => {
        if (prev.length > 0 && prev[0].project.id !== id) {
          setActiveProjectId(prev[0].project.id);
        }
        return prev;
      });
    }
  }, [activeProjectId]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProjectId,
        activeProject: active.project,
        activeArtist: active.artist,
        setActiveProjectId,
        updateProject,
        updateArtist,
        addProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}
