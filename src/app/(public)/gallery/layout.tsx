import Container from "@/app/components/shared/Container";

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Container>{children}</Container>;
}
