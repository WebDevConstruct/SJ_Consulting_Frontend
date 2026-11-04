// components/announcements/FormattedAnnouncementContent.tsx
type FormattedAnnouncementContentProps = {
  content: string;
};

export function FormattedAnnouncementContent({
  content,
}: FormattedAnnouncementContentProps) {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}