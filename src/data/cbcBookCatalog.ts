export interface CBCBook {
  title: string;
  subject: string;
  grade: string;
  term: string;
  code: string;
  publisher?: string;
  isbn?: string;
}

export const cbcBookCatalog: CBCBook[] = [
  // Grade 1 Books
  { title: "Grade 1 Mathematics", subject: "Mathematics", grade: "1", term: "Term 1", code: "CBC-MATH-1-1" },
  { title: "Grade 1 English", subject: "English", grade: "1", term: "Term 1", code: "CBC-ENG-1-1" },
  { title: "Grade 1 Kiswahili", subject: "Kiswahili", grade: "1", term: "Term 1", code: "CBC-KIS-1-1" },
  { title: "Grade 1 Environmental Activities", subject: "Environmental Activities", grade: "1", term: "Term 1", code: "CBC-ENV-1-1" },
  { title: "Grade 1 Creative Arts", subject: "Creative Arts", grade: "1", term: "Term 1", code: "CBC-ART-1-1" },
  
  // Grade 2 Books
  { title: "Grade 2 Mathematics", subject: "Mathematics", grade: "2", term: "Term 1", code: "CBC-MATH-2-1" },
  { title: "Grade 2 English", subject: "English", grade: "2", term: "Term 1", code: "CBC-ENG-2-1" },
  { title: "Grade 2 Kiswahili", subject: "Kiswahili", grade: "2", term: "Term 1", code: "CBC-KIS-2-1" },
  { title: "Grade 2 Environmental Activities", subject: "Environmental Activities", grade: "2", term: "Term 1", code: "CBC-ENV-2-1" },
  { title: "Grade 2 Creative Arts", subject: "Creative Arts", grade: "2", term: "Term 1", code: "CBC-ART-2-1" },
  
  // Grade 3 Books
  { title: "Grade 3 Mathematics", subject: "Mathematics", grade: "3", term: "Term 1", code: "CBC-MATH-3-1" },
  { title: "Grade 3 English", subject: "English", grade: "3", term: "Term 1", code: "CBC-ENG-3-1" },
  { title: "Grade 3 Kiswahili", subject: "Kiswahili", grade: "3", term: "Term 1", code: "CBC-KIS-3-1" },
  { title: "Grade 3 Environmental Activities", subject: "Environmental Activities", grade: "3", term: "Term 1", code: "CBC-ENV-3-1" },
  { title: "Grade 3 Creative Arts", subject: "Creative Arts", grade: "3", term: "Term 1", code: "CBC-ART-3-1" },
  
  // Grade 4 Books
  { title: "Grade 4 Mathematics", subject: "Mathematics", grade: "4", term: "Term 1", code: "CBC-MATH-4-1" },
  { title: "Grade 4 English", subject: "English", grade: "4", term: "Term 1", code: "CBC-ENG-4-1" },
  { title: "Grade 4 Kiswahili", subject: "Kiswahili", grade: "4", term: "Term 1", code: "CBC-KIS-4-1" },
  { title: "Grade 4 Science and Technology", subject: "Science", grade: "4", term: "Term 1", code: "CBC-SCI-4-1" },
  { title: "Grade 4 Social Studies", subject: "Social Studies", grade: "4", term: "Term 1", code: "CBC-SOC-4-1" },
  { title: "Grade 4 Religious Education", subject: "Religious Education", grade: "4", term: "Term 1", code: "CBC-REL-4-1" },
  { title: "Grade 4 Creative Arts", subject: "Creative Arts", grade: "4", term: "Term 1", code: "CBC-ART-4-1" },
  
  // Grade 5 Books
  { title: "Grade 5 Mathematics", subject: "Mathematics", grade: "5", term: "Term 1", code: "CBC-MATH-5-1" },
  { title: "Grade 5 English", subject: "English", grade: "5", term: "Term 1", code: "CBC-ENG-5-1" },
  { title: "Grade 5 Kiswahili", subject: "Kiswahili", grade: "5", term: "Term 1", code: "CBC-KIS-5-1" },
  { title: "Grade 5 Science and Technology", subject: "Science", grade: "5", term: "Term 1", code: "CBC-SCI-5-1" },
  { title: "Grade 5 Social Studies", subject: "Social Studies", grade: "5", term: "Term 1", code: "CBC-SOC-5-1" },
  { title: "Grade 5 Religious Education", subject: "Religious Education", grade: "5", term: "Term 1", code: "CBC-REL-5-1" },
  { title: "Grade 5 Creative Arts", subject: "Creative Arts", grade: "5", term: "Term 1", code: "CBC-ART-5-1" },
  
  // Grade 6 Books
  { title: "Grade 6 Mathematics", subject: "Mathematics", grade: "6", term: "Term 1", code: "CBC-MATH-6-1" },
  { title: "Grade 6 English", subject: "English", grade: "6", term: "Term 1", code: "CBC-ENG-6-1" },
  { title: "Grade 6 Kiswahili", subject: "Kiswahili", grade: "6", term: "Term 1", code: "CBC-KIS-6-1" },
  { title: "Grade 6 Science and Technology", subject: "Science", grade: "6", term: "Term 1", code: "CBC-SCI-6-1" },
  { title: "Grade 6 Social Studies", subject: "Social Studies", grade: "6", term: "Term 1", code: "CBC-SOC-6-1" },
  { title: "Grade 6 Religious Education", subject: "Religious Education", grade: "6", term: "Term 1", code: "CBC-REL-6-1" },
  { title: "Grade 6 Creative Arts", subject: "Creative Arts", grade: "6", term: "Term 1", code: "CBC-ART-6-1" },
  
  // Grade 7 Books
  { title: "Grade 7 Mathematics", subject: "Mathematics", grade: "7", term: "Term 1", code: "CBC-MATH-7-1" },
  { title: "Grade 7 English", subject: "English", grade: "7", term: "Term 1", code: "CBC-ENG-7-1" },
  { title: "Grade 7 Kiswahili", subject: "Kiswahili", grade: "7", term: "Term 1", code: "CBC-KIS-7-1" },
  { title: "Grade 7 Science and Technology", subject: "Science", grade: "7", term: "Term 1", code: "CBC-SCI-7-1" },
  { title: "Grade 7 Social Studies", subject: "Social Studies", grade: "7", term: "Term 1", code: "CBC-SOC-7-1" },
  { title: "Grade 7 Religious Education", subject: "Religious Education", grade: "7", term: "Term 1", code: "CBC-REL-7-1" },
  { title: "Grade 7 Creative Arts", subject: "Creative Arts", grade: "7", term: "Term 1", code: "CBC-ART-7-1" },
  
  // Grade 8 Books
  { title: "Grade 8 Mathematics", subject: "Mathematics", grade: "8", term: "Term 1", code: "CBC-MATH-8-1" },
  { title: "Grade 8 English", subject: "English", grade: "8", term: "Term 1", code: "CBC-ENG-8-1" },
  { title: "Grade 8 Kiswahili", subject: "Kiswahili", grade: "8", term: "Term 1", code: "CBC-KIS-8-1" },
  { title: "Grade 8 Science and Technology", subject: "Science", grade: "8", term: "Term 1", code: "CBC-SCI-8-1" },
  { title: "Grade 8 Social Studies", subject: "Social Studies", grade: "8", term: "Term 1", code: "CBC-SOC-8-1" },
  { title: "Grade 8 Religious Education", subject: "Religious Education", grade: "8", term: "Term 1", code: "CBC-REL-8-1" },
  { title: "Grade 8 Creative Arts", subject: "Creative Arts", grade: "8", term: "Term 1", code: "CBC-ART-8-1" },

  // Term 2 Books (Sample)
  { title: "Grade 4 Mathematics Term 2", subject: "Mathematics", grade: "4", term: "Term 2", code: "CBC-MATH-4-2" },
  { title: "Grade 5 Science Term 2", subject: "Science", grade: "5", term: "Term 2", code: "CBC-SCI-5-2" },
  { title: "Grade 6 English Term 2", subject: "English", grade: "6", term: "Term 2", code: "CBC-ENG-6-2" },
  
  // Term 3 Books (Sample)
  { title: "Grade 4 Mathematics Term 3", subject: "Mathematics", grade: "4", term: "Term 3", code: "CBC-MATH-4-3" },
  { title: "Grade 5 Science Term 3", subject: "Science", grade: "5", term: "Term 3", code: "CBC-SCI-5-3" },
  { title: "Grade 6 English Term 3", subject: "English", grade: "6", term: "Term 3", code: "CBC-ENG-6-3" },
];

// Most requested books for quick suggestions
export const mostRequestedBooks = [
  "Grade 4 Mathematics",
  "Grade 5 Mathematics", 
  "Grade 6 Mathematics",
  "Grade 4 English",
  "Grade 5 English",
  "Grade 6 English",
  "Grade 4 Science and Technology",
  "Grade 5 Science and Technology",
  "Grade 6 Science and Technology",
  "Grade 4 Kiswahili",
  "Grade 5 Kiswahili",
  "Grade 6 Kiswahili"
];

export const searchCBCBooks = (query: string, limit: number = 10): CBCBook[] => {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase();
  
  return cbcBookCatalog
    .filter(book => 
      book.title.toLowerCase().includes(searchTerm) ||
      book.subject.toLowerCase().includes(searchTerm) ||
      book.grade.includes(searchTerm)
    )
    .slice(0, limit);
};

export const getBooksBySubject = (subject: string): CBCBook[] => {
  return cbcBookCatalog.filter(book => 
    book.subject.toLowerCase() === subject.toLowerCase()
  );
};

export const getBooksByGrade = (grade: string): CBCBook[] => {
  return cbcBookCatalog.filter(book => book.grade === grade);
};