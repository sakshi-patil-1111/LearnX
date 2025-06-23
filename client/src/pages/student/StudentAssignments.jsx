import React, { useState } from "react";

const dummyAssignments = [
  {
    _id: "1",
    title: "Math Assignment 1",
    description: "Solve the questions from chapter 3.",
    dueDate: "2025-06-30T23:59:59",
    course: { title: "Mathematics" },
    fileUrl: "#",
    submissions: [],
  },
  {
    _id: "2",
    title: "Physics Lab Report",
    description: "Write a report on Newton's laws experiment.",
    dueDate: "2025-06-28T23:59:59",
    course: { title: "Physics" },
    fileUrl: "#",
    submissions: [
      {
        studentId: "dummy-student-id",
        submittedAt: "2025-06-24T15:30:00",
        fileUrl: "#",
      },
    ],
  },
];

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState(dummyAssignments);
  const dummyStudentId = "dummy-student-id";

  const handleSubmit = (e, assignmentId) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file) return alert("Please select a file.");

    const now = new Date().toISOString();

    const updated = assignments.map((a) =>
      a._id === assignmentId
        ? {
            ...a,
            submissions: [
              ...a.submissions,
              {
                studentId: dummyStudentId,
                submittedAt: now,
                fileUrl: "#",
              },
            ],
          }
        : a
    );

    setAssignments(updated);
    alert("Dummy submission successful!");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Assignments</h2>
      {assignments.map((assignment) => {
        const isLate = new Date() > new Date(assignment.dueDate);
        const submission = assignment.submissions.find(
          (s) => s.studentId === dummyStudentId
        );

        return (
          <div
            key={assignment._id}
            className="bg-white shadow-md rounded-lg p-4 mb-6"
          >
            <h3 className="text-xl font-bold">{assignment.title}</h3>
            <p className="text-gray-700">{assignment.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              Course: <strong>{assignment.course.title}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Due: {new Date(assignment.dueDate).toLocaleString()}
            </p>
            <div className="mt-2">
              <a
                href={assignment.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Download Assignment
              </a>
            </div>

            {submission ? (
              <div className="mt-3 text-green-600 text-sm">
                Submitted on:{" "}
                {new Date(submission.submittedAt).toLocaleString()}
              </div>
            ) : isLate ? (
              <div className="mt-3 text-red-600 text-sm">
                Submission closed (Deadline passed)
              </div>
            ) : (
              <form
                className="mt-4"
                onSubmit={(e) => handleSubmit(e, assignment._id)}
              >
                <label className="block text-sm font-medium mb-1">
                  Upload your solution:
                </label>
                <input
                  type="file"
                  name="file"
                  accept=".pdf,.txt"
                  className="mb-2"
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-1 rounded hover:bg-primary-dull"
                >
                  Submit Assignment
                </button>
              </form>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StudentAssignments;
