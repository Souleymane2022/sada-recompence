import CertificateGenerator from '@/components/CertificateGenerator';
import LoginGate from '@/components/LoginGate';

export default function Home() {
  return (
    <LoginGate>
      <CertificateGenerator />
    </LoginGate>
  );
}
