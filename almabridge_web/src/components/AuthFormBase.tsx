import React, { useState } from "react";

export interface AuthField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

export interface AuthFormBaseProps {
  fields: AuthField[];
  onSubmit: (formData: Record<string, string>) => void;
  buttonText: string;
  showRoleSwitch?: boolean;
}

export default function AuthFormBase({
  fields,
  onSubmit,
  buttonText,
  showRoleSwitch = false,
}: AuthFormBaseProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isStudent, setIsStudent] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-fields">
        {fields.map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              required={field.required}
              value={formData[field.name] || ""}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        ))}
      </div>
      {showRoleSwitch && (
        <div className="role-switch">
          <label>
            <input
              type="radio"
              name="role"
              checked={isStudent}
              onChange={() => setIsStudent(true)}
            />
            Student
          </label>
          <label>
            <input
              type="radio"
              name="role"
              checked={!isStudent}
              onChange={() => setIsStudent(false)}
            />
            Professional
          </label>
        </div>
      )}
      <button type="submit" className="submit-button">
        {buttonText}
      </button>
    </form>
  );
}
