import { QrApp } from "@/components/qr-app";

export default function QrLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <QrApp />
      {children}
    </>
  );
}
