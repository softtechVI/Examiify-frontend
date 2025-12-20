import React, { useState, useEffect } from 'react';
import InsideHeader from "../components/InsideHeader";
import Footer from "../components/Footer";
import useSessionStore from '../store/userSession';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Subject = {
  id: string;
  name: string;
  code: string;
};

type ClassData = {
  id: string;
  className?: string;
  section?: string;
  degree?: string;
  semester?: string;
  subjects: Subject[];
  capacity: number;
  role: string;
};

const ClassManager: React.FC = () => {
  const [instituteType, setInstituteType] = useState<number | null>(null);
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [degree, setDegree] = useState('');
  const [semester, setSemester] = useState('');
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [subjectInputs, setSubjectInputs] = useState<Record<string, { name: string; code: string }>>({});
  const user = useSessionStore.getState().user;

  useEffect(() => {
    const type = user?.institutionType;
    setInstituteType(type ? Number(type) : null);
  }, []);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleAddClass = () => {
    let newEntry: ClassData | null = null;

    if (instituteType === 1 && className && section) {
      newEntry = {
        id: `${Date.now()}`,
        className,
        section,
        subjects: [],
        capacity: 20,
        role: 'Admin',
      };
      setClassName('');
      setSection('');
      toast.success('Class added successfully!');
    } else if (instituteType === 2 && degree && semester) {
      newEntry = {
        id: `${Date.now()}`,
        degree,
        semester,
        subjects: [],
        capacity: 30,
        role: 'Admin',
      };
      setDegree('');
      setSemester('');
      toast.success('Degree added successfully!');
    }

    if (newEntry) {
      setClasses([...classes, newEntry]);
    }
  };

  const handleAddSubject = (classId: string) => {
    const subjectName = subjectInputs[classId]?.name?.trim();
    const subjectCode = subjectInputs[classId]?.code?.trim();
    
    if (!subjectName || !subjectCode) {
      toast.error('Please enter both subject name and code');
      return;
    }

    setClasses(classes.map(cls => {
      if (cls.id === classId) {
        return {
          ...cls,
          subjects: [...cls.subjects, { id: `${Date.now()}`, name: subjectName, code: subjectCode }]
        };
      }
      return cls;
    }));

    setSubjectInputs({ ...subjectInputs, [classId]: { name: '', code: '' } });
    toast.success('Subject added successfully!');
  };

  const handleDeleteClass = (classId: string) => {
    setClasses(classes.filter(cls => cls.id !== classId));
    toast.success('Deleted successfully!');
  };

  const handleDeleteSubject = (classId: string, subjectId: string) => {
    setClasses(classes.map(cls => {
      if (cls.id === classId) {
        return {
          ...cls,
          subjects: cls.subjects.filter(sub => sub.id !== subjectId)
        };
      }
      return cls;
    }));
    toast.success('Subject deleted successfully!');
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-2xl font-bold text-secondary mb-6">
              Enter {instituteType === 1 ? 'Class' : 'Degree'} Details
            </h2>

            <div className="flex flex-wrap gap-4 mb-8">
              {instituteType === 1 ? (
                <>
                  <Input
                    type="text"
                    placeholder="Enter Class (e.g., Grade 10)"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-64"
                  />
                  <Input
                    type="text"
                    placeholder="Enter Section (e.g., A)"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-64"
                  />
                </>
              ) : instituteType === 2 ? (
                <>
                  <Input
                    type="text"
                    placeholder="Enter Degree (e.g., B.Sc CS)"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-64"
                  />
                  <Input
                    type="text"
                    placeholder="Enter Semester (e.g., 3rd)"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-64"
                  />
                </>
              ) : (
                <p className="text-destructive">Invalid or missing institute type</p>
              )}

              <Button onClick={handleAddClass} className="gap-2">
                <Plus className="h-4 w-4" />
                Add {instituteType === 1 ? 'Class' : 'Degree'}
              </Button>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-secondary mb-4">
                Manage {instituteType === 1 ? 'Classes' : 'Degrees'}
              </h2>
              
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="p-3 text-left w-12"></th>
                      <th className="p-3 text-left">
                        {instituteType === 1 ? 'Class' : 'Degree'}
                      </th>
                      <th className="p-3 text-left">
                        {instituteType === 1 ? 'Section' : 'Semester'}
                      </th>
                      <th className="p-3 text-left">Subjects</th>
                      <th className="p-3 text-center w-48">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((cls, index) => (
                      <React.Fragment key={cls.id}>
                        <tr className={index % 2 === 0 ? 'bg-card' : 'bg-accent'}>
                          <td className="p-3">
                            <button
                              onClick={() => toggleRow(cls.id)}
                              className="text-foreground hover:text-primary transition-colors"
                            >
                              {expandedRows.has(cls.id) ? (
                                <ChevronDown className="h-5 w-5" />
                              ) : (
                                <ChevronRight className="h-5 w-5" />
                              )}
                            </button>
                          </td>
                          <td className="p-3 font-medium">
                            {cls.className || cls.degree}
                          </td>
                          <td className="p-3">
                            {cls.section || cls.semester}
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {cls.subjects.length} subject(s)
                          </td>
                          <td className="p-3">
                            <div className="flex justify-center gap-2">
                              <Button variant="outline" size="sm" className="gap-1">
                                <Pencil className="h-3 w-3" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                className="gap-1"
                                onClick={() => handleDeleteClass(cls.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                        
                        {expandedRows.has(cls.id) && (
                          <tr>
                            <td colSpan={5} className="p-4 bg-muted/50">
                              <div className="space-y-4">
                                <h4 className="font-semibold text-foreground">
                                  Subjects for {cls.className || cls.degree} - {cls.section || cls.semester}
                                </h4>
                                
                                <div className="flex gap-2 flex-wrap">
                                  <Input
                                    type="text"
                                    placeholder="Subject name (e.g., Mathematics)"
                                    value={subjectInputs[cls.id]?.name || ''}
                                    onChange={(e) => setSubjectInputs({
                                      ...subjectInputs,
                                      [cls.id]: { 
                                        ...subjectInputs[cls.id],
                                        name: e.target.value,
                                        code: subjectInputs[cls.id]?.code || ''
                                      }
                                    })}
                                    className="flex-1 min-w-[200px]"
                                  />
                                  <Input
                                    type="text"
                                    placeholder="Subject code (e.g., MATH101)"
                                    value={subjectInputs[cls.id]?.code || ''}
                                    onChange={(e) => setSubjectInputs({
                                      ...subjectInputs,
                                      [cls.id]: { 
                                        ...subjectInputs[cls.id],
                                        code: e.target.value,
                                        name: subjectInputs[cls.id]?.name || ''
                                      }
                                    })}
                                    className="w-48"
                                  />
                                  <Button 
                                    onClick={() => handleAddSubject(cls.id)}
                                    size="sm"
                                    className="gap-2"
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add Subject
                                  </Button>
                                </div>

                                {cls.subjects.length > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                                    {cls.subjects.map((subject) => (
                                      <div 
                                        key={subject.id}
                                        className="flex items-center justify-between bg-card border border-border rounded-md p-3"
                                      >
                                        <div className="flex flex-col gap-1">
                                          <span className="text-sm font-medium">{subject.name}</span>
                                          <span className="text-xs text-muted-foreground">{subject.code}</span>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleDeleteSubject(cls.id, subject.id)}
                                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground italic">
                                    No subjects added yet. Add your first subject above.
                                  </p>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                
                {classes.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No {instituteType === 1 ? 'classes' : 'degrees'} added yet. Add your first {instituteType === 1 ? 'class' : 'degree'} above.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClassManager;
