import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  BudgetLine,
  CalendarEvent,
  CareerPhaseHistoryEntry,
  DemandMetrics,
  EventComment,
  FinanceEntry,
  IndustryContact,
  Milestone,
  Project,
  Artist,
  QuarterlyReview,
  SocialMetricsSnapshot,
  SpotifyProfile,
} from '@/types';
import {
  mockProject,
  mockArtist,
  mockCalendarEvents,
  mockMilestones,
  mockQuarterlyReview,
  mockDemandMetrics,
  mockCareerPhaseHistory,
  mockFinanceEntries,
  mockBudgetLines,
  mockSpotifyProfile,
  mockIndustryContacts,
} from '@/data/mockData';
import { getSocialMetricsSnapshot } from '@/data/socialMetrics';

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
  addProject: (project: Project, artist: Artist, milestones?: Milestone[]) => void;
  deleteProject: (id: string) => void;
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: CalendarEvent) => void;
  updateCalendarEvent: (id: string, updated: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;
  eventComments: EventComment[];
  addEventComment: (comment: EventComment) => void;
  milestones: Milestone[];
  addMilestones: (items: Milestone[]) => void;
  quarterlyReview: QuarterlyReview;
  demandMetrics: DemandMetrics[];
  careerPhaseHistory: CareerPhaseHistoryEntry[];
  socialSnapshot: SocialMetricsSnapshot;
  financeEntries: FinanceEntry[];
  addFinanceEntry: (entry: FinanceEntry) => void;
  addFinanceEntries: (entries: FinanceEntry[]) => void;
  updateFinanceEntry: (id: string, updated: Partial<FinanceEntry>) => void;
  deleteFinanceEntry: (id: string) => void;
  budgetLines: BudgetLine[];
  spotifyProfiles: SpotifyProfile[];
  industryContacts: IndustryContact[];
  addIndustryContact: (contact: IndustryContact) => void;
  updateIndustryContact: (id: string, updated: Partial<IndustryContact>) => void;
  deleteIndustryContact: (id: string) => void;
  overrides: Record<string, string | number>;
  setOverride: (key: string, value: string | number) => void;
  clearOverride: (key: string) => void;
  isDemo: boolean;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({
  children,
  initialProjects,
  initialCalendarEvents = mockCalendarEvents,
  initialMilestones = mockMilestones,
  initialQuarterlyReview = mockQuarterlyReview,
  initialDemandMetrics = mockDemandMetrics,
  initialCareerPhaseHistory = mockCareerPhaseHistory,
  initialFinanceEntries = mockFinanceEntries,
  initialBudgetLines = mockBudgetLines,
  initialSpotifyProfiles = [mockSpotifyProfile],
  initialIndustryContacts = mockIndustryContacts,
  socialMetricsRaw,
  isDemo = false,
}: {
  children: React.ReactNode;
  initialProjects?: ProjectWithArtist[];
  initialCalendarEvents?: CalendarEvent[];
  initialMilestones?: Milestone[];
  initialQuarterlyReview?: QuarterlyReview;
  initialDemandMetrics?: DemandMetrics[];
  initialCareerPhaseHistory?: CareerPhaseHistoryEntry[];
  initialFinanceEntries?: FinanceEntry[];
  initialBudgetLines?: BudgetLine[];
  initialSpotifyProfiles?: SpotifyProfile[];
  initialIndustryContacts?: IndustryContact[];
  socialMetricsRaw?: unknown;
  isDemo?: boolean;
}) {
  const [projects, setProjects] = useState<ProjectWithArtist[]>(
    initialProjects ?? [{ project: { ...mockProject }, artist: { ...mockArtist } }],
  );
  const [activeProjectId, setActiveProjectId] = useState(projects[0].project.id);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [eventComments, setEventComments] = useState<EventComment[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>(initialFinanceEntries);
  const [budgetLines] = useState<BudgetLine[]>(initialBudgetLines);
  const [industryContacts, setIndustryContacts] = useState<IndustryContact[]>(initialIndustryContacts);
  const [overrides, setOverrides] = useState<Record<string, string | number>>({});

  const active = projects.find(p => p.project.id === activeProjectId) || projects[0];
  const socialSnapshot = useMemo(() => getSocialMetricsSnapshot(socialMetricsRaw), [socialMetricsRaw]);

  const addCalendarEvent = useCallback((event: CalendarEvent) => {
    setCalendarEvents(prev => [...prev, event]);
  }, []);

  const updateCalendarEvent = useCallback((id: string, updated: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => {
      const exists = prev.some(e => e.id === id);
      if (!exists) return prev;
      return prev.map(e => (e.id === id ? { ...e, ...updated } : e));
    });
  }, []);

  const deleteCalendarEvent = useCallback((id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const addEventComment = useCallback((comment: EventComment) => {
    setEventComments(prev => [...prev, comment]);
  }, []);

  const addMilestones = useCallback((items: Milestone[]) => {
    setMilestones(prev => [...prev, ...items]);
  }, []);

  const addFinanceEntry = useCallback((entry: FinanceEntry) => {
    setFinanceEntries(prev => [...prev, entry]);
  }, []);

  const addFinanceEntries = useCallback((entries: FinanceEntry[]) => {
    setFinanceEntries(prev => [...prev, ...entries]);
  }, []);

  const updateFinanceEntry = useCallback((id: string, updated: Partial<FinanceEntry>) => {
    setFinanceEntries(prev => prev.map(e => (e.id === id ? { ...e, ...updated } : e)));
  }, []);

  const deleteFinanceEntry = useCallback((id: string) => {
    setFinanceEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const addIndustryContact = useCallback((contact: IndustryContact) => {
    setIndustryContacts(prev => [...prev, contact]);
  }, []);

  const updateIndustryContact = useCallback((id: string, updated: Partial<IndustryContact>) => {
    setIndustryContacts(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
  }, []);

  const deleteIndustryContact = useCallback((id: string) => {
    setIndustryContacts(prev => prev.filter(c => c.id !== id));
  }, []);

  // Generic manual-override store — lets any calculated/captured value (pillar
  // review summaries, demand metrics, social metrics) be overwritten by hand.
  // Keys are caller-defined strings, conventionally `${projectId}::${namespace}::${field}`.
  const setOverride = useCallback((key: string, value: string | number) => {
    setOverrides(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearOverride = useCallback((key: string) => {
    setOverrides(prev => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

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

  const addProject = useCallback((project: Project, artist: Artist, newMilestones?: Milestone[]) => {
    setProjects(prev => [...prev, { project, artist }]);
    setActiveProjectId(project.id);
    if (newMilestones && newMilestones.length > 0) {
      setMilestones(prev => [...prev, ...newMilestones]);
    }
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
        calendarEvents,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        eventComments,
        addEventComment,
        milestones,
        addMilestones,
        quarterlyReview: initialQuarterlyReview,
        demandMetrics: initialDemandMetrics,
        careerPhaseHistory: initialCareerPhaseHistory,
        socialSnapshot,
        financeEntries,
        addFinanceEntry,
        addFinanceEntries,
        updateFinanceEntry,
        deleteFinanceEntry,
        budgetLines,
        spotifyProfiles: initialSpotifyProfiles,
        industryContacts,
        addIndustryContact,
        updateIndustryContact,
        deleteIndustryContact,
        overrides,
        setOverride,
        clearOverride,
        isDemo,
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

// Internal navigation must stay inside /demo/* while browsing the isolated demo
// dataset — every absolute Link/navigate() target should be prefixed with this.
export function useBasePath(): string {
  const { isDemo } = useProject();
  return isDemo ? '/demo' : '';
}
