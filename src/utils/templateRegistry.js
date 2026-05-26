import React from 'react';
import Template1 from '../components/templates/Template1';
import Template2 from '../components/templates/Template2';
import Template3 from '../components/templates/Template3';
import Template4 from '../components/templates/Template4';
import Template5 from '../components/templates/Template5';
import Template6 from '../components/templates/Template6';
import Template7 from '../components/templates/Template7';
import Template8 from '../components/templates/Template8';
import Template9 from '../components/templates/Template9';
import CustomTemplate from '../components/templates/CustomTemplate';

export const templates = [
  { name: 'Template 1', component: Template1 },
  { name: 'Template 2', component: Template2 },
  { name: 'Template 3', component: Template3 },
  { name: 'Template 4', component: Template4 },
  { name: 'Template 5', component: Template5 },
  { name: 'Template 6', component: Template6 },
  { name: 'Template 7', component: Template7 },
  { name: 'Template 8', component: Template8 },
  { name: 'Template 9', component: Template9 },
];

export const getTemplate = (templateNumber) => {
  // Support custom ID (e.g., custom-1716...)
  if (typeof templateNumber === 'string' && templateNumber.startsWith('custom-')) {
    if (typeof window !== "undefined") {
      const customTemplates = JSON.parse(localStorage.getItem("custom_templates") || "[]");
      const custom = customTemplates.find(t => t.id === templateNumber);
      if (custom) {
        return (props) => <CustomTemplate {...props} config={custom.config} />;
      }
    }
  }

  // Support custom template numeric index fallback (e.g. index > 9)
  const idx = parseInt(templateNumber);
  if (!isNaN(idx)) {
    if (idx > templates.length) {
      if (typeof window !== "undefined") {
        const customTemplates = JSON.parse(localStorage.getItem("custom_templates") || "[]");
        const custom = customTemplates[idx - templates.length - 1];
        if (custom) {
          return (props) => <CustomTemplate {...props} config={custom.config} />;
        }
      }
    }
    return templates[idx - 1]?.component || templates[0].component;
  }

  return templates[0].component;
};

// Getter to fetch ALL active templates, including custom templates
export const getAllTemplates = () => {
  const baseTemplates = templates.map((t, idx) => ({
    id: idx + 1,
    name: t.name,
    isCustom: false,
    component: t.component
  }));

  if (typeof window !== "undefined") {
    const customTemplates = JSON.parse(localStorage.getItem("custom_templates") || "[]");
    const formattedCustom = customTemplates.map((t) => ({
      id: t.id,
      name: t.name,
      isCustom: true,
      component: (props) => <CustomTemplate {...props} config={t.config} />
    }));
    return [...formattedCustom, ...baseTemplates];
  }

  return baseTemplates;
};
