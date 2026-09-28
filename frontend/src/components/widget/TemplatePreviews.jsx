import TemplateLayoutOne from './Templates/TemplateLayoutOne';
import TemplateLayoutTwo from './Templates/TemplateLayoutTwo';

export default function TemplatePreview({ templateId = 'master_1', ...props }) {
  const Component = (templateId === 'master_2' || templateId === '2') ? TemplateLayoutTwo : TemplateLayoutOne;
  return <Component {...props} />;
}
