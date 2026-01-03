import Container from "@/app/components/shared/Container";

export default function ContactLayout({ children }) {
  return (
    <div className="bg-[url(/images/contact-pattern.png)] bg-repeat-x bg-bottom pb-30">
      <Container>{children}</Container>
    </div>
  );
}
